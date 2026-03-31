// app/api/create-order/route.js

import { db } from "@/lib/db"
import { cotizarEnvio } from "@/lib/andreani"
import { randomUUID } from "crypto"

export async function POST(req) {
  try {
    const { items, shippingData } = await req.json()
    
    console.log('📦 Creando orden con datos:', { items, shippingData })

    // Calcular subtotal
    const subtotal = items.reduce(
      (acc, item) => acc + (item.unit_price || item.price) * item.quantity,
      0
    )

    // Cotizar envío
    const shippingCost = await cotizarEnvio({
      cpOrigen: "1406", // Código postal de origen (tu local)
      cpDestino: shippingData.cp,
      peso: 1 // Podrías calcular según los items
    })

    const total = subtotal + shippingCost
    const orderId = randomUUID()
    const orderNumber = `ORD-${Date.now()}`

    console.log('📊 Totales:', { subtotal, shippingCost, total })

    // Insertar orden con todos los datos
    await db.execute({
      sql: `
        INSERT INTO orders (
          id, 
          order_number,
          total, 
          subtotal,
          shipping_cost,
          status, 
          customer_name, 
          customer_email, 
          customer_phone,
          shipping_address, 
          shipping_city, 
          shipping_zip_code
        )
        VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)
      `,
      args: [
        orderId,
        orderNumber,
        total,
        subtotal,
        shippingCost,
        shippingData.name,
        shippingData.email,
        shippingData.phone || null,
        shippingData.address,
        shippingData.city || null,
        shippingData.cp
      ]
    })

    // Insertar items de la orden
    for (const item of items) {
      const price = item.unit_price || item.price
      const subtotalItem = price * item.quantity
      
      await db.execute({
        sql: `
          INSERT INTO order_items 
          (order_id, product_id, title, quantity, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          orderId,
          String(item.id),
          item.title || item.name,
          item.quantity,
          price,
          subtotalItem
        ]
      })
    }

    console.log('✅ Orden creada:', orderId)

    return Response.json({ 
      orderId,
      orderNumber,
      subtotal,
      shippingCost,
      total,
      status: 'pending'
    })

  } catch (error) {
    console.error('❌ Error creating order:', error)
    return Response.json(
      { error: true, message: error.message }, 
      { status: 500 }
    )
  }
}