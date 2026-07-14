import React, { useMemo } from 'react';

export default function DashboardView({ products, categories, movements, onNavigate }) {
  // Calcular estadísticas con useMemo
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
    const totalValue = products.reduce((acc, curr) => acc + (curr.precio * curr.stock), 0);
    
    // Alertas de bajo stock: stock < 10 y stock > 0
    const lowStockAlerts = products.filter(p => p.stock > 0 && p.stock < 10).length;
    // Agotados
    const outOfStockAlerts = products.filter(p => p.stock === 0).length;
    
    return {
      totalProducts,
      totalStock,
      totalValue,
      lowStock: lowStockAlerts,
      outOfStock: outOfStockAlerts
    };
  }, [products]);

  // Encontrar el nombre de categoría por id
  const getCategoryName = (catId) => {
    const category = categories.find(c => c.id === catId);
    return category ? category.nombre : 'Sin Categoría';
  };

  // Encontrar el nombre de producto por id
  const getProductName = (prodId) => {
    const product = products.find(p => p.id === prodId);
    return product ? product.nombreProducto : 'Producto Eliminado';
  };

  // Lista de alertas críticas (stock <= 10)
  const criticalProducts = useMemo(() => {
    return products.filter(p => p.stock <= 10);
  }, [products]);

  // Últimos 5 movimientos
  const recentMovements = useMemo(() => {
    return [...movements].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  }, [movements]);

  return (
    <div className="dashboard-view">
      <div className="view-header">
        <h2 className="view-title">Dashboard General</h2>
        <p className="view-subtitle">Resumen del estado actual del inventario y alertas del sistema</p>
      </div>

      {/* Tarjetas de Indicadores */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper primary-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Productos</span>
            <span className="stat-value">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper success-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 11h4" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Valor de Inventario</span>
            <span className="stat-value">${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card warning-border">
          <div className="stat-icon-wrapper warning-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Bajo Stock (Alertas)</span>
            <span className="stat-value text-warning">{stats.lowStock}</span>
          </div>
        </div>

        <div className="stat-card danger-border">
          <div className="stat-icon-wrapper danger-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Productos Agotados</span>
            <span className="stat-value text-danger">{stats.outOfStock}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-details-grid">
        {/* Panel de Alertas de Stock */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Alertas Críticas de Inventario</h3>
            <button className="panel-action-btn" onClick={() => onNavigate('productos')}>Gestionar</button>
          </div>
          <div className="panel-content">
            {criticalProducts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon success-text">✓</span>
                <p>Todo el inventario está en niveles saludables.</p>
              </div>
            ) : (
              <div className="alerts-list">
                {criticalProducts.map(p => (
                  <div key={p.id} className={`alert-item ${p.stock === 0 ? 'critical-alert' : 'warning-alert'}`}>
                    <div className="alert-details">
                      <span className="alert-prod-name">{p.nombreProducto}</span>
                      <span className="alert-prod-cat">{getCategoryName(p.categoria)}</span>
                    </div>
                    <div className="alert-status">
                      <span className="alert-badge">{p.stock === 0 ? 'AGOTADO' : 'STOCK BAJO'}</span>
                      <span className="alert-qty">{p.stock} unidades</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel de Movimientos Recientes */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Actividad Reciente</h3>
            <button className="panel-action-btn" onClick={() => onNavigate('movimientos')}>Ver Historial</button>
          </div>
          <div className="panel-content">
            {recentMovements.length === 0 ? (
              <div className="empty-state">
                <p>No se han registrado movimientos de inventario aún.</p>
              </div>
            ) : (
              <div className="activities-timeline">
                {recentMovements.map(m => (
                  <div key={m.id} className="activity-item">
                    <div className={`activity-bullet ${m.tipo === 'INGRESO' ? 'success' : 'danger'}`}></div>
                    <div className="activity-details">
                      <div className="activity-header">
                        <span className="activity-action">
                          {m.tipo === 'INGRESO' ? 'Entrada registrada' : 'Salida registrada'}
                        </span>
                        <span className="activity-time">{new Date(m.fecha).toLocaleDateString()}</span>
                      </div>
                      <p className="activity-desc">
                        Se {m.tipo === 'INGRESO' ? 'añadieron' : 'retiraron'} <strong>{m.cantidad} uds.</strong> de <strong>{getProductName(m.producto)}</strong>.
                      </p>
                      <span className="activity-reason">Razón: {m.razon}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
