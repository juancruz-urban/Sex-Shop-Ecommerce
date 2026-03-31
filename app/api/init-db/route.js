import { db } from "@/lib/db"

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER DEFAULT 0,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

        // 🧾 ORDERS
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        status TEXT DEFAULT 'pending',
        total INTEGER NOT NULL,
        external_reference TEXT,
        payment_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 📦 ORDER ITEMS
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT,
        product_id INTEGER,
        title TEXT,
        quantity INTEGER,
        unit_price INTEGER,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      )
    `)

    return Response.json({ ok: true, message: "DB inicializada" })

  } catch (error) {
    console.error(error)
    return Response.json({ ok: false })
  }
}