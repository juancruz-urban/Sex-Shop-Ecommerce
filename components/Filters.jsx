"use client"

import { Filter, ChevronDown, ChevronRight, X } from "lucide-react"
import { priceRanges, cleanPrice, formatPrice } from "../data/products-sex.js"
import { useState, useMemo } from "react"
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
  products
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [openCategories, setOpenCategories] = useState({})
  const [openSections, setOpenSections] = useState({
    categorias: true,
    precio: true,
    disponibilidad: true,
    ordenar: true
  })

  // Construir estructura de categorías jerárquica
  const categoryTree = useMemo(() => {
    const tree = {}
    
    products.forEach(item => {
      const categorias = item.producto?.["Categorías"]
      if (!categorias) return
      
      const parts = categorias.split(' > ')
      let current = tree
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = { 
            name: part, 
            children: {},
            fullPath: parts.slice(0, index + 1).join(' > '),
            isLeaf: index === parts.length - 1
          }
        }
        current = current[part].children
      })
    })
    
    return tree
  }, [products])

  // Calcular precios mínimo y máximo de los productos para debug
  const productPrices = useMemo(() => {
    const prices = products.map(item => cleanPrice(item.producto?.["Precio"]))
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      all: prices
    }
  }, [products])

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleCategory = (categoryPath) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryPath]: !prev[categoryPath]
    }))
  }

  const renderCategoryTree = (tree, level = 0) => {
    return Object.values(tree).map(node => {
      const hasChildren = Object.keys(node.children).length > 0
      const isOpen = openCategories[node.fullPath]
      
      return (
        <div key={node.fullPath} className="category-item" style={{ paddingLeft: `${level * 20}px` }}>
          <div className="category-header">
            {hasChildren && (
              <button 
                className="category-toggle"
                onClick={() => toggleCategory(node.fullPath)}
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            <label className="category-label">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === node.fullPath}
                onChange={() => setSelectedCategory(node.fullPath)}
              />
              <span className="category-radio" />
              <span className="category-name">{node.name}</span>
            </label>
          </div>
          
          {hasChildren && isOpen && (
            <div className="category-children">
              {renderCategoryTree(node.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  const hasActiveFilters = 
    selectedCategory !== "Todos" || 
    selectedPriceRange !== 0 || 
    showInStockOnly

  const clearFilters = () => {
    setSelectedCategory("Todos")
    setSelectedPriceRange(0)
    setShowInStockOnly(false)
  }

  // Función para manejar cambio de rango de precio
  const handlePriceRangeChange = (index) => {
    console.log("Cambiando rango de precio a:", index, priceRanges[index])
    setSelectedPriceRange(index)
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

        <div className="filters-scroll">
          {/* Sección de Categorías */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('categorias')}
            >
              <span className="section-title">
                <ChevronDown size={18} className={`section-icon ${openSections.categorias ? 'rotated' : ''}`} />
                Categorías
              </span>
              <span className="section-count">
                {selectedCategory !== "Todos" ? "1" : ""}
              </span>
            </button>
            
            {openSections.categorias && (
              <div className="filter-section-content">
                <div className="category-tree">
                  {/* Opción "Todos" */}
                  <div className="category-item">
                    <label className="category-label">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === "Todos"}
                        onChange={() => setSelectedCategory("Todos")}
                      />
                      <span className="category-radio" />
                      <span className="category-name">Todos los productos</span>
                    </label>
                  </div>
                  {renderCategoryTree(categoryTree)}
                </div>
              </div>
            )}
          </div>

          {/* Sección de Rango de Precio */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('precio')}
            >
              <span className="section-title">
                <ChevronDown size={18} className={`section-icon ${openSections.precio ? 'rotated' : ''}`} />
                Rango de precio
              </span>
              <span className="section-count">
                {selectedPriceRange !== 0 ? "1" : ""}
              </span>
            </button>
            
            {openSections.precio && (
              <div className="filter-section-content">
                <div className="filter-options">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="filter-option">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === index}
                        onChange={() => handlePriceRangeChange(index)}
                      />
                      <span className="filter-radio" />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
                {/* Información de debug (opcional, quitar en producción) */}
                <div className="price-debug">
                  <small>Precios disponibles: {formatPrice(productPrices.min)} - {formatPrice(productPrices.max)}</small>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Disponibilidad */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('disponibilidad')}
            >
              <span className="section-title">
                <ChevronDown size={18} className={`section-icon ${openSections.disponibilidad ? 'rotated' : ''}`} />
                Disponibilidad
              </span>
              <span className="section-count">
                {showInStockOnly ? "1" : ""}
              </span>
            </button>
            
            {openSections.disponibilidad && (
              <div className="filter-section-content">
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                    />
                    <span className="filter-checkbox" />
                    <span>Solo productos disponibles</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Ordenar por */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('ordenar')}
            >
              <span className="section-title">
                <ChevronDown size={18} className={`section-icon ${openSections.ordenar ? 'rotated' : ''}`} />
                Ordenar por
              </span>
            </button>
            
            {openSections.ordenar && (
              <div className="filter-section-content">
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
            )}
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="filters-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}