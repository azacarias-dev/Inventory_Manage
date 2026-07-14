import React, { useState } from 'react';

export default function MovimientosView({ products, movements, onAddMovement }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [tipo, setTipo] = useState('INGRESO');
  const [cantidad, setCantidad] = useState('');
  const [razon, setRazon] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Encontrar el nombre del producto por id
  const getProductName = (prodId) => {
    const product = products.find(p => p.id === prodId);
    return product ? product.nombreProducto : 'Producto Eliminado';
  };

  const handleRegisterMovement = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedProduct || !tipo || !cantidad || !razon) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    const qtyNum = parseInt(cantidad);
    if (qtyNum <= 0) {
      setErrorMsg('La cantidad debe ser mayor a 0.');
      return;
    }

    // Buscar producto seleccionado
    const productObj = products.find(p => p.id === selectedProduct);
    if (!productObj) {
      setErrorMsg('Producto no encontrado.');
      return;
    }

    // Validación de salidas
    if (tipo === 'SALIDA' && productObj.stock < qtyNum) {
      setErrorMsg(`Stock insuficiente. Solo quedan ${productObj.stock} unidades de este producto.`);
      return;
    }

    // Registrar
    onAddMovement({
      producto: selectedProduct,
      tipo,
      cantidad: qtyNum,
      razon,
      usuario: 'Administrador' // Nombre fijo por simulación
    });

    // Reset
    setSelectedProduct('');
    setTipo('INGRESO');
    setCantidad('');
    setRazon('');
  };

  return (
    <div className="movements-view">
      <div className="view-header">
        <h2 className="view-title">Movimientos de Inventario</h2>
        <p className="view-subtitle">Registra entradas y salidas de existencias y consulta el historial de transacciones</p>
      </div>

      <div className="movements-grid">
        {/* Formulario de Registro */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Registrar Entrada / Salida</h3>
          </div>
          <div className="panel-content">
            <form onSubmit={handleRegisterMovement} className="auth-form">
              {errorMsg && (
                <div className="alert-message error-bg text-white">
                  {errorMsg}
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Seleccionar Producto</label>
                <select 
                  value={selectedProduct} 
                  onChange={(e) => setSelectedProduct(e.target.value)} 
                  className="auth-input pr-0"
                  required
                >
                  <option value="">-- Elige un producto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombreProducto} (Stock actual: {p.stock} uds)
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-row">
                <div className="input-group flex-1">
                  <label className="input-label">Tipo de Movimiento</label>
                  <select 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)} 
                    className="auth-input pr-0"
                    required
                  >
                    <option value="INGRESO">INGRESO (Entrada)</option>
                    <option value="SALIDA">SALIDA (Egreso)</option>
                  </select>
                </div>

                <div className="input-group flex-1">
                  <label className="input-label">Cantidad</label>
                  <input 
                    type="number" 
                    placeholder="Cantidad" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(e.target.value)} 
                    className="auth-input pr-0"
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Razón o Motivo</label>
                <input 
                  type="text" 
                  placeholder="Ej. Reabastecimiento de proveedor, Venta minorista..." 
                  value={razon} 
                  onChange={(e) => setRazon(e.target.value)} 
                  className="auth-input pr-0"
                  required 
                />
              </div>

              <button type="submit" className="auth-btn btn-primary mt-2">
                Guardar Movimiento
              </button>
            </form>
          </div>
        </div>

        {/* Historial de Movimientos */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Historial de Transacciones</h3>
          </div>
          <div className="panel-content">
            <div className="table-responsive max-h-500">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Razón</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-light">
                        No hay movimientos registrados.
                      </td>
                    </tr>
                  ) : (
                    [...movements].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(m => (
                      <tr key={m.id}>
                        <td className="text-light">{new Date(m.fecha).toLocaleDateString()}</td>
                        <td className="font-semibold text-dark">{getProductName(m.producto)}</td>
                        <td>
                          <span className={`status-badge ${m.tipo === 'INGRESO' ? 'stock-healthy' : 'stock-out'}`}>
                            {m.tipo}
                          </span>
                        </td>
                        <td className="font-semibold">{m.cantidad} uds</td>
                        <td className="text-light">{m.razon}</td>
                        <td className="text-light">{m.usuario}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
