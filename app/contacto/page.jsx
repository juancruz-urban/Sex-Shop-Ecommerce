"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import Cart from "@/components/Cart";
import "./page.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simular envío (aquí conectarás con tu API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header searchQuery="" setSearchQuery={() => {}} selectedCategory="Todos" setSelectedCategory={() => {}} />
      <main className="contact-page">
        <div className="contact-container">
          {/* Título */}
          <div className="contact-header">
            <h1 className="contact-title">Contacto</h1>
          </div>

          {/* Grid de contacto */}
          <div className="contact-grid">
            {/* Columna izquierda - Información */}
            <div className="contact-info">
              <div className="info-card">
                <h3>Horario de atención</h3>
                <div className="info-item">
                  <Clock size={18} />
                  <span>Lun. a Vie. 10 a 19hs | Sáb. 10 a 14:00hs.</span>
                </div>
              </div>

              <div className="info-card">
                <h3>Teléfonos</h3>
                <div className="info-item">
                  <Phone size={18} />
                  <span>543513956613</span>
                </div>
                <div className="info-item">
                  <Phone size={18} />
                  <span>351 395 6613 | 351 557 3717</span>
                </div>
              </div>

              <div className="info-card">
                <h3>Email</h3>
                <div className="info-item">
                  <Mail size={18} />
                  <span>evenaher@gmail.com</span>
                </div>
              </div>

              <div className="info-card">
                <h3>Ubicación</h3>
                <div className="info-item">
                  <MapPin size={18} />
                  <div className="address-text">
                    <strong>LOCAL CENTRO:</strong>
                    <p>Av. Colón 359, Local 17 | Planta Baja</p>
                    <p>Galería Cinerama, Córdoba</p>
                    <p className="hours-small">Horario: Lun. a Vie. 10 a 19hs | Sáb. 10 a 14:00hs.</p>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin size={18} />
                  <div className="address-text">
                    <strong>LOCAL VILLA ALLENDE:</strong>
                    <p>Río de Janeiro 161 | Planta Alta</p>
                    <p className="hours-small">Horario: Lun. a Vie. 10 a 13hs - 16:30 a 20h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="ej.: María Perez"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ej.: tuemail@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="ej.: 1123445567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="ej.: Tu mensaje"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar mensaje
                    </>
                  )}
                </button>

                {submitStatus === "success" && (
                  <div className="success-message">
                    <CheckCircle size={16} />
                    ¡Mensaje enviado con éxito! Te responderemos a la brevedad.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    Error al enviar el mensaje. Por favor intentá nuevamente.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Aviso de cookies */}
          <div className="cookies-notice-contact">
            <p>
              Al navegar por este sitio <strong>aceptás el uso de cookies</strong> para agilizar tu experiencia de compra.
              <a href="#"> Entendido</a>
            </p>
          </div>
        </div>
      </main>
      <Cart />
    </>
  );
}

export default function ContactoPage() {
  return (
    <CartProvider>
      <ContactPage />
      <Footer onCategoryClick={() => {}} />
    </CartProvider>
  );
}