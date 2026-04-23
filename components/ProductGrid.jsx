"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Resetear a la primera página cuando los productos cambian (filtros aplicados)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  // Calcular índices para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const generateStableKey = (product, index) => {
    const urlId = product.producto?.["Identificador de URL"] || "";
    const imageId = product.imagen?.id || "";
    const name = product.producto?.["Nombre"] || "";
    const price = product.producto?.["Precio"] || "";
    const keyBase = `${urlId}-${imageId}-${name}-${price}-${index}`;
    return keyBase.replace(/\s/g, '-');
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll suave al inicio de la sección de productos
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

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
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {currentProducts.map((product, index) => (
          <ProductCard 
            key={generateStableKey(product, index)} 
            product={product} 
          />
        ))}
      </div>

      {/* Paginación - solo mostrar si hay más de una página */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn prev"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Mostrar solo páginas cercanas a la actual
              const showPage = page === 1 || 
                               page === totalPages || 
                               (page >= currentPage - 2 && page <= currentPage + 2);
              
              if (!showPage) {
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="pagination-dots">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button 
            className="pagination-btn next"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Información de productos mostrados - solo si hay productos */}
      {products.length > 0 && (
        <div className="pagination-info">
          Mostrando {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, products.length)} de {products.length} productos
        </div>
      )}
    </div>
  );
}