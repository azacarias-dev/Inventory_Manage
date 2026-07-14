import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function RegisterForm({ onSwitchToLogin, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const register = useAuthStore((state) => state.register);
  const storeError = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);

  const error = localError || storeError;

  // Estados visuales de interacción (para que se sienta vivo y premium)
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = (field, value) => {
    setFocusedField('');
    if (!value) {
      setErrors(prev => ({ ...prev, [field]: 'Este campo es requerido' }));
    } else if (field === 'email' && !value.includes('@')) {
      setErrors(prev => ({ ...prev, [field]: 'Debe ingresar un correo válido (debe incluir "@")' }));
    } else {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (!agreeTerms) {
      setLocalError('Debes aceptar los Términos de Servicio y la Política de Privacidad');
      return;
    }

    const result = await register(fullName, email, password);
    if (result.success) {
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo al login...');
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
      }, 2000);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Gestiona tu inventario de forma profesional y eficiente</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Campo: Nombre Completo */}
        <div className={`input-group ${focusedField === 'fullName' ? 'focused' : ''} ${errors.fullName ? 'has-error' : ''}`}>
          <label className="input-label" htmlFor="fullName">Nombre Completo</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              id="fullName"
              placeholder="Ej. Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => handleFocus('fullName')}
              onBlur={(e) => handleBlur('fullName', e.target.value)}
              className="auth-input"
              required
            />
          </div>
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        {/* Campo: Correo Electrónico */}
        <div className={`input-group ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'has-error' : ''}`}>
          <label className="input-label" htmlFor="email">Correo Electrónico</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={(e) => handleBlur('email', e.target.value)}
              className="auth-input"
              required
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Campo: Contraseña */}
        <div className={`input-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'has-error' : ''}`}>
          <label className="input-label" htmlFor="password">Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={(e) => handleBlur('password', e.target.value)}
              className="auth-input pr-10"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {/* Campo: Confirmar Contraseña */}
        <div className={`input-group ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'has-error' : ''}`}>
          <label className="input-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
              className="auth-input pr-10"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {/* Checkbox: Términos y Condiciones */}
        <div className="terms-checkbox">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <span className="checkmark"></span>
            <span className="checkbox-label">
              Acepto los <a href="#terminos" className="auth-link">Términos de Servicio</a> y la <a href="#politica" className="auth-link">Política de Privacidad</a>.
            </span>
          </label>
        </div>

        {error && (
          <div className="alert-message error-bg" style={{ marginBottom: '1.25rem', color: '#ffffff' }}>
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
          <div className="alert-message" style={{ marginBottom: '1.25rem', backgroundColor: '#16a34a', color: '#ffffff' }}>
            ✅ {successMessage}
          </div>
        )}

        {/* Botón de Enviar */}
        <button type="submit" className="auth-btn btn-primary" disabled={loading}>
          {loading ? 'Creando Cuenta...' : 'Registrar Cuenta'}
        </button>
      </form>

      {/* Enlace a Login */}
      <div className="auth-footer">
        <p>¿Ya tienes una cuenta? <button type="button" onClick={onSwitchToLogin} className="auth-link font-semibold bg-transparent border-none p-0 cursor-pointer">Inicia sesión aquí</button></p>
      </div>
    </div>
  );
}
