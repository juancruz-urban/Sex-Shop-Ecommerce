module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/app/api/process-payment/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mercadopago$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mercadopago/dist/index.js [app-route] (ecmascript)");
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mercadopago$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MercadoPagoConfig"]({
    accessToken: ("TURBOPACK compile-time value", "TEST-3049962488023946-081515-653e1c1b00810a8bb9cf075cc4008baa-1946279079")
});
async function POST(req) {
    try {
        const body = await req.json();
        // LOG COMPLETO de lo que recibimos
        console.log("=== BACKEND RECIBIÓ ===");
        console.log("Monto:", body.transaction_amount);
        console.log("Token:", body.token ? "✅ Presente" : "❌ Faltante");
        console.log("Payment Method ID:", body.payment_method_id);
        console.log("Installments:", body.installments);
        console.log("Issuer ID:", body.issuer_id);
        console.log("Email:", body.payer?.email);
        console.log("Identificación:", body.payer?.identification);
        console.log("========================");
        // Validaciones
        if (!body.token) {
            return Response.json({
                error: true,
                message: "No se pudo generar el token de la tarjeta"
            }, {
                status: 400
            });
        }
        // Preparar pago
        const paymentData = {
            transaction_amount: Number(body.transaction_amount),
            token: body.token,
            description: body.description || "Compra en tienda",
            installments: Number(body.installments || 1),
            payment_method_id: body.payment_method_id,
            payer: {
                email: body.payer.email,
                identification: body.payer.identification || {
                    type: "DNI",
                    number: "12345678"
                }
            }
        };
        // Agregar issuer_id si viene
        if (body.issuer_id) {
            paymentData.issuer_id = body.issuer_id;
        }
        console.log("=== ENVIANDO A MP ===");
        console.log(JSON.stringify(paymentData, null, 2));
        console.log("=====================");
        const payment = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mercadopago$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Payment"](client);
        const result = await payment.create({
            body: paymentData
        });
        console.log("=== RESPUESTA MP ===");
        console.log("Status:", result.status);
        console.log("ID:", result.id);
        console.log("Detail:", result.status_detail);
        console.log("====================");
        return Response.json({
            status: result.status,
            id: result.id,
            detail: result.status_detail
        });
    } catch (error) {
        console.error("=== ERROR MP ===");
        console.error("Message:", error.message);
        console.error("Cause:", error.cause);
        console.error("Status:", error.status);
        console.error("Response:", error.response?.data);
        console.error("================");
        // Mensajes amigables
        let userMessage = "No pudimos procesar el pago. Intentá con otra tarjeta";
        if (error.message?.includes("invalid")) {
            userMessage = "Datos de tarjeta inválidos";
        } else if (error.message?.includes("rejected")) {
            userMessage = "La tarjeta fue rechazada";
        } else if (error.message?.includes("insufficient")) {
            userMessage = "Fondos insuficientes";
        }
        return Response.json({
            error: true,
            message: userMessage
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__026c71db._.js.map