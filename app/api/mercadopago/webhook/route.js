// app/api/webhook/route.js

import { db } from "@/lib/db"

export async function POST(req) {
  try {
    const body = await req.json()
    
    const isSandbox = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY?.startsWith('TEST-')
    
    console.log('🔔 Webhook recibido:', {
      type: body.type,
      environment: isSandbox ? 'sandbox' : 'production',
      timestamp: new Date().toISOString()
    })

    // Verificar firma del webhook (seguridad)
    const signature = req.headers.get('x-signature')
    if (!signature && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Webhook sin firma - posible ataque')
      // En producción, deberías verificar la firma
    }

    if (body.type === "payment") {
      const paymentId = body.data.id

      // Obtener datos del pago
      const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
          }
        }
      )

      if (!mpRes.ok) {
        throw new Error(`Error fetching payment: ${mpRes.status}`)
      }

      const payment = await mpRes.json()
      
      console.log('💳 Pago webhook:', {
        id: payment.id,
        status: payment.status,
        orderId: payment.external_reference,
        environment: isSandbox ? 'sandbox' : 'production'
      })

      if (payment.status === "approved") {
        const orderId = payment.external_reference

        // Actualizar orden
        await db.execute({
          sql: `
            UPDATE orders
            SET status = 'approved', 
                payment_status = 'approved',
                payment_id = ?,
                updated_at = datetime('now')
            WHERE id = ?
          `,
          args: [paymentId, orderId]
        })

        // En producción, podrías enviar email de confirmación
        if (!isSandbox) {
          await sendOrderConfirmationEmail(orderId)
        }
      }
    }

    return Response.json({ ok: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    
    // En producción, registrar en servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Enviar a servicio de errores
    }
    
    return Response.json({ error: true }, { status: 500 })
  }
}