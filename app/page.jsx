"use client"

import { useState, useMemo } from "react"
import { CartProvider, useCart } from "@/context/CartContext"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Filters from "@/components/Filters"
import ProductGrid from "@/components/ProductGrid"
import Cart from "@/components/Cart"
import { products, priceRanges } from "@/data/products"
import "./page.css"

function Shop() {

  const { items } = useCart()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filteredProducts = useMemo(() => {

    let result = [...products]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== "Todos") {
      result = result.filter(
        (product) => product.category === selectedCategory
      )
    }

    const priceRange = priceRanges[selectedPriceRange]

    result = result.filter(
      (product) =>
        product.price >= priceRange.min &&
        product.price <= priceRange.max
    )

    if (showInStockOnly) {
      result = result.filter((product) => product.inStock)
    }

    switch (sortBy) {

      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break

      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break

      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break

      case "newest":
        result.sort((a, b) => b.id - a.id)
        break

      default:
        break
    }

    return result

  }, [
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    sortBy,
    showInStockOnly
  ])

  const handleCheckout = async () => {

    if(items.length === 0){
      alert("Tu carrito está vacío")
      return
    }

    const mpItems = items.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: Number(item.price)
    }))

    const res = await fetch("/api/create-preference",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        items: mpItems
      })
    })

    const data = await res.json()

    if(data.id){

      window.location.href =
      `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`

    }else{

      alert("Error iniciando el pago")

    }

  }

  return (
    <>
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <main>

        <Hero />

        <section id="productos" className="products-section">

          <div className="products-container">

            <div className="products-header">

              <h2 className="products-title">
                Nuestros Productos
              </h2>

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
              />

              <ProductGrid products={filteredProducts} />

            </div>

          </div>

        </section>

      </main>

      <Cart onCheckout={handleCheckout} />

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