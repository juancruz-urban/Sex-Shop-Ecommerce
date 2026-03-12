"use client"

import { Filter, ChevronDown, Star, X } from "lucide-react"
import { categories, priceRanges } from "@/data/products"
import { useState } from "react"
import "./Filters.css"

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  sortBy,
  setSortBy,
  showInStockOnly,
  setShowInStockOnly,
}) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = 
    selectedCategory !== "Todos" || 
    selectedPriceRange !== 0 || 
    showInStockOnly

  const clearFilters = () => {
    setSelectedCategory("Todos")
    setSelectedPriceRange(0)
    setShowInStockOnly(false)
  }

  return (
    <>
      <button 
        className="mobile-filter-btn"
        onClick={() => setIsOpen(true)}
      >
        <Filter size={18} />
        Filtros
        {hasActiveFilters && <span className="filter-indicator" />}
      </button>

      <aside className={`filters-sidebar ${isOpen ? "filters-open" : ""}`}>
        <div className="filters-header">
          <div className="filters-title">
            <Filter size={18} />
            <span>Filtros</span>
          </div>
          <button 
            className="filters-close"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}

        <div className="filter-section">
          <h3 className="filter-section-title">
            <ChevronDown size={16} />
            Categorías
          </h3>
          <div className="filter-options">
            {categories.map((category) => (
              <label key={category} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                />
                <span className="filter-radio" />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">
            <ChevronDown size={16} />
            Rango de precio
          </h3>
          <div className="filter-options">
            {priceRanges.map((range, index) => (
              <label key={index} className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === index}
                  onChange={() => setSelectedPriceRange(index)}
                />
                <span className="filter-radio" />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">
            <ChevronDown size={16} />
            Disponibilidad
          </h3>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
              />
              <span className="filter-checkbox" />
              <span>Solo disponibles</span>
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">
            <ChevronDown size={16} />
            Ordenar por
          </h3>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
            <option value="rating">Mejor valorados</option>
            <option value="newest">Más nuevos</option>
          </select>
        </div>
      </aside>

      {isOpen && (
        <div className="filters-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
