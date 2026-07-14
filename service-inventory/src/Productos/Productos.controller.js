import Producto from './Productos.model.js'

// Todos los productos
export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        return res.status(200).json({ message: 'Productos encontrados', productos });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar productos', error });
    }
}

// Producto por ID
export const getProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        return res.status(200).json({ message: 'Producto encontrado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar producto', error });
    }
}

// Crear producto
export const createProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        return res.status(201).json({ message: 'Producto creado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear producto', error });
    }
}

// Actualizar producto
export const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: 'Producto actualizado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar producto', error });
    }
}

// Desactivar producto
export const desactivarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, { estado: false }, { new: true });
        return res.status(200).json({ message: 'Producto desactivado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al desactivar producto', error });
    }
}

// Activar producto
export const activarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, { estado: true }, { new: true });
        return res.status(200).json({ message: 'Producto activado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al activar producto', error });
    }
}

// Buscar producto por categoria
export const buscarProductoPorCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'El ID de la categoría es obligatorio' });
        }

        const productos = await Producto.find({ categoria: id })
            .populate('categoria', 'nombreCategoria');

        return res.status(200).json({ message: 'Productos encontrados', productos });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }
}

// Buscar producto por nombre
export const buscarProductoPorNombre = async (req, res) => {
    try {
        const { nombrescoincidentes } = req.params;

        if (!nombrescoincidentes) {
            return res.status(400).json({ message: 'El término de búsqueda es obligatorio en la URL' });
        }

        const regex = new RegExp(nombrescoincidentes, 'i');

        const productos = await Producto.find({ nombreProducto: regex });

        return res.status(200).json({ message: 'Productos encontrados', productos });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }
}
