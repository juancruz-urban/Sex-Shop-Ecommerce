"use client"

import { ArrowRight, Truck, CreditCard, Shield } from "lucide-react"
import "./Hero.css"

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">Nuevos productos disponibles</span>
          <h1 className="hero-title">
            Descubre nuestra <span>colección exclusiva</span>
          </h1>
          <p className="hero-description">
            Los mejores productos con precios increíbles. Envío gratis en compras sobre $50.000
          </p>
          <div className="hero-buttons">
            <a href="#productos" className="hero-btn primary">
              Ver productos
              <ArrowRight size={18} />
            </a>
            <a href="#" className="hero-btn secondary">
              Ver ofertas
            </a>
          </div>
        </div>

        <div className="hero-features">
          <div className="hero-feature">
            <div className="feature-icon">
              <Truck size={24} />
            </div>
            <div className="feature-text">
              <h4>Envío gratis</h4>
              <p>En compras sobre $50.000</p>
            </div>
          </div>
          <div className="hero-feature">
            <div className="feature-icon">
              <CreditCard size={24} />
            </div>
            <div className="feature-text">
              <h4>Pago seguro</h4>
              <p>Con Mercado Pago</p>
            </div>
          </div>
          <div className="hero-feature">
            <div className="feature-icon">
              <Shield size={24} />
            </div>
            <div className="feature-text">
              <h4>Garantía</h4>
              <p>30 días de devolución</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
