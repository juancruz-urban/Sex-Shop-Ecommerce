// lib/db.js

import { createClient } from "@libsql/client"

export const db = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_DB_URL,
  authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
})