"use client"

import { ShoppingCart, Search, Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import "./Header.css"

export default function Header({ searchQuery, setSearchQuery }) {
  const { totalItems, setIsCartOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="logo">TiendaOnline</h1>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? "nav-open" : ""}`}>
          <a href="#" className="nav-link active">Inicio</a>
          <a href="#productos" className="nav-link">Productos</a>
          <a href="#" className="nav-link">Ofertas</a>
          <a href="#" className="nav-link">Contacto</a>
        </nav>

        <div className="header-right">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
