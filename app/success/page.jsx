"use client"

import Link from "next/link"

export default function SuccessPage(){

  return (
    <div style={{padding:"40px", textAlign:"center"}}>
      <h1>✅ Pago aprobado</h1>

      <p>
        Tu pago fue procesado correctamente.
      </p>

      <Link href="/">
        Volver a la tienda
      </Link>
    </div>
  )

}