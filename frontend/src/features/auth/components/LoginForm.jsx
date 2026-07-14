import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function LoginForm({ onSwitchToRegister, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);

  // Estados visuales de interacción (para que se sienta vivo y premium)
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = (field, value) => {
    setFocusedField('');
    if (!value) {
      setErrors(prev => ({ ...prev, [field]: 'Este campo es requerido' }));
    } else if (field === 'emailOrUsername' && !value.includes('@')) {
      setErrors(prev => ({ ...prev, [field]: 'Debe ingresar un correo válido (debe incluir "@")' }));
    } else {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(emailOrUsername, password);
    if (result.success && onLogin) {
      onLogin();
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">Accede a tu cuenta para gestionar el inventario</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Campo: Correo Electrónico o Usuario */}
        <div className={`input-group ${focusedField === 'emailOrUsername' ? 'focused' : ''} ${errors.emailOrUsername ? 'has-error' : ''}`}>
          <label className="input-label" htmlFor="emailOrUsername">Correo Electrónico</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              id="emailOrUsername"
              placeholder="correo@ejemplo.com"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              onFocus={() => handleFocus('emailOrUsername')}
              onBlur={(e) => handleBlur('emailOrUsername', e.target.value)}
              className="auth-input"
              required
            />
          </div>
          {errors.emailOrUsername && <span className="error-message">{errors.emailOrUsername}</span>}
        </div>

        {/* Campo: Contraseña */}
        <div className={`input-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'has-error' : ''}`}>
          <label className="input-label" htmlFor="password">Clave de Seguridad</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
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


        {error && (
          <div className="alert-message error-bg" style={{ marginBottom: '1.25rem', color: '#ffffff' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Botón de Enviar */}
        <button type="submit" className="auth-btn btn-primary" disabled={loading}>
          {loading ? 'Validando...' : 'Validar Credenciales'}
        </button>
      </form>

      {/* Enlace a Registro */}
      <div className="auth-footer">
        <p>¿No tienes una cuenta? <button type="button" onClick={onSwitchToRegister} className="auth-link font-semibold bg-transparent border-none p-0 cursor-pointer">Regístrate aquí</button></p>
      </div>
    </div>
  );
}
