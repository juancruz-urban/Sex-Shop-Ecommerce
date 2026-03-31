import { db } from "@/lib/db"

export async function GET() {
  try {
    const result = await db.execute(`
      SELECT * FROM products ORDER BY id DESC
    `)

    return Response.json(result.rows)

  } catch (error) {
    console.error("Error fetching products:", error)
    return Response.json({ error: true })
  }
}