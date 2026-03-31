import { MercadoPagoConfig, Preference } from "mercadopago"
import { db } from "@/lib/db"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN 
})

export async function POST(req) {
  try {
    const { items, customer } = await req.json()

    // 🔹 1. Crear orden en DB
    const orderId = crypto.randomUUID()

    await db.execute({
      sql: `
        INSERT INTO orders (id, customer_name, email, address, city, zip, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        orderId,
        customer.name,
        customer.email,
        customer.address,
        customer.city,
        customer.zip,
        "pending"
      ]
    })

    // 🔹 2. Crear items
    for (const item of items) {
      await db.execute({
        sql: `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `,
        args: [orderId, item.id, item.quantity, item.price]
      })
    }

    // 🔹 3. Crear preferencia
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: items.map(i => ({
          title: i.name,
          quantity: Number(i.quantity),
          unit_price: Number(i.price)
        })),

        external_reference: orderId, // 🔥 CLAVE

        back_urls: {
          success: `${process.env.BASE_URL}/success`,
          failure: `${process.env.BASE_URL}/failure`,
          pending: `${process.env.BASE_URL}/pending`
        },

        auto_return: "approved"
      }
    })

    return Response.json({
      init_point: result.init_point
    })

  } catch (error) {
    console.error("Checkout error:", error)
    return Response.json({ error: true })
  }
}