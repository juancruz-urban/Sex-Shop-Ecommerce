import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function POST(req) {
  try {
    const body = await req.json()
    
    // LOG COMPLETO de lo que recibimos
    console.log("=== BACKEND RECIBIÓ ===")
    console.log("Monto:", body.transaction_amount)
    console.log("Token:", body.token ? "✅ Presente" : "❌ Faltante")
    console.log("Payment Method ID:", body.payment_method_id)
    console.log("Installments:", body.installments)
    console.log("Issuer ID:", body.issuer_id)
    console.log("Email:", body.payer?.email)
    console.log("Identificación:", body.payer?.identification)
    console.log("========================")

    // Validaciones
    if (!body.token) {
      return Response.json({ 
        error: true, 
        message: "No se pudo generar el token de la tarjeta" 
      }, { status: 400 })
    }

    // Preparar pago
    const paymentData = {
      transaction_amount: Number(body.transaction_amount),
      token: body.token,
      description: body.description || "Compra en tienda",
      installments: Number(body.installments || 1),
      payment_method_id: body.payment_method_id,
      payer: {
        email: body.payer.email,
        identification: body.payer.identification || {
          type: "DNI",
          number: "12345678"
        }
      }
    }

    // Agregar issuer_id si viene
    if (body.issuer_id) {
      paymentData.issuer_id = body.issuer_id
    }

    console.log("=== ENVIANDO A MP ===")
    console.log(JSON.stringify(paymentData, null, 2))
    console.log("=====================")

    const payment = new Payment(client)
    const result = await payment.create({ body: paymentData })

    console.log("=== RESPUESTA MP ===")
    console.log("Status:", result.status)
    console.log("ID:", result.id)
    console.log("Detail:", result.status_detail)
    console.log("====================")

    return Response.json({
      status: result.status,
      id: result.id,
      detail: result.status_detail
    })

  } catch (error) {
    console.error("=== ERROR MP ===")
    console.error("Message:", error.message)
    console.error("Cause:", error.cause)
    console.error("Status:", error.status)
    console.error("Response:", error.response?.data)
    console.error("================")

    // Mensajes amigables
    let userMessage = "No pudimos procesar el pago. Intentá con otra tarjeta"
    
    if (error.message?.includes("invalid")) {
      userMessage = "Datos de tarjeta inválidos"
    } else if (error.message?.includes("rejected")) {
      userMessage = "La tarjeta fue rechazada"
    } else if (error.message?.includes("insufficient")) {
      userMessage = "Fondos insuficientes"
    }

    return Response.json({ 
      error: true, 
      message: userMessage
    }, { status: 400 })
  }
}