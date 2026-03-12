"use client"

import Link from "next/link"

export default function FailurePage(){

  return (
    <div style={{padding:"40px", textAlign:"center"}}>
      <h1>❌ Pago rechazado</h1>

      <p>
        Hubo un problema con tu pago.
      </p>

      <Link href="/">
        Intentar nuevamente
      </Link>
    </div>
  )

}