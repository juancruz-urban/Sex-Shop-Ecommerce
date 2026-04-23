"use client"

import { useMemo, useState } from "react"
import { CartProvider, useCart } from "@/context/CartContext"
import Header from "@/components/Header"
import FeaturedCarousel from "../components/FeaturedCarousel.jsx"
import Filters from "@/components/Filters"
import ProductGrid from "@/components/ProductGrid"
import Cart from "@/components/Cart"
import { products, priceRanges, cleanPrice } from "../data/products-sex.js"
import "./page.css"
import Footer from "../components/Footer.jsx"

function Shop() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((item) => {
        const product = item.producto
        return (
          product["Nombre"]?.toLowerCase().includes(query) ||
          product["Categorías"]?.toLowerCase().includes(query) ||
          product["Descripción"]?.toLowerCase().includes(query)
        )
      })
    }

    // Filtro por categoría
    if (selectedCategory !== "Todos") {
      result = result.filter((item) => {
        const categories = item.producto["Categorías"] || ""
        return categories.includes(selectedCategory) ||
               categories.split(' > ').includes(selectedCategory) ||
               categories === selectedCategory
      })
    }

    // Filtro por rango de precios
    const priceRange = priceRanges[selectedPriceRange]
    if (priceRange) {
      result = result.filter((item) => {
        const price = cleanPrice(item.producto["Precio"])
        return price >= priceRange.min && price <= priceRange.max
      })
    }

    // Filtro solo productos en stock
    if (showInStockOnly) {
      result = result.filter((item) => {
        return true // Temporal, hasta que agregues stock
      })
    }

    // Ordenamiento
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => cleanPrice(a.producto["Precio"]) - cleanPrice(b.producto["Precio"]))
        break
      case "price-desc":
        result.sort((a, b) => cleanPrice(b.producto["Precio"]) - cleanPrice(a.producto["Precio"]))
        break
      case "newest":
        result.sort((a, b) => {
          const aId = parseInt(a.imagen?.id) || 0
          const bId = parseInt(b.imagen?.id) || 0
          return bId - aId
        })
        break
      default:
        break
    }

    return result
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, showInStockOnly])

  // Función para manejar clic en categorías desde el Footer
  const handleFooterCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main>
        <FeaturedCarousel products={products} />
        <section id="productos" className="products-section">
          <div className="products-container">
            <div className="products-header">
              <h2 className="products-title">Nuestros Productos</h2>
              <p className="products-count">
                {filteredProducts.length} productos encontrados
              </p>
            </div>
            <div className="products-layout">
              <Filters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showInStockOnly={showInStockOnly}
                setShowInStockOnly={setShowInStockOnly}
                products={products}
              />
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </section>
        <Footer onCategoryClick={handleFooterCategoryClick} />
      </main>
      <Cart />
    </>
  )
}

export default function Page() {
  return (
    <CartProvider>
      <Shop />
    </CartProvider>
  )
}