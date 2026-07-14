import Categoria from './Categoria.model.js'


export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        return res.status(200).json({ message: 'Categorias encontradas', categorias });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar categorias', error });
    }
}


export const getCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        return res.status(200).json({ message: 'Categoria encontrada', categoria });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar categoria', error });
    }
}


export const createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = new Categoria({ nombre, descripcion });
        await categoria.save();
        return res.status(201).json({ message: 'Categoria creada', categoria });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear categoria', error });
    }
}


export const updateCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: 'Categoria actualizada', categoria });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar categoria', error });
    }
}


export const desactivarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(req.params.id, { estado: false }, { new: true });
        return res.status(200).json({ message: 'Categoria desactivada', categoria });
    } catch (error) {
        return res.status(500).json({ message: 'Error al desactivar categoria', error });
    }
}
