import MovimientosInventario from "./MovimientosInventario.model.js";
import Producto from "../Productos/Productos.model.js";

// Todos los movimientos
export const getMovimientosInventario = async (req, res) => {
    try {

        const movimientos = await MovimientosInventario.find();

        return res.status(200)
            .json(
                { message: 'Movimientos de inventario encontrados', movimientos });

    } catch (error) {

        return res.status(500)
            .json(
                { message: 'Error al buscar movimientos de inventario', error });
    }
}


// Movimiento por ID
export const getMovimientoInventario = async (req, res) => {
    try {
        const movimiento = await MovimientosInventario.findById(req.params.id);

        return res.status(200)

            .json({
                message: 'Movimiento de inventario encontrado', movimiento
            });

    } catch (error) {
        return res.status(500)
            .json(
                { message: 'Error al buscar movimiento de inventario', error });
    }
}


// Crear movimiento de inventario
export const createMovimientosInventario = async (req, res) => {
    try {
        const { usuario, producto, tipo, cantidad, razon } = req.body;

        const product = await Producto.findById(producto);

        if (!product) return res.status(404)
            .json(
                { message: 'Producto no encontrado' });

        if (tipo === 'INGRESO') {
            product.stock += cantidad;

        } else {
            if (product.stock < cantidad)

                return res.status(400)
                    .json(
                        { message: 'Stock insuficiente' });
            product.stock -= cantidad;
        }

        await product.save();

        const movimiento = new MovimientosInventario(
            { usuario, producto, tipo, cantidad, razon });

        await movimiento.save();

        return res.status(201)
            .json(
                { message: 'Movimiento de inventario creado', movimiento });
    } catch (error) {
        return res.status(500)
            .json(
                { message: 'Error al crear movimiento de inventario', error });
    }
}

// Movimientos por tipo: Ingreso
export const getMovimientosPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        if (tipo !== 'INGRESO' && tipo !== 'SALIDA') {
            return res.status(400).json({
                message: 'El tipo de movimiento debe ser "INGRESO" o "SALIDA"'
            });
        }
        const movimientos = await MovimientosInventario.find({ tipo });
        return res.status(200).json({ message: 'Movimientos de inventario encontrados', movimientos });
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar movimientos de inventario', error });
    }
};

// Desactivar movimiento de inventario

export const desactivarMovimientoInventario = async (req, res) => {
    try {
        const { id } = req.params;

        const movimiento = await MovimientosInventario.findById(id);
        if (!movimiento) {
            return res.status(404).json({ message: 'No se encontró el movimiento de inventario' });
        }

        if (movimiento.estado === false) {
            return res.status(400).json({ message: 'Este movimiento ya se encuentra desactivado' });
        }
        const product = await Producto.findById(movimiento.producto);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (movimiento.tipo === 'Salida' || movimiento.tipo === 'SALIDA') {
            product.stock += movimiento.cantidad;

        } else if (movimiento.tipo === 'Ingreso' || movimiento.tipo === 'INGRESO') {
            if (product.stock < movimiento.cantidad) {
                return res.status(400).json({
                    message: `Stock insuficiente para cancelar. El stock actual es de ${product.stock} unidades y necesitas retirar ${movimiento.cantidad}.`
                });
            }
            product.stock -= movimiento.cantidad;
        }

        await product.save();

        movimiento.estado = false;
        await movimiento.save();

        return res.status(200).json({
            message: 'Movimiento cancelado con éxito y stock revertido',
            movimiento
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al desactivar el movimiento de inventario',
            error: error.message
        });
    }
}