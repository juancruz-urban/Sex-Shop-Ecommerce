// lib/mercadopago-config.js

export const getMercadoPagoConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Para desarrollo (sandbox)
  const sandboxConfig = {
    publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
    accessToken: process.env.MP_ACCESS_TOKEN, // SIN NEXT_PUBLIC
    isSandbox: true
  }
  
  // Para producción
  const productionConfig = {
    publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
    accessToken: process.env.MP_ACCESS_TOKEN, // SIN NEXT_PUBLIC
    isSandbox: false
  }
  
  const config = isProduction ? productionConfig : sandboxConfig
  
  // Verificar que las variables existen
  if (!config.publicKey) {
    console.error('❌ Faltan NEXT_PUBLIC_MP_PUBLIC_KEY en variables de entorno')
  }
  
  if (!config.accessToken) {
    console.error('❌ Faltan MP_ACCESS_TOKEN en variables de entorno')
  }
  
  return {
    ...config,
    getBaseUrl: () => 'https://api.mercadopago.com'
  }
}

// Detectar entorno en frontend
export const isSandboxMode = () => {
  if (typeof window !== 'undefined') {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''
    return publicKey.startsWith('TEST-')
  }
  return false
}