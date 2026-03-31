"use client"

import { useState } from "react"
import "./ShippingForm.css"

export default function ShippingForm({ onNext, onBack, onShippingQuote, shippingQuote }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cp: ""
  })
  const [errors, setErrors] = useState({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [localShippingCost, setLocalShippingCost] = useState(null)
  const [cpValid, setCpValid] = useState(null) // null = no verificado, true = válido, false = inválido

  // Función para validar formato de código postal argentino
  const validateCPFormat = (cp) => {
    // Código postal argentino: 4 dígitos (ej: 1406, 1000, etc.)
    const cpRegex = /^\d{4}$/
    return cpRegex.test(cp)
  }

  // Función para verificar código postal en API (opcional)
  const verifyCP = async (cp) => {
    if (!cp || cp.length !== 4) return false
    
    try {
      // Opcional: Llamar a una API para verificar si el CP existe
      // Por ahora hacemos una validación básica
      const response = await fetch(`/api/verify-cp?cp=${cp}`)
      if (response.ok) {
        const data = await response.json()
        return data.valid
      }
      return validateCPFormat(cp)
    } catch (error) {
      console.error("Error verifying CP:", error)
      return validateCPFormat(cp)
    }
  }

  const calculateShipping = async (cp) => {
    if (!cp || cp.length !== 4) return
    
    setIsCalculating(true)
    setCpValid(null)
    
    try {
      // Verificar formato
      if (!validateCPFormat(cp)) {
        setCpValid(false)
        setErrors(prev => ({ ...prev, cp: "Código postal inválido. Deben ser 4 números" }))
        setIsCalculating(false)
        return
      }
      
      // Verificar si el CP existe (opcional)
      const isValid = await verifyCP(cp)
      if (!isValid) {
        setCpValid(false)
        setErrors(prev => ({ ...prev, cp: "Código postal no válido o no encontrado" }))
        setIsCalculating(false)
        return
      }
      
      setCpValid(true)
      setErrors(prev => ({ ...prev, cp: undefined }))
      
      // Calcular envío
      const response = await fetch("/api/calculate-shipping-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cp })
      })
      
      const data = await response.json()
      if (data.shippingCost !== undefined) {
        setLocalShippingCost(data.shippingCost)
        onShippingQuote?.(data.shippingCost)
      }
    } catch (error) {
      console.error("Error calculating shipping:", error)
      const defaultCost = 1500
      setLocalShippingCost(defaultCost)
      onShippingQuote?.(defaultCost)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    
    // Validar código postal en tiempo real
    if (name === 'cp') {
      // Limitar a solo números y máximo 4 caracteres
      const numbersOnly = value.replace(/\D/g, '').slice(0, 4)
      if (numbersOnly !== value) {
        setFormData(prev => ({ ...prev, cp: numbersOnly }))
        return
      }
      
      // Calcular envío cuando se completan 4 dígitos
      if (numbersOnly.length === 4) {
        calculateShipping(numbersOnly)
      } else {
        setCpValid(null)
        setLocalShippingCost(null)
        onShippingQuote?.(null)
      }
    }
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return "Nombre es requerido"
        if (value.trim().length < 3) return "Nombre debe tener al menos 3 caracteres"
        return null
      
      case 'email':
        if (!value.trim()) return "Email es requerido"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Email inválido"
        return null
      
      case 'phone':
        if (!value.trim()) return "Teléfono es requerido"
        const phoneRegex = /^[0-9\s\-+()]{8,20}$/
        if (!phoneRegex.test(value)) return "Teléfono inválido"
        return null
      
      case 'address':
        if (!value.trim()) return "Dirección es requerida"
        if (value.trim().length < 5) return "Dirección debe tener al menos 5 caracteres"
        return null
      
      case 'city':
        if (!value.trim()) return "Ciudad es requerida"
        return null
      
      case 'cp':
        if (!value.trim()) return "Código postal es requerido"
        if (value.length !== 4) return "Código postal debe tener 4 dígitos"
        if (!/^\d{4}$/.test(value)) return "Solo números permitidos"
        return null
      
      default:
        return null
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar todos los campos
    const newErrors = {}
    let hasErrors = false
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
        hasErrors = true
      }
    })
    
    // Validar código postal específicamente
    if (formData.cp.length !== 4) {
      newErrors.cp = "Código postal debe tener 4 dígitos"
      hasErrors = true
    }
    
    if (cpValid === false) {
      newErrors.cp = "Código postal no válido"
      hasErrors = true
    }
    
    if (hasErrors) {
      setErrors(newErrors)
      return
    }
    
    onNext(formData)
  }

  // Mostrar el costo actual (del contexto o local)
  const displayCost = shippingQuote !== null ? shippingQuote : localShippingCost

  return (
    <form className="shipping-form" onSubmit={handleSubmit}>
      <h3>Datos de envío</h3>
      
      <div className="form-group">
        <label>Nombre completo *</label>
        <input 
          type="text"
          name="name" 
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Juan Pérez" 
          className={errors.name ? "error" : ""}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label>Email *</label>
        <input 
          type="email"
          name="email" 
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="juan@email.com" 
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label>Teléfono *</label>
        <input 
          type="tel"
          name="phone" 
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="11 1234 5678" 
          className={errors.phone ? "error" : ""}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>
      
      <div className="form-group">
        <label>Dirección *</label>
        <input 
          type="text"
          name="address" 
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Av. Siempreviva 123" 
          className={errors.address ? "error" : ""}
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Ciudad *</label>
          <input 
            type="text"
            name="city" 
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Buenos Aires" 
            className={errors.city ? "error" : ""}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        
        <div className="form-group">
          <label>Código Postal *</label>
          <div className={`cp-input-wrapper ${cpValid === true ? 'valid' : ''} ${cpValid === false ? 'invalid' : ''}`}>
            <input 
              type="text"
              name="cp" 
              value={formData.cp}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="1406" 
              maxLength="4"
              className={errors.cp ? "error" : ""}
            />
            {cpValid === true && !isCalculating && (
              <span className="valid-icon">✓</span>
            )}
            {cpValid === false && !isCalculating && (
              <span className="invalid-icon">✗</span>
            )}
            {isCalculating && (
              <span className="calculating-spinner">⌛</span>
            )}
          </div>
          {errors.cp && <span className="error-message">{errors.cp}</span>}
          {cpValid === true && !isCalculating && displayCost !== null && (
            <span className="shipping-cost-info">
              Envío disponible: ${displayCost.toFixed(2)}
            </span>
          )}
          {cpValid === false && !isCalculating && (
            <span className="shipping-cost-info invalid">
              No podemos enviar a este código postal
            </span>
          )}
        </div>
      </div>

      {isCalculating && (
        <div className="shipping-quote calculating">
          <strong>Verificando código postal...</strong>
        </div>
      )}

      <div className="shipping-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Volver al carrito
        </button>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={cpValid !== true || isCalculating}
        >
          Continuar al pago →
        </button>
      </div>
    </form>
  )
}