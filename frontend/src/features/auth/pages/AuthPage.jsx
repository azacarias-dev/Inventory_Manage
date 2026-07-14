import React from 'react';
import RegisterForm from '../components/RegisterForm';
import logoImg from '../../../assets/img/Logo.png';

export default function AuthPage() {
  return (
    <div className="auth-page-container">
      {/* Panel Izquierdo: Información Corporativa / Branding */}
      <div className="auth-side-panel">
        <div className="auth-side-content">
          <div className="branding">
            <span className="badge">Módulo de Acceso</span>
            <h1 className="brand-title">Control Total de tu <span className="text-gradient">Inventario</span></h1>
            <p className="brand-description">
              Optimiza el control de tus productos en tiempo real, administra existencias, recibe notificaciones de bajo stock y genera reportes detallados en un solo lugar.
            </p>
          </div>

          {/* Características destacadas */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Monitoreo en Tiempo Real</h3>
                <p>Visualiza cada cambio de stock al instante.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon warning-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Alertas Inteligentes</h3>
                <p>Configura umbrales mínimos para evitar quiebres de stock.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon primary-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Reportes & Exportación</h3>
                <p>Genera reportes PDF listos para tomar decisiones de compra.</p>
              </div>
            </div>
          </div>

          <div className="auth-side-footer">
            <p>&copy; {new Date().getFullYear()} Inventory Manage. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>

      {/* Panel Derecho: Formulario de Registro */}
      <div className="auth-form-panel">
        <div className="form-container-wrapper">
          <div className="auth-logo-top">
            <img src={logoImg} className="main-logo" alt="Logo de la Empresa" />
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
