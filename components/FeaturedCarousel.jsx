"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import "./FeaturedCarousel.css";
import { cleanPrice, formatPrice } from "@/data/products-sex";

export default function FeaturedCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Productos destacados (toma los primeros 8)
  const displayProducts = products.slice(0, 8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 900) setItemsPerPage(2);
      else if (window.innerWidth < 1200) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
  const startIndex = currentIndex * itemsPerPage;
  const visibleProducts = displayProducts.slice(startIndex, startIndex + itemsPerPage);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (displayProducts.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <h2 className="featured-title">✨ Destacados</h2>
        </div>

        <div className="featured-carousel-wrapper">
          <button className="carousel-btn prev" onClick={prevSlide} disabled={isTransitioning}>
            <ChevronLeft size={24} />
          </button>

          <div className="featured-carousel">
            {visibleProducts.map((product, idx) => {
              const productData = product.producto;
              const imageData = product.imagen;
              const price = cleanPrice(productData["Precio"]);
              const slug = productData["Identificador de URL"];
              
              return (
                <Link 
                  href={`/producto/${slug}`} 
                  key={`${slug}-${currentIndex}-${idx}`}
                  className="featured-card"
                >
                  <div className="featured-image">
                    <img
                      src={imageData?.url || "/placeholder.jpg"}
                      alt={productData["Nombre"]}
                      className="featured-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x300?text=Producto";
                      }}
                    />
                  </div>
                  <div className="featured-info">
                    <h3 className="featured-name">{productData["Nombre"]}</h3>
                    <p className="featured-category">
                      {productData["Categorías"]?.split(' > ')[0] || "Producto"}
                    </p>
                    <div className="featured-price">
                      <span className="current-price">{formatPrice(price)}</span>
                    </div>
                    <div className="featured-cta">
                      <span className="cta-text">Ver más</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <button className="carousel-btn next" onClick={nextSlide} disabled={isTransitioning}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicadores de página */}
        {totalPages > 1 && (
          <div className="carousel-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentIndex === idx ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}