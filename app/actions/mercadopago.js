'use server'

import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function createPayment(data){

  try{

    const payment = new Payment(client)

    const result = await payment.create({
      body:{
        transaction_amount: Number(data.transaction_amount),
        token: data.token,
        description: data.description,
        installments: Number(data.installments),
        payment_method_id: data.payment_method_id,
        payer:{
          email: data.email
        }
      }
    })

    return {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    }

  }catch(error){

    console.error("MercadoPago error:", error)

    return {
      error:true,
      message:error.message
    }

  }

}