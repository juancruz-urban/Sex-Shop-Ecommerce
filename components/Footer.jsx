"use client";

import { 
  MapPin, Phone, Mail, Instagram, Facebook,
  Shield, Heart, ExternalLink
} from "lucide-react";
import "./Footer.css";

export default function Footer({ onCategoryClick }) {
  const currentYear = new Date().getFullYear();

  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
    // Scroll suave a la sección de productos
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { name: "Juguetes", filter: "Juguetes y accesorios" },
    { name: "Lencería", filter: "Lencería" },
    { name: "Sensaciones", filter: "Sensaciones" },
    { name: "Cosmética", filter: "Geles y cosmética" },
    { name: "Marcas", filter: "Marcas" },
    { name: "Tuppersex", filter: "Tuppersex" }
  ];

  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://www.instagram.com/sexshop.cordoba.cluba", 
      color: "#E4405F" 
    },
    { 
      name: "Facebook", 
      icon: Facebook, 
      url: "https://www.facebook.com/people/Sexshop-CLUB-A/100063952034223/", 
      color: "#1877F2" 
    },
   
  ];

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "MasterCard", icon: "💳" },
    { name: "American Express", icon: "💳" },
    { name: "Discover", icon: "💳" },
    { name: "Mercado Pago", icon: "💰" },
    { name: "Transferencia", icon: "🏦" }
  ];

  const shippingMethods = [
    { name: "Andreani", icon: "📦" },
    { name: "Correo Argentino", icon: "📮" },
    { name: "Retiro en local", icon: "🏪" }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Fila 1: Contacto principal */}
        <div className="footer-row footer-contact">
          <div className="footer-brand">
            <h3 className="footer-logo">ClubA <span>SEXSHOP</span></h3>
            <p className="footer-tagline">Tu tienda de confianza</p>
          </div>
          
          <div className="contact-info">
            <div className="contact-item">
              <Phone size={18} />
              <div>
                <strong>Teléfonos</strong>
                <p>351 395 6613 | 351 557 3717</p>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <div>
                <strong>Email</strong>
                <p>evenaher@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: Direcciones */}
        <div className="footer-row footer-addresses">
          <div className="address-card">
            <MapPin size={18} />
            <div>
              <strong>LOCAL CENTRO</strong>
              <p>Av. Colón 359, Local 17 | Planta Baja</p>
              <p>Galería Cinerama, Córdoba</p>
              <p className="hours">Horario: Lun. a Vie. 10 a 19hs | Sáb. 10 a 14hs</p>
            </div>
          </div>
          <div className="address-card">
            <MapPin size={18} />
            <div>
              <strong>LOCAL VILLA ALLENDE</strong>
              <p>Río de Janeiro 161 | Planta Alta</p>
              <p className="hours">Horario: Lun. a Vie. 10 a 13hs - 16:30 a 20h</p>
            </div>
          </div>
        </div>

        {/* Fila 3: Enlaces del footer */}
        <div className="footer-row footer-links">
          {/* Columna Categorías */}
          <div className="footer-column">
            <h4>Categorías</h4>
            <ul>
              {categories.map((cat) => (
                <li key={cat.name}>
                  <button 
                    className="footer-link-btn"
                    onClick={() => handleCategoryClick(cat.filter)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <a href="contacto">Contacto</a>
              </li>
            </ul>
          </div>

          
         

          {/* Columna Sucursales */}
          <div className="footer-column">
            <h4>Seguinos</h4>
            <ul>
                 <li>
                <a 
                  href="https://www.facebook.com/people/Sexshop-CLUB-A/100063952034223/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Facebook
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </li>
                 <li>
                <a 
                  href="https://www.instagram.com/sexshop.cordoba.cluba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Instagram
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/sexshop.cordoba.cluba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Centro
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/sexshopvillallende_cluba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Villa Allende
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.cordobasensual.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Web Amiga
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </li>
               <li>
                <a 
                  href="https://www.tiktok.com/@clubasexshop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  TikTok
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna Métodos de pago y envío */}
          <div className="footer-column">
            <h4>Medios de pago</h4>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <span key={method.name} className="payment-method">
                  <span className="payment-icon">{method.icon}</span>
                  {method.name}
                </span>
              ))}
            </div>
            <h4 className="mt-3">Medios de envío</h4>
            <div className="shipping-methods">
              {shippingMethods.map((method) => (
                <span key={method.name} className="shipping-method">
                  <span className="shipping-icon">{method.icon}</span>
                  {method.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fila 4: Cookies y términos */}
        <div className="footer-row footer-cookies">
          <div className="cookies-notice">
            <Shield size={18} />
            <p>Al navegar por este sitio aceptas el uso de cookies para agilizar tu experiencia de compra.</p>
            <button className="cookies-btn">Entendido</button>
          </div>
        </div>

        {/* Fila 5: Copyright y links legales */}
        <div className="footer-row footer-bottom">
          <div className="footer-legal">
            <a href="#">Defensa de las y los consumidores</a>
            <span className="separator">|</span>
            <a href="https://autogestion.produccion.gob.ar/consumidores">Para reclamos ingresá acá</a>
            <span className="separator">|</span>
            <a href="https://www.sexshopcordobacluba.com.ar/contacto/?order_cancellation_without_id=true">Botón de arrepentimiento</a>
          </div>
          <div className="footer-copyright">
            <p>
              creado con <Heart size={14} /> Club A Sexshop - {currentYear}
            </p>
            <p className="copyright-text">Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}