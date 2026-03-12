import { MercadoPagoConfig } from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN,
});