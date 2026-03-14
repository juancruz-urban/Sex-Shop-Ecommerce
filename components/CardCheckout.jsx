"use client"

import { initMercadoPago, Payment } from "@mercadopago/sdk-react"
import { useEffect, useState, useCallback, useRef } from "react"

export default function CardCheckout({ amount }) {
  const [submitError, setSubmitError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [brickReady, setBrickReady] = useState(false)
  
  // Usamos useRef para evitar re-renders
  const brickInitialized = useRef(false)
  const errorRef = useRef(null) // Guardamos errores sin causar re-render

  useEffect(() => {
    // SOLO inicializamos una vez
    if (!brickInitialized.current) {
      console.log("🎯 Inicializando MercadoPago")
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)
      brickInitialized.current = true
    }
  }, []) // Array vacío = solo una vez

  const initialization = {
    amount: amount
  }

  const customization = {
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      prepaidCard: "all",
      ticket: false,
      bankTransfer: false,
      atm: false
    },
    visual: {
      style: {
        theme: "default"
      },
      hideFormTitle: false,
      showExternalReference: false
    }
  }

  // useCallback para evitar que la función cambie en cada render
  const onSubmit = useCallback(async ({ selectedPaymentMethod, formData }) => {
    setSubmitError(null)
    setProcessing(true)

    try {
      console.log("📤 Enviando pago...", formData)

      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          transaction_amount: Number(amount)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Error en el pago")
      }

      if (data.status === "approved") {
        window.location.href = "/success"
      } else if (["pending", "in_process"].includes(data.status)) {
        window.location.href = "/pending"
      } else {
        setSubmitError(`Estado: ${data.status}`)
      }

    } catch (error) {
      console.error("Error:", error)
      setSubmitError(error.message)
    } finally {
      setProcessing(false)
    }
  }, [amount]) // Solo depende de amount

  // ⚠️ IMPORTANTE: Este onError NO debe modificar el estado
  // Solo logueamos, sin setState para evitar re-renders
  const onError = useCallback((error) => {
    // Guardamos en ref sin causar re-render
    errorRef.current = error
    
    // Solo logueamos en consola, NO actualizamos estado
    console.log("ℹ️ Brick event:", {
      type: error.type,
      cause: error.cause,
      message: error.message
    })
    
    // 👇 NO HACEMOS setBrickError ni nada que cause re-render
  }, []) // Array vacío = función estable

  const onReady = useCallback(() => {
    console.log("✅ Brick listo")
    setBrickReady(true)
  }, [])

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto",
      padding: "20px"
    }}>
      {submitError && (
        <div style={{
          backgroundColor: "#fee",
          border: "1px solid #faa",
          borderRadius: "8px",
          color: "#c00",
          padding: "16px",
          marginBottom: "20px"
        }}>
          <strong>Error:</strong> {submitError}
        </div>
      )}

      {processing && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px 48px",
            borderRadius: "12px"
          }}>
            ⏳ Procesando pago...
          </div>
        </div>
      )}

      {!brickReady && !submitError && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px"
        }}>
          Cargando...
        </div>
      )}

      {/* El Payment brick NO debe tener keys que cambien */}
      <Payment
        key="payment-brick" // Key fija para evitar recreación
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={onError}
        onReady={onReady}
      />
    </div>
  )
}