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
          success:'http://localhost:3000/',
          failure:'https://www.google.com/',
          pending:'https://www.google.com/'
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