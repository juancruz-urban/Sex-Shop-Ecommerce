"use client"

import { initMercadoPago, Payment } from "@mercadopago/sdk-react"
import { useEffect } from "react"

export default function CardCheckout({ amount }) {

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)
  }, [])

  const initialization = {
    amount: amount
  }

  const customization = {
    paymentMethods: {
      creditCard: "all",
      debitCard: "all"
    }
  }

  const onSubmit = async ({ selectedPaymentMethod, formData }) => {

    const res = await fetch("/api/process-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const data = await res.json()

    if (data.status === "approved") {
      window.location.href = "/success"
    }

  }

  return (
    <div style={{marginTop:"20px"}}>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
      />
    </div>
  )

}
