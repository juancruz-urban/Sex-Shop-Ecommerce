"use client"

import { initMercadoPago, Payment } from "@mercadopago/sdk-react"
import { useEffect, useState, useCallback, useRef } from "react"

export default function CardCheckout({ amount }) {
  const [submitError, setSubmitError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [brickReady, setBrickReady] = useState(false)
  
  const brickInitialized = useRef(false)

  useEffect(() => {
    if (!brickInitialized.current) {
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)
      brickInitialized.current = true
    }
  }, [])

  const initialization = {
    amount: amount
  }

  const customization = {
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      prepaidCard: "all"
    },
    visual: {
      style: {
        theme: "default"
      }
    }
  }

  const onSubmit = useCallback(async ({ selectedPaymentMethod, formData }) => {
    // Limpiamos errores anteriores
    setSubmitError(null)
    setProcessing(true)

    try {
      console.log("📤 Enviando pago...", {
        metodo: selectedPaymentMethod,
        monto: amount,
        email: formData.payer?.email,
        payment_method_id: formData.payment_method_id
      })

      // Verificamos que tenemos token
      if (!formData.token) {
        throw new Error("Error al procesar la tarjeta. Intentá de nuevo.")
      }

      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          transaction_amount: Number(amount),
          description: "Compra en tienda"
        })
      })

      const data = await res.json()
      console.log("📥 Respuesta:", data)

      if (!res.ok) {
        throw new Error(data.message || "Error al procesar el pago")
      }

      // Redirigir según el estado del pago
      if (data.status === "approved") {
        window.location.href = "/success"
      } else if (["pending", "in_process"].includes(data.status)) {
        window.location.href = "/pending"
      } else {
        setSubmitError(`El pago quedó en estado: ${data.status}`)
      }

    } catch (error) {
      console.error("❌ Error en submit:", error)
      setSubmitError(error.message)
    } finally {
      setProcessing(false)
    }
  }, [amount])

  // ⚠️ CRÍTICO: Este onError NO hace NADA
  // Solo ignoramos todos los errores del Brick
  const onError = useCallback(() => {
    // ABSOLUTAMENTE NADA
    // No console.log, no setState, no ref, nada
    return null
  }, [])

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
      {/* SOLO mostramos errores del SUBMIT */}
      {submitError && (
        <div style={{
          backgroundColor: "#fee",
          border: "1px solid #faa",
          borderRadius: "8px",
          color: "#c00",
          padding: "16px",
          marginBottom: "20px",
          fontSize: "14px"
        }}>
          <strong>Error al procesar el pago:</strong> {submitError}
        </div>
      )}

      {/* Loading overlay */}
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
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            ⏳ Procesando pago...
          </div>
        </div>
      )}

      {/* Loading del Brick */}
      {!brickReady && !submitError && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px"
        }}>
          Cargando formulario de pago...
        </div>
      )}

      {/* Componente de pago */}
      <Payment
        key="payment-brick"
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={onError}
        onReady={onReady}
      />
    </div>
  )
}