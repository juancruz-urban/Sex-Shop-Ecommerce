"use server"

import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function createPayment(paymentData){

  const payment = new Payment(client)

  const result = await payment.create({
    body: paymentData
  })

  return result

}