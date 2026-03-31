
/*
  const res = await fetch("https://apis.andreani.com/V2/tarifas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": `Bearer ${process.env.ANDREANI_API_KEY}`
    },
    body: JSON.stringify({
      cpOrigen,
      cpDestino,
      peso
    })
  })

  const data = await res.json()

  return data*/


// lib/andreani.js
// lib/andreani.js

export async function cotizarEnvio({ cpOrigen, cpDestino, peso }) {
  try {
    console.log(`Cotizando envío: ${cpOrigen} → ${cpDestino}, peso: ${peso}kg`)
    
    // Validar que los códigos postales existen
    if (!cpDestino || cpDestino.length < 4) {
      return 1500 // Valor por defecto
    }
    
    // Simulación de cálculo de envío
    // En producción, aquí iría la llamada real a la API de Andreani
    
    const origenNum = parseInt(cpOrigen) || 1406
    const destinoNum = parseInt(cpDestino) || 1000
    const distancia = Math.abs(origenNum - destinoNum)
    
    let costo = 1000 // Tarifa base
    
    if (distancia > 1000) costo += 800
    else if (distancia > 500) costo += 500
    else if (distancia > 100) costo += 300
    else costo += 150
    
    costo += peso * 200
    
    return Math.round(costo)
    
  } catch (error) {
    console.error('Error cotizando envío:', error)
    return 1500 // Retornar valor por defecto en caso de error
  }
}