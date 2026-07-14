import MovimientosInventario from "./MovimientosInventario.model.js";
import Producto from "../Productos/Productos.model.js";

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
