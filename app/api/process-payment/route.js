// app/api/process-payment/route.js

import { MercadoPagoConfig, Payment } from "mercadopago"
import { getMercadoPagoConfig } from "@/lib/mercadopago-config"
import { db } from "@/lib/db"

export async function POST(req) {
  try {
    const body = await req.json()
    
    // Obtener configuración según entorno
    const config = getMercadoPagoConfig()
    
    console.log('💳 Procesando pago en:', config.isSandbox ? 'SANDBOX' : 'PRODUCCIÓN')
    console.log('🔑 Public Key configurada:', config.publicKey?.substring(0, 10) + '...')
    console.log('🔑 Access Token configurado:', config.accessToken ? '✅ Sí' : '❌ No')
    
    // Validar que el access token existe
    if (!config.accessToken) {
      console.error('❌ MP_ACCESS_TOKEN no está configurado')
      return Response.json(
        { message: "Error de configuración de MercadoPago" }, 
        { status: 500 }
      )
    }
    
    // Validar datos de pago
    if (!body.token || !body.transaction_amount || !body.payment_method_id) {
      return Response.json(
        { message: "Faltan datos de pago" }, 
        { status: 400 }
      )
    }

    // Configurar cliente de MercadoPago con el token correcto
    const client = new MercadoPagoConfig({
      accessToken: config.accessToken
    })
    
    const payment = new Payment(client)
    
    const paymentData = {
      transaction_amount: Number(body.transaction_amount),
      token: body.token,
      description: `Compra ecommerce - Orden ${body.orderId}`,
      installments: body.installments || 1,
      payment_method_id: body.payment_method_id,
      payer: {
        email: body.payer?.email || "cliente@email.com"
      },
      external_reference: body.orderId
    }

    // En producción, agregar metadata adicional
    if (!config.isSandbox) {
      paymentData.metadata = {
        order_id: body.orderId,
        platform: "nextjs-ecommerce",
        version: "1.0.0"
      }
    }

    console.log('📤 Enviando pago a MercadoPago...')
    const result = await payment.create({ body: paymentData })
    
    console.log('📥 Respuesta MP:', result.status, result.id)

    // Actualizar orden
    const orderStatus = result.status === 'approved' ? 'approved' : 
                        result.status === 'pending' ? 'pending' : 'rejected'
    
    await db.execute({
      sql: `
        UPDATE orders 
        SET status = ?, 
            payment_id = ?, 
            payment_status = ?,
            payment_method = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
      args: [
        orderStatus, 
        result.id, 
        result.status,
        body.payment_method_id,
        body.orderId
      ]
    })

    return Response.json({
      status: result.status,
      orderId: body.orderId,
      paymentId: result.id,
      environment: config.isSandbox ? 'sandbox' : 'production'
    })

  } catch (error) {
    console.error('❌ Payment error:', error)
    
    return Response.json(
      { 
        message: "Error al procesar el pago", 
        error: error.message 
      }, 
      { status: 500 }
    )
  }
}