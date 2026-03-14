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
    accessToken: ("TURBOPACK compile-time value", "APP_USR-3049962488023946-081515-a5d58f2ef817aee3a5a9568740315e73-1946279079"),
    options: {
        timeout: 5000,
        idempotencyKey: generateIdempotencyKey() // Importante para evitar pagos duplicados
    }
});
function generateIdempotencyKey() {
    return Date.now().toString() + '-' + Math.random().toString(36).substring(7);
}
async function POST(req) {
    try {
        const body = await req.json();
        console.log("📦 Datos recibidos:", JSON.stringify(body, null, 2));
        // Validaciones exhaustivas
        if (!body.transaction_amount) {
            return Response.json({
                error: true,
                message: "Monto no proporcionado"
            }, {
                status: 400
            });
        }
        if (!body.token) {
            return Response.json({
                error: true,
                message: "Token de tarjeta no proporcionado"
            }, {
                status: 400
            });
        }
        if (!body.payment_method_id) {
            return Response.json({
                error: true,
                message: "Método de pago no identificado"
            }, {
                status: 400
            });
        }
        if (!body.payer?.email) {
            return Response.json({
                error: true,
                message: "Email del pagador no proporcionado"
            }, {
                status: 400
            });
        }
        const payment = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mercadopago$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Payment"](client);
        // Construcción del pago con todos los campos posibles
        const paymentData = {
            transaction_amount: Number(body.transaction_amount),
            token: body.token,
            description: body.description || "Compra en tienda",
            installments: Number(body.installments || 1),
            payment_method_id: body.payment_method_id,
            issuer_id: body.issuer_id || undefined,
            payer: {
                email: body.payer.email,
                identification: body.payer.identification ? {
                    type: body.payer.identification.type || "DNI",
                    number: body.payer.identification.number
                } : undefined,
                first_name: body.payer.first_name || "Comprador",
                last_name: body.payer.last_name || ""
            },
            additional_info: {
                items: [
                    {
                        id: "item-1",
                        title: "Producto",
                        quantity: 1,
                        unit_price: Number(body.transaction_amount)
                    }
                ]
            }
        };
        // Limpiar undefined
        Object.keys(paymentData).forEach((key)=>{
            if (paymentData[key] === undefined) {
                delete paymentData[key];
            }
        });
        console.log("🚀 Enviando a MercadoPago:", JSON.stringify(paymentData, null, 2));
        const result = await payment.create({
            body: paymentData
        });
        console.log("✅ Respuesta MP:", {
            status: result.status,
            id: result.id,
            detail: result.status_detail
        });
        return Response.json({
            success: true,
            status: result.status,
            id: result.id,
            detail: result.status_detail
        });
    } catch (error) {
        console.error("❌ Error:", {
            message: error.message,
            cause: error.cause,
            status: error.status,
            response: error.response?.data
        });
        return Response.json({
            success: false,
            error: true,
            message: error.message,
            cause: error.cause,
            details: error.response?.data || {}
        }, {
            status: error.status || 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__026c71db._.js.map