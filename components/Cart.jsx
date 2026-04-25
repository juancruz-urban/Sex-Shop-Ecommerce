"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import ShippingForm from "./ShippingForm"
import CardCheckout from "./CardCheckout"
import "./Cart.css"

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart()
  const [step, setStep] = useState("cart")
  const [shippingData, setShippingData] = useState(null)
  const [shippingQuote, setShippingQuote] = useState(null)

  const handleClose = () => {
    setIsCartOpen(false)
    // Resetear estado después de cerrar
    setTimeout(() => {
      setStep("cart")
      setShippingData(null)
      setShippingQuote(null)
    }, 300)
  }

  // Si no está abierto, no renderizar nada
  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay de fondo */}
      <div className="cart-overlay-bg" onClick={handleClose} />
      
      {/* Drawer lateral */}
      <div className="cart-drawer cart-open">
        <div className="cart-container">
          
          {/* HEADER */}
          <div className="cart-header">
            <div>
              <h2>Carrito de compras</h2>
              {step !== "cart" && (
                <span className="step-indicator">
                  {step === "shipping" ? "Paso 1/2 - Envío" : "Paso 2/2 - Pago"}
                </span>
              )}
            </div>
            <button onClick={handleClose} className="close-btn">✕</button>
          </div>

          {/* STEP 1: CART */}
          {step === "cart" && (
            <>
              <div className="cart-items">
                {items.length === 0 ? (
                  <div className="empty-cart">
                    <p>🛒 Tu carrito está vacío</p>
                    <button onClick={handleClose} className="continue-shopping">
                      Seguir comprando
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=Producto"
                        }}
                      />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="item-price">
                          ${Number(item.price).toFixed(2)} x {item.quantity}
                        </p>
                        <p className="item-total">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        
                        {/* Controles de cantidad */}
                        <div className="cart-item-quantity">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                        aria-label="Eliminar producto"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <strong>${Number(totalPrice).toFixed(2)}</strong>
                  </div>
                  <button
                    className="checkout-btn"
                    onClick={() => setStep("shipping")}
                  >
                    Continuar compra →
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: SHIPPING */}
          {step === "shipping" && (
            <ShippingForm
              onBack={() => setStep("cart")}
              onNext={(data) => {
                setShippingData(data)
                setStep("payment")
              }}
              onShippingQuote={setShippingQuote}
              shippingQuote={shippingQuote}
            />
          )}

          {/* STEP 3: PAYMENT */}
          {step === "payment" && shippingData && (
            <CardCheckout
              key="card-checkout"
              shippingData={shippingData}
              shippingQuote={shippingQuote}
              onBack={() => setStep("shipping")}
              onComplete={handleClose}
            />
          )}

        </div>
      </div>
    </>
  )
}