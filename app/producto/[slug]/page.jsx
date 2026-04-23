"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, 
  MapPin, Calendar, Package, ChevronDown, ChevronUp, Check,
  Ruler, Weight, Maximize, Layers
} from "lucide-react";
import { CartProvider, useCart } from "@/context/CartContext";
import { products, cleanPrice, formatPrice } from "@/data/products-sex";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import "./page.css";

// Componente para el selector de cantidad
function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="quantity-selector">
      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
      <span>{quantity}</span>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
    </div>
  );
}

// Componente de opciones de envío
function ShippingOptions({ cp, setCp, shippingOptions, selectedShipping, setSelectedShipping }) {
  const [cpInput, setCpInput] = useState(cp);
  const [showOptions, setShowOptions] = useState(true);

  const handleCpChange = () => {
    setCp(cpInput);
  };

  return (
    <div className="shipping-section">
      <div className="shipping-header">
        <h3>Envíos</h3>
        <button className="collapse-btn" onClick={() => setShowOptions(!showOptions)}>
          {showOptions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {showOptions && (
        <>
          <div className="cp-input-group">
            <label>Entregas para el CP:</label>
            <div className="cp-input-wrapper">
              <input
                type="text"
                value={cpInput}
                onChange={(e) => setCpInput(e.target.value)}
                placeholder="Ingresa tu código postal"
                maxLength="4"
              />
              <button onClick={handleCpChange} className="change-cp-btn">Cambiar CP</button>
            </div>
          </div>

          <div className="shipping-options">
            {shippingOptions.map((option, index) => (
              <label key={index} className={`shipping-option ${selectedShipping === index ? "selected" : ""}`}>
                <input type="radio" name="shipping" checked={selectedShipping === index} onChange={() => setSelectedShipping(index)} />
                <div className="shipping-option-content">
                  <div className="shipping-method">
                    <Package size={18} />
                    <div>
                      <strong>{option.method}</strong>
                      <p className="shipping-type">{option.type}</p>
                    </div>
                  </div>
                  <div className="shipping-details">
                    <div className="shipping-date">
                      <Calendar size={14} />
                      <span>Llega el {option.date}</span>
                    </div>
                    <div className="shipping-price">
                      {option.price === 0 ? "GRATIS" : formatPrice(option.price)}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button className="view-addresses-btn">
            <MapPin size={16} />
            Ver direcciones de retiro
          </button>
        </>
      )}
    </div>
  );
}

// Componente de cambios y devoluciones
function ReturnsSection() {
  const [showReturns, setShowReturns] = useState(true);
  return (
    <div className="returns-section">
      <div className="returns-header">
        <h3>Cambios y devoluciones</h3>
        <button className="collapse-btn" onClick={() => setShowReturns(!showReturns)}>
          {showReturns ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {showReturns && (
        <div className="returns-content">
          <p>Si no te gusta, podés cambiarlo por otro o devolverlo.</p>
        </div>
      )}
    </div>
  );
}

// Componente de "No olvides tu lubricante"
function AddOnsSection() {
  return (
    <div className="addons-section">
      <h3>No olvides tu lubricante!</h3>
      <p>Opciones para tu compra si sumás este producto.</p>
      <div className="addon-products">
        <div className="addon-card">
          <img src="/lubricante-placeholder.jpg" alt="Lubricante" />
          <div className="addon-info">
            <h4>Lubricante Íntimo</h4>
            <p>100ml - Base de agua</p>
            <span className="addon-price">$8.500</span>
          </div>
          <button className="addon-add-btn">+ Agregar</button>
        </div>
      </div>
    </div>
  );
}

// Componente principal de contenido
function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, items, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cp, setCp] = useState("7400");
  const [selectedShipping, setSelectedShipping] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const shippingOptions = [
    { method: "Andreani Estándar", type: "Envío a domicilio", date: "lunes 27/04", price: 13961 },
    { method: "Punto de retiro", type: "Retiras en sucursal", date: "lunes 27/04", price: 10583 }
  ];

  useEffect(() => {
    if (params.slug) {
      const found = products.find(
        (p) => p.producto["Identificador de URL"] === params.slug
      );
      setProduct(found || null);
      setLoading(false);
    }
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header searchQuery="" setSearchQuery={() => {}} selectedCategory="Todos" setSelectedCategory={() => {}} />
        <div className="loading"><p>Cargando producto...</p></div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header searchQuery="" setSearchQuery={() => {}} selectedCategory="Todos" setSelectedCategory={() => {}} />
        <div className="not-found">
          <h2>Producto no encontrado</h2>
          <button onClick={() => router.push("/")}>Volver al inicio</button>
        </div>
      </>
    );
  }

  const productData = product.producto;
  const imageData = product.imagen;
  const price = cleanPrice(productData["Precio"]);
  const originalPrice = productData["Precio promocional"] ? cleanPrice(productData["Precio promocional"]) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const categories = productData["Categorías"]?.split(" > ") || [];

  // ID consistente - MISMO CRITERIO que en ProductCard
  const productId = imageData?.id || productData["Identificador de URL"];
  
  // Debug: verificar IDs
  console.log("=== DEBUG CARRITO ===");
  console.log("Product ID actual:", productId);
  console.log("Items en carrito:", items.map(i => ({ id: i.id, name: i.name })));
  
  // Verificar si el producto ya está en el carrito
  const isInCart = items.some(item => String(item.id) === String(productId));
  const cartItem = items.find(item => String(item.id) === String(productId));
  const cartItemQuantity = cartItem ? cartItem.quantity : 0;

  // Extraer datos técnicos del producto
  const technicalSpecs = [
    { label: "Peso", value: productData["Peso (kg)"], icon: Weight, unit: "kg" },
    { label: "Alto", value: productData["Alto (cm)"], icon: Ruler, unit: "cm" },
    { label: "Ancho", value: productData["Ancho (cm)"], icon: Maximize, unit: "cm" },
    { label: "Profundidad", value: productData["Profundidad (cm)"], icon: Layers, unit: "cm" },
  ].filter(spec => spec.value && spec.value !== "" && spec.value !== "ND");

  // Descripción real o generada
  const getDescription = () => {
    if (productData["Descripción"] && productData["Descripción"].trim() !== "") {
      return productData["Descripción"];
    }
    let generatedDesc = `<p>Descubrí el <strong>${productData["Nombre"]}</strong>, ideal para explorar nuevas sensaciones.</p>`;
    
    if (productData["Alto (cm)"] || productData["Ancho (cm)"]) {
      generatedDesc += `<p><strong>Dimensiones:</strong> ${productData["Alto (cm)"] || "?"} x ${productData["Ancho (cm)"] || "?"} x ${productData["Profundidad (cm)"] || "?"} cm.</p>`;
    }
    
    if (productData["Peso (kg)"]) {
      generatedDesc += `<p><strong>Peso:</strong> ${productData["Peso (kg)"]} kg.</p>`;
    }
    
    generatedDesc += `<p>Materiales de alta calidad que aseguran comodidad y seguridad en cada uso. ¡Transformá tu intimidad con este producto imprescindible!</p>`;
    
    return generatedDesc;
  };

  const handleAddToCart = () => {
    if (isInCart) {
      console.log("Producto ya en carrito, no se agrega");
      return;
    }
    
    setIsAdding(true);
    const cartProduct = {
      id: productId,
      name: productData["Nombre"],
      price: price,
      image: imageData?.url,
      category: categories[0] || "Sin categoría",
      inStock: true,
      quantity: quantity
    };
    console.log("Agregando producto:", cartProduct);
    addToCart(cartProduct);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleViewCart = () => {
    setIsCartOpen(true);
  };

  const installments = Math.floor(price / 3);
  const transferPrice = Math.floor(price * 0.9);

  return (
    <>
      <Header searchQuery="" setSearchQuery={() => {}} selectedCategory="Todos" setSelectedCategory={() => {}} />
      <main className="product-detail">
        <div className="product-detail-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <button onClick={() => router.push("/")}>Inicio</button>
            <span className="separator">›</span>
            <button onClick={() => router.push("/")}>Productos</button>
            {categories.map((cat, idx) => (
              <span key={idx}>
                <span className="separator">›</span>
                <span>{cat}</span>
              </span>
            ))}
            <span className="separator">›</span>
            <span className="current">{productData["Nombre"]}</span>
          </div>

          <div className="product-detail-grid">
            {/* Galería de imágenes */}
            <div className="product-gallery">
              <div className="main-image">
                <img 
                  src={imageData?.url || "https://via.placeholder.com/600x600?text=Producto"} 
                  alt={productData["Nombre"]}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=Producto"; }}
                />
              </div>
            </div>

            {/* Información del producto */}
            <div className="product-info-detail">
              <h1 className="product-title">{productData["Nombre"]}</h1>
              
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span className="rating-count">(128 opiniones)</span>
              </div>

              <div className="product-price-section">
                <div className="price-container">
                  <span className="current-price">{formatPrice(price)}</span>
                  {originalPrice && (
                    <span className="original-price">{formatPrice(originalPrice)}</span>
                  )}
                  {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                </div>
                <p className="installments">
                  <span className="debit-badge">DÉBITO</span>
                  3 cuotas sin interés de {formatPrice(installments)}
                </p>
                <p className="transfer-price">
                  {formatPrice(transferPrice)} con Transferencia o depósito bancario
                </p>
              </div>

              {/* Cantidad - solo mostrar si el producto NO está en el carrito */}
              {!isInCart && (
                <div className="quantity-section">
                  <label>Cantidad</label>
                  <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                </div>
              )}

              {/* Indicador de producto en carrito */}
              {isInCart && (
                <div className="in-cart-indicator">
                  <Check size={18} />
                  <span>Producto ya agregado al carrito ({cartItemQuantity} unidades)</span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="action-buttons">
                {isInCart ? (
                  <>
                    <button className="in-cart-btn" disabled>
                      <Check size={18} />
                      <span>Producto en carrito</span>
                    </button>
                    <button className="view-cart-btn" onClick={handleViewCart}>
                      <ShoppingCart size={18} />
                      <span>Ver carrito</span>
                    </button>
                  </>
                ) : (
                  <button 
                    className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                  >
                    <ShoppingCart size={18} />
                    <span>Agregar al carrito</span>
                  </button>
                )}
                <button 
                  className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart size={18} fill={isWishlisted ? "#E40044" : "none"} />
                </button>
              </div>

              {/* Beneficios */}
              <div className="benefits">
                <div className="benefit"><Truck size={16} /><span>Envío gratis superando los $200.000</span></div>
                <div className="benefit"><Shield size={16} /><span>Compra protegida</span></div>
                <div className="benefit"><RotateCcw size={16} /><span>Devolución hasta 30 días</span></div>
              </div>
            </div>
          </div>

          {/* Tabs de descripción y detalles técnicos */}
          <div className="product-tabs">
            <div className="tabs-header">
              <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>
                Descripción
              </button>
              <button className={`tab-btn ${activeTab === "specs" ? "active" : ""}`} onClick={() => setActiveTab("specs")}>
                Especificaciones
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "description" && (
                <div className="description-content">
                  <div dangerouslySetInnerHTML={{ __html: getDescription() }} />
                </div>
              )}
              {activeTab === "specs" && (
                <div className="specs-content">
                  {technicalSpecs.length > 0 ? (
                    <div className="specs-grid">
                      {technicalSpecs.map((spec, idx) => (
                        <div key={idx} className="spec-item">
                          <div className="spec-icon">
                            <spec.icon size={20} />
                          </div>
                          <div className="spec-info">
                            <span className="spec-label">{spec.label}</span>
                            <strong className="spec-value">{spec.value} {spec.unit}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay especificaciones técnicas disponibles para este producto.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sección de envíos */}
          <ShippingOptions 
            cp={cp} 
            setCp={setCp} 
            shippingOptions={shippingOptions} 
            selectedShipping={selectedShipping} 
            setSelectedShipping={setSelectedShipping} 
          />

          {/* Sección de cambios y devoluciones */}
          <ReturnsSection />

          {/* Sección de "No olvides tu lubricante" */}
          <AddOnsSection />
        </div>
      </main>
      <Cart />
    </>
  );
}

// Componente principal
export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetailContent />
    </CartProvider>
  );
}