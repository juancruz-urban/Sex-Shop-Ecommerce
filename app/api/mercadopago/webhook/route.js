export async function POST(req) {

  try {

    const body = await req.json()

    if (body.type === "payment") {

      const paymentId = body.data.id

      const payment = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN}`
          }
        }
      )

      const paymentData = await payment.json()

      console.log("Webhook payment:", paymentData)

      if (paymentData.status === "approved") {

        const orderId = paymentData.external_reference

        console.log("Pago aprobado para orden:", orderId)

        // aquí deberías actualizar tu base de datos
      }

    }

    return Response.json({ received: true })

  } catch (error) {

    console.error("Webhook error:", error)

    return Response.json({ error: true })

  }

}