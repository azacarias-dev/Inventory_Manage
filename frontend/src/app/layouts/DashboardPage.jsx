import React, { useState, useEffect } from 'react';
import DashboardView from '../../features/inventory/pages/DashboardView';
import ProductosView from '../../features/product/pages/ProductosView';
import MovimientosView from '../../features/inventory/pages/MovimientosView';
import CategoriasView from '../../features/inventory/pages/CategoriasView';
import { axiosAdmin } from '../../shared/api/api';
import logoImg from '../../assets/img/Logo.png';

// Mock inicial de respaldo (se usará si el backend no está disponible)
const INITIAL_CATEGORIES = [
  { id: 'cat-1', nombre: 'Electrónicos', descripcion: 'Componentes de PC, celulares y gadgets', estado: true },
  { id: 'cat-2', nombre: 'Artículos de Oficina', descripcion: 'Sillas, escritorios y papelería', estado: true },
  { id: 'cat-3', nombre: 'Electrodomésticos', descripcion: 'Cafeteras, microondas y refrigeradores', estado: true }
];

const INITIAL_PRODUCTS = [
  { id: 'prod-1', nombreProducto: 'iPhone 15 Pro', descripcion: 'Celular Apple 256GB Color Titanio', precio: 999.00, stock: 12, categoria: 'cat-1', estado: true },
  { id: 'prod-2', nombreProducto: 'Teclado Mecánico Logitech MX', descripcion: 'Teclado inalámbrico con switches táctiles silenciosos', precio: 119.50, stock: 3, categoria: 'cat-1', estado: true },
  { id: 'prod-3', nombreProducto: 'Silla Ergonómica Pro', descripcion: 'Silla con soporte lumbar ajustable y reposacabezas', precio: 189.99, stock: 15, categoria: 'cat-2', estado: true },
  { id: 'prod-4', nombreProducto: 'Cafetera Premium Espresso', descripcion: 'Cafetera italiana de 15 bares con espumador', precio: 149.00, stock: 0, categoria: 'cat-3', estado: true }
];

const INITIAL_MOVEMENTS = [
  { id: 'mov-1', usuario: 'Administrador', producto: 'prod-1', tipo: 'INGRESO', razon: 'Compra inicial a proveedor', cantidad: 12, fecha: '2026-07-10T08:00:00.000Z' },
  { id: 'mov-2', usuario: 'Administrador', producto: 'prod-2', tipo: 'INGRESO', razon: 'Inventario inicial', cantidad: 5, fecha: '2026-07-11T09:00:00.000Z' },
  { id: 'mov-3', usuario: 'Administrador', producto: 'prod-2', tipo: 'SALIDA', razon: 'Venta de prueba a cliente', cantidad: 2, fecha: '2026-07-13T14:30:00.000Z' }
];

export default function DashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [backendActive, setBackendActive] = useState(false);

  // Cargar datos desde el Backend al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar Categorías
        const resCat = await axiosAdmin.get('/categorias');
        const categoriesData = resCat.data.categorias.map(c => ({
          id: c._id,
          nombre: c.nombre,
          descripcion: c.descripcion,
          estado: c.estado
        }));

        // Cargar Productos
        const resProd = await axiosAdmin.get('/productos');
        const productsData = resProd.data.productos.map(p => ({
          id: p._id,
          nombreProducto: p.nombreProducto,
          descripcion: p.descripcion,
          precio: p.precio,
          stock: p.stock,
          categoria: p.categoria,
          estado: p.estado
        }));

        // Cargar Movimientos
        const resMov = await axiosAdmin.get('/movimientosInventario');
        const movementsData = resMov.data.movimientos.map(m => ({
          id: m._id,
          usuario: m.usuario,
          producto: m.producto,
          tipo: m.tipo,
          razon: m.razon,
          cantidad: m.cantidad,
          fecha: m.fecha
        }));

        setCategories(categoriesData);
        setProducts(productsData);
        setMovements(movementsData);
        setBackendActive(true);
      } catch (error) {
        console.warn('Conexión con el backend fallida. Utilizando base de datos local en memoria.', error);
        setBackendActive(false);
      }
    };

    fetchData();
  }, []);

  // Agregar Producto en el Backend
  const handleAddProduct = async (newProd) => {
    try {
      const res = await axiosAdmin.post('/productos', newProd);
      const createdProd = res.data.producto;
      const product = {
        id: createdProd._id,
        nombreProducto: createdProd.nombreProducto,
        descripcion: createdProd.descripcion,
        precio: createdProd.precio,
        stock: createdProd.stock,
        categoria: createdProd.categoria,
        estado: createdProd.estado
      };
      setProducts(prev => [product, ...prev]);
    } catch (error) {
      console.error('Error de backend al agregar producto, aplicando cambio local:', error);
      const product = {
        ...newProd,
        id: `prod-${Date.now()}`,
        estado: true
      };
      setProducts(prev => [product, ...prev]);
    }
  };

  // Editar Producto en el Backend
  const handleUpdateProduct = async (id, updatedFields) => {
    try {
      if (id.startsWith('prod-')) { // Producto local
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
        return;
      }
      const res = await axiosAdmin.put(`/productos/${id}`, updatedFields);
      const updated = res.data.producto;
      setProducts(prev => prev.map(p => p.id === id ? {
        id: updated._id,
        nombreProducto: updated.nombreProducto,
        descripcion: updated.descripcion,
        precio: updated.precio,
        stock: updated.stock,
        categoria: updated.categoria,
        estado: updated.estado
      } : p));
    } catch (error) {
      console.error('Error de backend al actualizar producto, aplicando cambio local:', error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    }
  };

  // Eliminar Producto en el Backend
  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        if (id.startsWith('prod-')) { // Producto local
          setProducts(prev => prev.filter(p => p.id !== id));
          return;
        }
        await axiosAdmin.delete(`/productos/${id}`);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error de backend al eliminar producto, aplicando cambio local:', error);
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  // Registrar Movimiento en el Backend (actualiza stock e inserta log)
  const handleAddMovement = async (newMov) => {
    try {
      const res = await axiosAdmin.post('/movimientosInventario', newMov);
      const createdMov = res.data.movimiento;
      const movement = {
        id: createdMov._id,
        usuario: createdMov.usuario,
        producto: createdMov.producto,
        tipo: createdMov.tipo,
        razon: createdMov.razon,
        cantidad: createdMov.cantidad,
        fecha: createdMov.fecha
      };

      // Refrescar catálogo completo desde el backend para actualizar stock
      const resProd = await axiosAdmin.get('/productos');
      const productsData = resProd.data.productos.map(p => ({
        id: p._id,
        nombreProducto: p.nombreProducto,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: p.stock,
        categoria: p.categoria,
        estado: p.estado
      }));

      setProducts(productsData);
      setMovements(prev => [movement, ...prev]);
    } catch (error) {
      console.error('Error de backend al registrar movimiento, aplicando cambio local:', error);
      const movement = {
        ...newMov,
        id: `mov-${Date.now()}`,
        fecha: new Date().toISOString()
      };
      setProducts(prev => prev.map(p => {
        if (p.id === newMov.producto) {
          const nextStock = newMov.tipo === 'INGRESO' ? p.stock + newMov.cantidad : p.stock - newMov.cantidad;
          return { ...p, stock: nextStock };
        }
        return p;
      }));
      setMovements(prev => [movement, ...prev]);
    }
  };

  // Crear Categoría en el Backend
  const handleAddCategory = async (newCat) => {
    try {
      const res = await axiosAdmin.post('/categorias', newCat);
      const createdCat = res.data.categoria;
      const category = {
        id: createdCat._id,
        nombre: createdCat.nombre,
        descripcion: createdCat.descripcion,
        estado: createdCat.estado
      };
      setCategories(prev => [...prev, category]);
    } catch (error) {
      console.error('Error de backend al crear categoría, aplicando cambio local:', error);
      const category = {
        ...newCat,
        id: `cat-${Date.now()}`
      };
      setCategories(prev => [...prev, category]);
    }
  };

  // Renderizador condicional de Pestañas
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            products={products} 
            categories={categories} 
            movements={movements} 
            onNavigate={setActiveTab} 
          />
        );
      case 'productos':
        return (
          <ProductosView 
            products={products} 
            categories={categories} 
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'movimientos':
        return (
          <MovimientosView 
            products={products} 
            movements={movements} 
            onAddMovement={handleAddMovement}
          />
        );
      case 'categorias':
        return (
          <CategoriasView 
            categories={categories} 
            onAddCategory={handleAddCategory}
          />
        );
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Barra Lateral / Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand-wrapper">
          <img src={logoImg} alt="Logo" className="sidebar-brand-logo" />
          <h1 className="sidebar-brand-name">Inventory Manage</h1>
        </div>

        <div className="sidebar-user-card">
          <div className="sidebar-avatar">ADM</div>
          <div className="sidebar-user-info">
            <span className="user-name">Miguel Pérez</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="menu-icon">📊</span> Dashboard
          </button>
          <button 
            className={`menu-item ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            <span className="menu-icon">📦</span> Productos
          </button>
          <button 
            className={`menu-item ${activeTab === 'movimientos' ? 'active' : ''}`}
            onClick={() => setActiveTab('movimientos')}
          >
            <span className="menu-icon">🔄</span> Movimientos
          </button>
          <button 
            className={`menu-item ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            <span className="menu-icon">🏷️</span> Categorías
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="dashboard-main-content">
        <header className="dashboard-header">
          <div className="header-greeting">
            <h3>Bienvenido de nuevo, Miguel</h3>
            <span className="header-date">
              Conexión backend: {backendActive ? (
                <strong className="text-success font-semibold">Real (API MongoDB)</strong>
              ) : (
                <strong className="text-warning font-semibold">Simulado (Memoria Local)</strong>
              )}
            </span>
          </div>
          <div className="header-actions">
            <span className={`header-badge ${backendActive ? 'success-badge' : 'warning-badge'}`}>
              {backendActive ? 'Conectado' : 'Local'}
            </span>
            <div className="header-avatar-circle">M</div>
          </div>
        </header>

        {/* Contenido Dinámico de la Pestaña Activa */}
        <section className="dashboard-view-wrapper">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
