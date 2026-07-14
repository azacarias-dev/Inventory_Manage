import React, { useState, useMemo } from 'react';

export default function ProductosView({ products, categories, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  
  // Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditProd, setCurrentEditProd] = useState(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');

  // Cargar datos para edición
  const openEditModal = (product) => {
    setCurrentEditProd(product);
    setNombre(product.nombreProducto);
    setDescripcion(product.descripcion);
    setPrecio(product.precio);
    setStock(product.stock);
    setCategoria(product.categoria);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !precio || !stock || !categoria) return;
    
    onAddProduct({
      nombreProducto: nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria
    });

    // Reset
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setCategoria('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !precio || !stock || !categoria) return;

    onUpdateProduct(currentEditProd.id, {
      nombreProducto: nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria
    });

    setShowEditModal(false);
  };

  // Filtrado y Búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCatFilter ? p.categoria === selectedCatFilter : true;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCatFilter]);

  // Encontrar el nombre de categoría por id
  const getCategoryName = (catId) => {
    const category = categories.find(c => c.id === catId);
    return category ? category.nombre : 'Sin Categoría';
  };

  return (
    <div className="products-view">
      <div className="view-header-flex">
        <div>
          <h2 className="view-title">Administración de Productos</h2>
          <p className="view-subtitle">Registra, edita y consulta el catálogo de productos de tu negocio</p>
        </div>
        <button className="auth-btn btn-primary" onClick={() => setShowAddModal(true)}>
          <span className="btn-icon">+</span> Nuevo Producto
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Buscar por nombre o descripción..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="select-box">
          <select 
            value={selectedCatFilter} 
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las Categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="table-responsive">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-light">
                  No se encontraron productos en el inventario.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => {
                let stockClass = 'stock-healthy';
                let stockText = 'Saludable';
                if (p.stock === 0) {
                  stockClass = 'stock-out';
                  stockText = 'Agotado';
                } else if (p.stock < 10) {
                  stockClass = 'stock-low';
                  stockText = 'Bajo Stock';
                }

                return (
                  <tr key={p.id}>
                    <td className="font-semibold text-dark">{p.nombreProducto}</td>
                    <td className="text-light">{p.descripcion}</td>
                    <td><span className="category-tag">{getCategoryName(p.categoria)}</span></td>
                    <td className="font-semibold">${p.precio.toFixed(2)}</td>
                    <td className="font-semibold">{p.stock} uds</td>
                    <td>
                      <span className={`status-badge ${stockClass}`}>{stockText}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn edit-btn" onClick={() => openEditModal(p)} title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="action-btn delete-btn" onClick={() => onDeleteProduct(p.id)} title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: NUEVO PRODUCTO */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Agregar Nuevo Producto</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Nombre del Producto</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="auth-input pr-0" placeholder="Ej. Monitor ASUS 24\" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Descripción</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="auth-input textarea-input" placeholder="Detalles de garantía, características..." required />
                </div>
                <div className="modal-row">
                  <div className="input-group flex-1">
                    <label className="input-label">Precio ($)</label>
                    <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className="auth-input pr-0" placeholder="0.00" required />
                  </div>
                  <div className="input-group flex-1">
                    <label className="input-label">Stock Inicial</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="auth-input pr-0" placeholder="0" required />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Categoría</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="auth-input pr-0" required>
                    <option value="">Selecciona una Categoría</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="auth-btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="auth-btn btn-primary">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PRODUCTO */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Editar Producto</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Nombre del Producto</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="auth-input pr-0" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Descripción</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="auth-input textarea-input" required />
                </div>
                <div className="modal-row">
                  <div className="input-group flex-1">
                    <label className="input-label">Precio ($)</label>
                    <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className="auth-input pr-0" required />
                  </div>
                  <div className="input-group flex-1">
                    <label className="input-label">Stock</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="auth-input pr-0" required />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Categoría</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="auth-input pr-0" required>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="auth-btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="auth-btn btn-primary">Actualizar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
