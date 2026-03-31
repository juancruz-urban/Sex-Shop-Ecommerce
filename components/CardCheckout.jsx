"use client"

import { useCart } from "@/context/CartContext"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useState, useRef, useEffect } from "react"
import "./CardCheckout.css"

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)

export default function CardCheckout({ shippingData, shippingQuote, onBack, onComplete }) {
  const { items, totalPrice, clearCart, setIsCartOpen } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const hasProcessed = useRef(false) // Prevenir múltiples procesamientos
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const handleSubmit = async (formData) => {
    // Prevenir múltiples envíos
    if (isProcessing || hasProcessed.current) return
    
    hasProcessed.current = true
    setIsProcessing(true)

    try {
      console.log('🚀 Iniciando checkout...')

      // PASO 1: Crear la orden y cotizar envío
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            title: item.name,
            quantity: item.quantity,
            price: item.price,
            unit_price: item.price
          })),
          shippingData
        })
      })

      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.message || "Error al crear la orden")
      }

      const orderData = await orderRes.json()
      
      if (mounted.current) {
        setOrderDetails(orderData)
      }
      console.log('📋 Orden creada:', orderData)

      // PASO 2: Procesar el pago con MercadoPago
      const paymentRes = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderId: orderData.orderId,
          transaction_amount: orderData.total,
          payer: {
            email: shippingData.email
          }
        })
      })

      const paymentData = await paymentRes.json()
      console.log('💳 Respuesta pago:', paymentData)

      // PASO 3: Manejar la respuesta
      if (paymentData.status === 'approved') {
        if (mounted.current) {
          clearCart()
          setIsCartOpen(false)
          alert('🎉 ¡Pago exitoso! Gracias por tu compra')
          onComplete?.()
        }
      } else if (paymentData.status === 'pending') {
        if (mounted.current) {
          alert('⏳ Pago pendiente de confirmación. Te contactaremos pronto.')
          setIsCartOpen(false)
          onComplete?.()
        }
      } else {
        if (mounted.current) {
          alert(`❌ Pago rechazado: ${paymentData.message || 'Intenta con otro método'}`)
        }
      }

    } catch (error) {
      console.error('❌ Checkout error:', error)
      if (mounted.current) {
        alert('Error al procesar el pago. Por favor intenta de nuevo')
      }
    } finally {
      if (mounted.current) {
        setIsProcessing(false)
      }
      // Resetear el flag después de un tiempo
      setTimeout(() => {
        hasProcessed.current = false
      }, 1000)
    }
  }

  return (
    <div className="checkout-container">
      <button onClick={onBack} className="back-btn" disabled={isProcessing}>
        ← Volver
      </button>

      <h3>Resumen de compra</h3>

      <div className="order-summary">
        <div className="summary-item">
          <span>Subtotal ({items.length} productos):</span>
          <strong>${Number(totalPrice).toFixed(2)}</strong>
        </div>
        
        <div className="summary-item">
          <span>Envío:</span>
          <strong>
            {shippingQuote !== null 
              ? `$${Number(shippingQuote).toFixed(2)}` 
              : orderDetails 
                ? `$${Number(orderDetails.shippingCost).toFixed(2)}` 
                : "Calculando..."
            }
          </strong>
        </div>
        
        <div className="summary-item total">
          <span>Total a pagar:</span>
          <strong>
            {orderDetails 
              ? `$${Number(orderDetails.total).toFixed(2)}` 
              : shippingQuote !== null 
                ? `$${(totalPrice + shippingQuote).toFixed(2)}`
                : `$${Number(totalPrice).toFixed(2)}`
            }
          </strong>
        </div>
      </div>

      <div className="shipping-info">
        <h4>Datos de envío</h4>
        <p><strong>{shippingData.name}</strong></p>
        <p>{shippingData.address}, {shippingData.city}</p>
        <p>CP: {shippingData.cp}</p>
        <p>Tel: {shippingData.phone}</p>
        <p>Email: {shippingData.email}</p>
      </div>

      {isProcessing && (
        <div className="processing-message">
          <div className="spinner"></div>
          <p>Procesando pago, por favor espera...</p>
          <p className="processing-note">No cierres esta ventana</p>
        </div>
      )}

      {!isProcessing && (
        <div className="card-payment-wrapper">
          <h4>Datos de la tarjeta</h4>
          <CardPayment
            initialization={{
              amount: Number(orderDetails?.total || (totalPrice + (shippingQuote || 0)))
            }}
            onSubmit={handleSubmit}
            onReady={() => console.log("✅ MercadoPago ready")}
            onError={(error) => console.error("MP Error:", error)}
          />
        </div>
      )}
    </div>
  )
}