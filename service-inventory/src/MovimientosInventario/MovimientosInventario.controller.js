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

        // 1. Buscamos el movimiento de inventario por su ID
        const movimiento = await MovimientosInventario.findById(id);

        if (!movimiento) {
            return res.status(404).json({ message: 'No se encontró el movimiento de inventario' });
        }

        // 2. Si ya está en false (desactivado), evitamos que se vuelva a alterar el stock
        if (movimiento.estado === false) {
            return res.status(400).json({ message: 'Este movimiento ya se encuentra desactivado' });
        }

        const { producto, cantidad, tipo } = movimiento;

        // 3. Calculamos la reversión del stock
        let cambioStock = 0;

        if (tipo === 'Salida') {
            // Si es salida y se cancela: devolvemos/reintegramos las unidades (SUMA)
            cambioStock = cantidad;
        } else if (tipo === 'Ingreso' || tipo === 'Entrada') {
            // Si es entrada y se cancela: retiramos las unidades que entraron (RESTA)
            cambioStock = -cantidad;
        }

        // 4. Buscamos el producto para verificar que exista y validar el stock
        const productoEncontrado = await Producto.findById(producto);
        if (!productoEncontrado) {
            return res.status(404).json({ message: 'El producto asociado a este movimiento ya no existe' });
        }

        // Validación: Evitamos que el stock quede en negativo si restamos un ingreso cancelado
        if (productoEncontrado.stock + cambioStock < 0) {
            return res.status(400).json({
                message: `No se puede cancelar el ingreso. El stock actual es de ${productoEncontrado.stock} y necesitas retirar ${cantidad} unidades.`
            });
        }

        // 5. Actualizamos el stock del producto aplicando la SUMA o RESTA correspondiente
        await Producto.findByIdAndUpdate(producto, { $inc: { stock: cambioStock } });

        // 6. Cambiamos el estado del movimiento a false (Hacemos el PUT)
        const movimientoDesactivado = await MovimientosInventario.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true } // Para retornar el movimiento ya modificado
        );

        return res.status(200).json({
            message: 'Movimiento cancelado con éxito. Se cambió el estado a false y se actualizó el stock del producto.',
            movimiento: movimientoDesactivado
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error al desactivar el movimiento de inventario', error: error.message });
    }
}