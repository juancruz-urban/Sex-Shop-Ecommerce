"use client"

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import CardCheckout from "./CardCheckout"
import "./Cart.css"

export default function Cart({ onCheckout }) {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <div className={`cart-drawer ${isCartOpen ? "cart-open" : ""}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            <ShoppingBag size={22} />
            Tu Carrito
          </h2>
          <button 
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={48} />
            </div>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">
                      {formatPrice(item.price)}
                    </span>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-shipping">
                <span>Envío</span>
                <span className="free-shipping">Gratis</span>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div>
                <CardCheckout amount={totalPrice}></CardCheckout>
              </div>

              <button 
                className="checkout-btn"
                onClick={onCheckout}
              >
                Pagar con Mercado Pago
              </button>
            </div>
          </>
        )}
      </div>

      {isCartOpen && (
        <div 
          className="cart-overlay" 
          onClick={() => setIsCartOpen(false)} 
        />
      )}
    </>
  )
}
