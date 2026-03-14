import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function POST(req){

  try{

    const body = await req.json()

    const payment = new Payment(client)

    const result = await payment.create({
      body:{
        transaction_amount: Number(body.transaction_amount),
        token: body.token,
        description: "Compra tienda",
        installments: Number(body.installments),
        payment_method_id: body.payment_method_id,
        payer:{
          email: body.payer.email
        }
      }
    })

    return Response.json({
      status: result.status
    })

  }catch(e){

    console.error(e)

    return Response.json({error:true})

  }

}
