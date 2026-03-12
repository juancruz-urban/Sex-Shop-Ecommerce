"use client"

import { useState } from "react"

export default function CheckoutButton({ cartItems }) {

  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {

    if (!cartItems || cartItems.length === 0) {
      alert("El carrito está vacío")
      return
    }

    try {

      setLoading(true)

      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cartItems
        })
      })

      if (!res.ok) {
        throw new Error("Error creando la preferencia")
      }

      const data = await res.json()

      if (!data.id) {
        throw new Error("Preference ID inválido")
      }

     window.location.href =
`https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`

    } catch (error) {

      console.error("Checkout error:", error)
      alert("Hubo un problema iniciando el pago")

    } finally {

      setLoading(false)

    }

  }

  return (

    <button
      className="checkout-button"
      onClick={handleCheckout}
      disabled={loading}
    >

      {loading ? "Redirigiendo..." : "Pagar con Mercado Pago"}

    </button>

  )

}