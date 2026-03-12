import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN
})

export async function POST(req){

  try{

    const body = await req.json()

    const preference = new Preference(client)
    console.log(preference)
    const result = await preference.create({
      body:{
        items: body.items,
       

        back_urls:{
          success:'https://vercel.com/urbanjuancruz-gmailcoms-projects/sex-shop-ecommerce-oyax/app/success',
          failure:'https://vercel.com/urbanjuancruz-gmailcoms-projects/sex-shop-ecommerce-oyax/app/failure',
          pending:'https://vercel.com/urbanjuancruz-gmailcoms-projects/sex-shop-ecommerce-oyax/app/pending'
        },

        auto_return:"approved",
         // 🔹 evita pagos duplicados
        external_reference: crypto.randomUUID(),

       

        // 🔹 descripción visible en MercadoPago
        statement_descriptor: "TIENDA ONLINE"
      }
    })

    return Response.json({
      id: result.id
    })

  }catch(error){

    console.error("MercadoPago error:", error)

    return Response.json({ error:true })

  }

}