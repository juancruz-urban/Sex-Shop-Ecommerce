"use client"

import { Star, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cleanPrice, formatPrice } from "../data/products-sex.js"
import "./ProductCard.css"

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Extraer datos de la estructura anidada
  const productData = product.producto
  const imageData = product.imagen
  const slug = productData["Identificador de URL"]
  
  const name = productData["Nombre"] || ""
  const price = cleanPrice(productData["Precio"])
  const category = productData["Categorías"]?.split(' > ')[0] || "Sin categoría"
  
  // Manejar diferentes formatos de imagen
  let imageUrl = "https://via.placeholder.com/300x300?text=Producto"
  if (imageData) {
    if (typeof imageData === 'object') {
      imageUrl = imageData.url || imageData[0]?.url || "https://via.placeholder.com/300x300?text=Producto"
    } else if (typeof imageData === 'string') {
      imageUrl = imageData
    }
  }

  const handleCardClick = () => {
    // Navegar a la página de detalle del producto
    if (slug) {
      router.push(`/producto/${slug}`)
    }
  }

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que el clic se propague al card
    setIsAdding(true)
    const cartProduct = {
      id: imageData?.id || slug,
      name: name,
      price: price,
      image: imageUrl,
      category: category,
      inStock: true,
      quantity: 1
    }
    addToCart(cartProduct)
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Evita que el clic se propague al card
    setIsWishlisted(!isWishlisted)
  }

  return (
    <article className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <button 
          className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlistClick}
          aria-label="Agregar a favoritos"
        >
          <Heart size={18} fill={isWishlisted ? "#ff4da6" : "none"} />
        </button>
        <img
          src={imageUrl}
          alt={name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=Producto"
          }}
        />
      </div>

      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        
        <div className="product-prices">
          <span className="current-price">{formatPrice(price)}</span>
        </div>

        <button
          className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />
          <span>Agregar al carrito</span>
        </button>
      </div>
    </article>
  )
}