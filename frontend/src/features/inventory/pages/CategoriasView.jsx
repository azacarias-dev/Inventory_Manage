import React, { useState } from 'react';

export default function CategoriasView({ categories, onAddCategory }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion) return;

    onAddCategory({
      nombre,
      descripcion,
      estado: true
    });

    setNombre('');
    setDescripcion('');
  };

  return (
    <div className="categories-view">
      <div className="view-header">
        <h2 className="view-title">Gestión de Categorías</h2>
        <p className="view-subtitle">Organiza tus productos en categorías para estructurar adecuadamente el catálogo</p>
      </div>

      <div className="movements-grid">
        {/* Formulario de Registro */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Crear Nueva Categoría</h3>
          </div>
          <div className="panel-content">
            <form onSubmit={handleAddCategory} className="auth-form">
              <div className="input-group">
                <label className="input-label">Nombre de Categoría</label>
                <input 
                  type="text" 
                  placeholder="Ej. Accesorios de PC, Calzado" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  className="auth-input pr-0"
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Descripción</label>
                <textarea 
                  placeholder="Detalla qué tipos de productos abarca esta categoría..." 
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)} 
                  className="auth-input textarea-input"
                  required 
                />
              </div>

              <button type="submit" className="auth-btn btn-primary mt-2">
                Agregar Categoría
              </button>
            </form>
          </div>
        </div>

        {/* Listado de Categorías */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Categorías Registradas</h3>
          </div>
          <div className="panel-content">
            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td className="font-semibold text-dark">{c.nombre}</td>
                      <td className="text-light">{c.descripcion}</td>
                      <td>
                        <span className={`status-badge ${c.estado ? 'stock-healthy' : 'stock-out'}`}>
                          {c.estado ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
