import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function POST(req) {
  try {
    const body = await req.json()

    const orderId = crypto.randomUUID()

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: body.items,

        payer: {
          name: body.payer.name,
          email: body.payer.email
        },

        external_reference: orderId,

        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`
        },

        auto_return: "approved"
      }
    })

    return Response.json({
      id: result.id
    })

  } catch (error) {
    console.error("MercadoPago error:", error)
    return Response.json({ error: true })
  }
}