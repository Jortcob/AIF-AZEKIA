import { libFacturas } from "../appLib/libFacturas.mjs";
import { libFacturaLinea } from "../appLib/libFacturaLinea.mjs";


import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpFacturas {

    async postObtenerFacturas(req, res) {
        try {
            const facturas = await libFacturas.obtenerFacturas();
            if (facturas && facturas.length > 0) {
                res.status(200).send({ err: false, facturas });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay facturas añadidas en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postAgregarFactura(req, res) {
        try {
            const factura = req.body.factura;

            if (Object.prototype.toString.call(factura) === '[object Object]') {

                const atributosRequeridos = ['empresaCod', 'serieCod', 'facturaVentaNum', 'clienteCod', 'fechaEmision'];
                const atributosFactura = Object.keys(factura);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosFactura.includes(key));
                const atributosExtra = atributosFactura.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales

                    const atributosInvalidos = Object.keys(factura).filter(key => {
                        if (key === 'fechaEmision') {
                            return isNaN(Date.parse(factura[key]));
                        } else {
                            return typeof factura[key] !== 'string';
                        }
                    });

                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        const resultadoVerificacion = await libFacturas.verificarFactura(factura);

                        if (!resultadoVerificacion.isValid) {
                            return res.status(200).send({ err: true, errmsg: resultadoVerificacion.errorMessage });
                        }
                        else {
                            const resultado = await libFacturas.agregarFactura(factura, false);
                            res.status(200).send({ err: false, factura: resultado });
                        }
                    } else {
                        // Si algunos valores no son del tipo de datos adecuado, enviar un mensaje de error
                        res.status(200).send({
                            err: true,
                            errmsg: `Los siguientes atributos de la factura deben tener el tipo de datos correcto: ${atributosInvalidos.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `El objeto de la factura debe contener exactamente las siguientes claves: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {
                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de factura válido' });
            }
        } catch (err) {
            console.error('Error al agregar factura:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }


    async postEliminarFactura(req, res) {
        try {
            const empresaCod = req.body.empresaCod;
            const serieCod = req.body.serieCod;
            const facturaVentaNum = req.body.facturaVentaNum;

            const facturaReferenciada = await libFacturas.verificarFacturaVentaReferenciada(facturaVentaNum, empresaCod, serieCod);

            if (facturaReferenciada) {
                await libFacturaLinea.eliminarLineasPorFactura(facturaVentaNum, empresaCod, serieCod);
            }

            await libFacturaLinea.limpiarTablaFacturaVentaImpusto(empresaCod, serieCod, facturaVentaNum);

            const facturaEliminada = await libFacturas.eliminarFactura(empresaCod, serieCod, facturaVentaNum);

            res.send(200, { err: false });
        } catch (err) {
            console.error('Error al eliminar factura:', err);
            res.send(500);
        }
    }


}

export default new HttpFacturas();