"use client"

import { Star, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import "./ProductCard.css"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)
    setTimeout(() => setIsAdding(false), 500)
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <article className="product-card">
      <div className="product-image-container">
        {discount > 0 && (
          <span className="product-discount">-{discount}%</span>
        )}
        <button 
          className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart size={18} fill={isWishlisted ? "#c44d3b" : "none"} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        {!product.inStock && (
          <div className="out-of-stock-overlay">
            <span>Agotado</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? "#f59e0b" : "none"}
                color={i < Math.floor(product.rating) ? "#f59e0b" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="rating-text">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="product-prices">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart size={18} />
          <span>{product.inStock ? "Agregar al carrito" : "No disponible"}</span>
        </button>
      </div>
    </article>
  )
}
