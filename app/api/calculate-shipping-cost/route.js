// app/api/calculate-shipping-cost/route.js

import { cotizarEnvio } from "@/lib/andreani"

export async function POST(req) {
  try {
    const { cp } = await req.json()
    
    console.log('Calculando envío para CP:', cp)

    // Validar que el código postal existe
    if (!cp || cp.length < 4) {
      return Response.json(
        { error: "Código postal inválido" },
        { status: 400 }
      )
    }

    // Calcular envío con Andreani
    const shippingCost = await cotizarEnvio({
      cpOrigen: "1406",
      cpDestino: cp,
      peso: 1
    })

    console.log('Costo de envío calculado:', shippingCost)

    return Response.json({
      shippingCost,
      cp
    })

  } catch (error) {
    console.error('Error calculating shipping:', error)
    return Response.json(
      { error: "Error al calcular el envío", shippingCost: 1500 }, // Valor por defecto
      { status: 200 } // Devolver 200 con valor por defecto para no romper el frontend
    )
  }
}