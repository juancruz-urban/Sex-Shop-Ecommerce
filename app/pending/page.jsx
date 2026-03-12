"use client"

import Link from "next/link"

export default function PendingPage(){

  return (
    <div style={{padding:"40px", textAlign:"center"}}>
      <h1>⏳ Pago pendiente</h1>

      <p>
        Tu pago está siendo procesado.
      </p>

      <Link href="/">
        Volver a la tienda
      </Link>
    </div>
  )

}