import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function POST(req) {
  try {
    const body = await req.json()
    
    // Validaciones específicas para el submit
    if (!body.token) {
      return Response.json({ 
        error: true, 
        message: "Error con la tarjeta. Por favor, intentá de nuevo." 
      }, { status: 400 })
    }

    if (!body.payment_method_id) {
      return Response.json({ 
        error: true, 
        message: "No se pudo identificar el tipo de tarjeta" 
      }, { status: 400 })
    }

    if (!body.payer?.email) {
      return Response.json({ 
        error: true, 
        message: "El email es obligatorio" 
      }, { status: 400 })
    }

    const payment = new Payment(client)
    
    const paymentData = {
      transaction_amount: Number(body.transaction_amount),
      token: body.token,
      description: body.description || "Compra en tienda",
      installments: Number(body.installments || 1),
      payment_method_id: body.payment_method_id,
      issuer_id: body.issuer_id,
      payer: {
        email: body.payer.email,
        identification: body.payer.identification,
        first_name: body.payer.first_name || "Comprador",
        last_name: body.payer.last_name || ""
      }
    }

    const result = await payment.create({ body: paymentData })

    return Response.json({
      status: result.status,
      id: result.id,
      detail: result.status_detail
    })

  } catch (error) {
    console.error("Error en pago:", error)
    
    // Mensaje amigable para el usuario
    let userMessage = "Error al procesar el pago"
    
    if (error.message?.includes("rejected")) {
      userMessage = "La tarjeta fue rechazada. Probá con otra tarjeta"
    } else if (error.message?.includes("insufficient")) {
      userMessage = "Fondos insuficientes"
    } else if (error.message?.includes("invalid")) {
      userMessage = "Datos de tarjeta inválidos"
    }

    return Response.json({ 
      error: true, 
      message: userMessage 
    }, { status: 400 })
  }
}