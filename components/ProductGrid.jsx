"use client"

import ProductCard from "./ProductCard"
import "./ProductGrid.css"

export default function ProductGrid({ products }) {
  const generateStableKey = (product, index) => {
    const urlId = product.producto?.["Identificador de URL"] || ""
    const imageId = product.imagen?.id ||  ""
    const name = product.producto?.["Nombre"] || ""
    const price = product.producto?.["Precio"] || ""
    const keyBase = `${urlId}-${imageId}-${name}-${price}-${index}`
    return keyBase.replace(/\s/g, '-')
  }
  console.log(products[0])

  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros o buscar otros términos</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard 
          key={generateStableKey(product, index)} 
          product={product} 
        />
      ))}
    </div>
  )
}