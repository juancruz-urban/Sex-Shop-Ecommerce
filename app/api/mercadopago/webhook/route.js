export async function POST(req) {
  try {
    const body = await req.json()

    console.log("Webhook recibido:", body)

    if (body.type === "payment") {
      const paymentId = body.data.id

      // 🔑 CONSULTAR PAGO REAL
      const paymentRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN}`
          }
        }
      )

      const paymentData = await paymentRes.json()

      console.log("Payment data:", paymentData)

      // 🔥 VALIDACIÓN IMPORTANTE
      if (paymentData.status === "approved") {
        const orderId = paymentData.external_reference

        console.log("✅ Pago aprobado:", orderId)

        // 👉 ACA GUARDÁS EN DB
        // await db.orders.update({ id: orderId, status: "paid" })

      } else {
        console.log("⚠️ Pago NO aprobado:", paymentData.status)
      }
    }

    return Response.json({ received: true })

  } catch (error) {
    console.error("❌ Webhook error:", error)
    return Response.json({ error: true })
  }
}