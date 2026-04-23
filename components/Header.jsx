"use client";

import { ShoppingCart, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useRouter } from 'next/navigation'

export default function Header({ 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory 
}) {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeout = useRef(null);
  const router = useRouter()

  const handleMouseEnter = (menu) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setMobileMenuOpen(false);
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          {/* Buscador izquierda */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Logo centrado con imagen */}
          <div className="logo-container">
            <div className="logo" onClick={() => handleCategoryClick("Todos")}>
              <img 
                className="logo-img" 
                src="/logo-345989548-1753124551-0b863bfdb15e8bf993a28c252f6c65941753124551-640-0.webp" 
                alt="ClubA Sexshop"
                onClick={()=>{router.push('/')}}
              />
            </div>
          </div>

          {/* Carrito derecha */}
          <div className="header-actions">
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Categorías (fondo rosa) */}
      <nav className="nav-bar">
        <div className="nav-container">
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('categorias')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="nav-link dropdown-trigger">
              CATEGORÍAS <ChevronDown size={14} />
            </button>
            {openDropdown === 'categorias' && (
              <div className="dropdown-menu">
                <a onClick={() => handleCategoryClick("Juguetes y accesorios")}>JUGUETES</a>
                <a onClick={() => handleCategoryClick("Lencería")}>LENCERÍA</a>
                <a onClick={() => handleCategoryClick("Sensaciones")}>SENSACIONES</a>
                <a onClick={() => handleCategoryClick("Geles y cosmética")}>COSMÉTICA</a>
                <a onClick={() => handleCategoryClick("Marcas")}>MARCAS</a>
                <a onClick={() => handleCategoryClick("Tuppersex")}>TUPPERSEX</a>
              </div>
            )}
          </div>

          <a onClick={() => handleCategoryClick("Juguetes y accesorios")} className="nav-link">JUGUETES</a>
          <a onClick={() => handleCategoryClick("Lencería")} className="nav-link">LENCERÍA</a>
          <a onClick={() => handleCategoryClick("Sensaciones")} className="nav-link">SENSACIONES</a>
          <a onClick={() => handleCategoryClick("Geles y cosmética")} className="nav-link">COSMÉTICA</a>
          <a onClick={() => handleCategoryClick("Marcas")} className="nav-link">MARCAS</a>
          <a onClick={() => handleCategoryClick("Tuppersex")} className="nav-link">TUPPERSEX</a>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`mobile-menu ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menú</h3>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="mobile-menu-links">
          <a onClick={() => handleCategoryClick("Todos")}>Todos los productos</a>
          <a onClick={() => handleCategoryClick("Juguetes y accesorios")}>JUGUETES</a>
          <a onClick={() => handleCategoryClick("Lencería")}>LENCERÍA</a>
          <a onClick={() => handleCategoryClick("Sensaciones")}>SENSACIONES</a>
          <a onClick={() => handleCategoryClick("Geles y cosmética")}>COSMÉTICA</a>
          <a onClick={() => handleCategoryClick("Marcas")}>MARCAS</a>
          <a onClick={() => handleCategoryClick("Tuppersex")}>TUPPERSEX</a>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}