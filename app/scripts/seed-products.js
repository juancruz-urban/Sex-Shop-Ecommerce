// scripts/seed-products.js
// Ejecutar: node scripts/seed-products.js

// scripts/seed-products.js
import { createClient } from "@libsql/client"
import { products } from "../../data/products-sex.js"

// ==================== CONFIGURACIÓN ====================



// ==================== CONFIGURACIÓN ====================
const TURSO_CONFIG = {
  url: "libsql://sex-shop-juanx.aws-us-east-1.turso.io", // 👈 Completa con tu URL de Turso
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMzNDkwNjEsImlkIjoiMDE5Y2UzODQtNWMwMS03OTcxLTg4N2ItM2Q2YTM5ZTFmNDNiIiwicmlkIjoiZWQ4NmU5Y2MtODkyNC00NzJlLTk1OTEtMjBkYWIxZDhjMTQyIn0.680osHOic2YxKw6AZiJ7SrfOEtIIKgcrVHpKrwu3o2HpF3c4oS0Stb6NkTV91B-NQgAR7rbSRanaDQSZq9x9Bw" // 👈 Completa con tu token de Turso
}

// ==================== FIN CONFIGURACIÓN ====================

const db = createClient({
  url: TURSO_CONFIG.url,
  authToken: TURSO_CONFIG.authToken
})

// ==================== FUNCIONES ====================

function cleanId(id) {
  if (!id) return null
  let cleaned = id.toString()
  if (cleaned.includes('_')) {
    const parts = cleaned.split('_')
    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        return part
      }
    }
    return parts[0]
  }
  if (/^\d+$/.test(cleaned)) {
    return cleaned
  }
  const numbersOnly = cleaned.replace(/[^\d]/g, '')
  return numbersOnly || cleaned
}

function cleanPrice(price) {
  if (price === undefined || price === null || price === "") return 0
  if (typeof price === 'number') return price
  if (typeof price === 'string') {
    let cleaned = price.trim().replace(/\./g, '').replace(',', '.')
    cleaned = cleaned.replace(/[^\d.-]/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function cleanDescription(html) {
  if (!html) return ''
  let text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return text || ''
}

function generateUniqueSKU(sku, id, nombre, usedSKUs) {
  let baseSKU = ""
  if (sku && sku !== "" && sku !== " ") {
    baseSKU = sku.trim().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/gi, '').toUpperCase()
  }
  if (!baseSKU) {
    const prefix = nombre ? nombre.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') : 'PRD'
    baseSKU = `${prefix}-${id}`
  }
  if (!baseSKU) baseSKU = `PRD-${Date.now()}`
  
  let finalSKU = baseSKU
  let counter = 1
  while (usedSKUs.has(finalSKU)) {
    finalSKU = `${baseSKU}-${counter}`
    counter++
  }
  usedSKUs.add(finalSKU)
  return finalSKU
}

function generateUniqueSlug(identificador, nombre, id, usedSlugs) {
  let baseSlug = ""
  if (identificador && identificador !== "" && identificador !== " ") {
    baseSlug = identificador.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  if (!baseSlug && nombre) {
    baseSlug = nombre.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  if (!baseSlug) baseSlug = `producto-${id}`
  
  let finalSlug = baseSlug
  let counter = 1
  while (usedSlugs.has(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }
  usedSlugs.add(finalSlug)
  return finalSlug
}

function extractMainCategory(categories) {
  if (!categories) return ''
  if (typeof categories === 'string') {
    return categories.split(' > ')[0] || categories
  }
  return ''
}

async function createTableIfNotExists() {
  console.log('🔍 Verificando tabla products...')
  const result = await db.execute({ sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='products'` })
  
  if (result.rows.length === 0) {
    console.log('📦 Creando tabla products...')
    await db.execute(`
      CREATE TABLE products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        sku TEXT UNIQUE,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        category TEXT,
        categories TEXT,
        image TEXT,
        image_public_id TEXT,
        image_folder TEXT,
        image_url TEXT,
        image_id TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT true,
        stock_quantity INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await db.execute(`CREATE INDEX idx_products_slug ON products(slug)`)
    await db.execute(`CREATE INDEX idx_products_sku ON products(sku)`)
    await db.execute(`CREATE INDEX idx_products_category ON products(category)`)
    console.log('✅ Tabla products creada')
  } else {
    console.log('✅ Tabla products ya existe')
  }
}

// ==================== MIGRACIÓN PRINCIPAL ====================

async function seedProducts() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 INICIANDO MIGRACIÓN DE PRODUCTOS')
  console.log('='.repeat(60) + '\n')
  
  if (!TURSO_CONFIG.url || TURSO_CONFIG.url.includes("TU-BASE-DE-DATOS")) {
    console.error('❌ ERROR: Configura la URL de Turso')
    process.exit(1)
  }
  if (!TURSO_CONFIG.authToken || TURSO_CONFIG.authToken.includes("TU-TOKEN")) {
    console.error('❌ ERROR: Configura el token de Turso')
    process.exit(1)
  }
  
  console.log('🔌 Conectando a Turso...')
  try {
    await db.execute('SELECT 1')
    console.log('✅ Conexión OK\n')
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    process.exit(1)
  }
  
  await createTableIfNotExists()
  console.log('')
  
  if (!products || products.length === 0) {
    console.error('❌ No hay productos')
    process.exit(1)
  }
  
  console.log(`📦 Total de productos: ${products.length}\n`)
  
  const usedSKUs = new Set()
  const usedSlugs = new Set()
  const productsToInsert = []
  
  console.log('🔄 Transformando productos...\n')
  
  for (let i = 0; i < products.length; i++) {
    const item = products[i]
    const producto = item.producto
    const imagen = item.imagen
    
    if (!producto) continue
    
    const originalId = imagen?.id || `prod_${i}`
    const cleanIdValue = cleanId(originalId)
    const id = cleanIdValue || `${i + 1}`
    const nombre = producto["Nombre"] || ""
    const precio = producto["Precio"] || "0"
    const skuOriginal = producto["SKU"] || ""
    const categories = producto["Categorías"] || ""
    
    productsToInsert.push({
      id: id.toString(),
      originalId: originalId,
      name: nombre,
      slug: generateUniqueSlug(producto["Identificador de URL"], nombre, id, usedSlugs),
      sku: generateUniqueSKU(skuOriginal, id, nombre, usedSKUs),
      description: cleanDescription(producto["Descripción"] || ""),
      price: cleanPrice(precio),
      category: extractMainCategory(categories),
      categories: categories,
      image: imagen?.url || "",
      image_public_id: imagen?.public_id || null,
      image_folder: imagen?.folder || null,
      image_url: imagen?.url || "",
      image_id: imagen?.id || null,
      originalSKU: skuOriginal
    })
  }
  
  console.log(`✅ ${productsToInsert.length} productos transformados\n`)
  
  const cleanedIds = productsToInsert.filter(p => p.originalId !== p.id)
  if (cleanedIds.length > 0) {
    console.log(`📊 IDs limpiados: ${cleanedIds.length} productos`)
    cleanedIds.slice(0, 5).forEach(p => {
      console.log(`   • "${p.originalId}" → "${p.id}"`)
    })
    if (cleanedIds.length > 5) console.log(`   ... y ${cleanedIds.length - 5} más`)
    console.log('')
  }
  
  console.log('🗑️  Limpiando tabla products...')
  await db.execute({ sql: `DELETE FROM products` })
  console.log('✅ Tabla limpiada\n')
  
  console.log('🔄 Insertando productos...\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < productsToInsert.length; i++) {
    const p = productsToInsert[i]
    
    try {
      await db.execute({
        sql: `
          INSERT INTO products (
            id, name, slug, sku, description, price, original_price,
            category, categories, image, image_public_id, image_folder,
            image_url, image_id, rating, reviews, in_stock, stock_quantity,
            featured, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, 0, 0, datetime('now'), datetime('now'))
        `,
        args: [
          p.id, p.name, p.slug, p.sku, p.description, p.price, null,
          p.category, p.categories, p.image, p.image_public_id, p.image_folder,
          p.image_url, p.image_id
        ]
      })
      successCount++
      process.stdout.write(`\r✅ Progreso: ${successCount}/${productsToInsert.length} - ${p.name.substring(0, 45)}`)
    } catch (error) {
      console.error(`\n❌ Error en ${p.name}: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n')
  console.log('='.repeat(60))
  console.log('📊 RESUMEN DE MIGRACIÓN')
  console.log('='.repeat(60))
  console.log(`✅ Éxitos: ${successCount}`)
  console.log(`❌ Errores: ${errorCount}`)
  console.log(`📦 Total: ${productsToInsert.length}`)
  
  const stats = await db.execute({ sql: `SELECT COUNT(*) as total FROM products` })
  console.log(`\n🎉 Total de productos en base de datos: ${stats.rows[0].total}`)
  console.log('='.repeat(60))
}

seedProducts().catch(console.error)