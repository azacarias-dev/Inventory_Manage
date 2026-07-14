import Producto from './Productos.model.js'

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        return res.status(200).json({ message: 'Productos encontrados', productos });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar productos', error });
    }
}

export const getProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        return res.status(200).json({ message: 'Producto encontrado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar producto', error });
    }
}

export const createProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        return res.status(201).json({ message: 'Producto creado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear producto', error });
    }
}

export const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: 'Producto actualizado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar producto', error });
    }
}

export const deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Producto eliminado', producto });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar producto', error });
    }
}