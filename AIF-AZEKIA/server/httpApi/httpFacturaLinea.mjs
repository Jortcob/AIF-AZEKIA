import { libFacturaLinea } from "../appLib/libFacturaLinea.mjs";
import { libFacturas } from "../appLib/libFacturas.mjs";
import { libImpuestos } from "../appLib/libImpuestos.mjs";
import { libGenerales } from "../appLib/libGenerales.mjs";

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpFacturaLinea {

    async postObtenerDatosFinalesFactura(req, res) {
        try {
            const { empresaCod, serieCod, facturaVentaNum } = req.body;
    
            const facturaExistente = await libFacturas.comprobarExistenciaFacturaVentaPorCodigo(empresaCod, serieCod, facturaVentaNum);
    
            if (facturaExistente) {
                // Obtener los tipos de impuestos
                const tiposImpuesto = await libImpuestos.obtenerCodigosImpuestos();
                // Obtener los importes de las líneas de la factura
                const importesLineas = await libFacturaLinea.obtenerImportesFacturaLineas(empresaCod, serieCod, facturaVentaNum);
    
                if (importesLineas) {
                    // Crear un mapa de impuestos para fácil acceso
                    const impuestoMap = tiposImpuesto.reduce((acc, curr) => {
                        acc[curr.impuestoCod] = curr.porcentaje;
                        return acc;
                    }, {});
    
                    const resultImpuestos = {};
    
                    importesLineas.forEach(linea => {
                        const { importeBruto, importeNeto, tipoIVACod, tipoIRPFCod } = linea;
    
                        // Procesar IVA
                        if (tipoIVACod) {
                            if (!resultImpuestos[tipoIVACod]) {
                                resultImpuestos[tipoIVACod] = { base: 0, cuota: 0 };
                            }
                            resultImpuestos[tipoIVACod].base += libGenerales.redondeoEuros(importeNeto);
                        }
    
                        // Procesar IRPF
                        if (tipoIRPFCod) {
                            if (!resultImpuestos[tipoIRPFCod]) {
                                resultImpuestos[tipoIRPFCod] = { base: 0, cuota: 0 };
                            }
                            resultImpuestos[tipoIRPFCod].base += libGenerales.redondeoEuros(importeNeto);
                        }
                    });
    
                    const result = Object.entries(resultImpuestos).map(([tipo, valores]) => ({
                        tipo,
                        base: valores.base, // La base ya está redondeada
                        cuota: libGenerales.redondeoEuros((valores.base * impuestoMap[tipo]) / 100)
                    }));
    
                    // Limpiar la tabla FacturaVentaImpuesto antes de insertar nuevos registros
                    await libFacturaLinea.limpiarTablaFacturaVentaImpusto(empresaCod, serieCod, facturaVentaNum);
    
                    // Insertar los nuevos datos en FacturaVentaImpuesto
                    await libFacturaLinea.insertarDatosFacturaVentaImpuestos(empresaCod, serieCod, facturaVentaNum, result);
                    
                    res.status(200).send({ err: false, FacturaVentaImpuesto: result });
                } else {
                    res.status(200).send({ err: true, errmsg: 'No se han podido obtener los datos finales de la factura' });
                }
            } else {
                res.status(200).send({ err: true, errmsg: 'La factura no existe.' });
            }
        } catch (err) {
            console.error('Error al obtener datos finales de la factura:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    
    

    async postObtenerFacturaLineas(req, res) {
        try {
            const { empresaCod, serieCod, facturaVentaNum } = req.body;
    
            console.log(empresaCod, serieCod, facturaVentaNum);
    
            const facturaExistente = await libFacturas.comprobarExistenciaFacturaVentaPorCodigo(empresaCod, serieCod, facturaVentaNum);
    
            if (facturaExistente) {
                const facturaLineas = await libFacturaLinea.obtenerFacturaLineas(empresaCod, serieCod, facturaVentaNum);
    
                console.log(facturaLineas);
    
                if (facturaLineas && facturaLineas.length > 0) {
                    res.status(200).send({ err: false, facturaLineas });
                } else {
                    res.status(200).send({ err: true, errmsg: 'No hay líneas de factura añadidas en este momento' });
                }
            } else {
                res.status(200).send({ err: true, errmsg: 'La factura no existe.' });
            }
        } catch (err) {
            console.error('Error al obtener las líneas de la factura:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    

    async postAgregarFacturaLinea(req, res) {
        try {
            const empresaCod = req.body.empresaCod;
            const serieCod = req.body.serieCod;
            const facturaVentaNum = req.body.facturaVentaNum;

            console.log(empresaCod, serieCod, facturaVentaNum);
            if (!empresaCod || !serieCod || !facturaVentaNum) {
                return res.status(400).send({ err: true, errmsg: "Faltan parámetros requeridos." });
            }

            const ultimaLineaNum = await libFacturaLinea.obtenerUltimaIDFacturaVentaLinea(empresaCod, serieCod, facturaVentaNum);

            if (ultimaLineaNum === null || ultimaLineaNum === undefined) {
                return res.status(500).send({ err: true, errmsg: "Error al obtener el último número de línea de factura." });
            }

            const facturaVentaLineaNum = ultimaLineaNum + 1;

            const resultadoVerificacion = await libFacturaLinea.verficarFacturaVentaLineaAgregar(empresaCod, serieCod, facturaVentaNum);

            if (resultadoVerificacion.isValid) {
                await libFacturaLinea.agregarFacturaVentaLinea(empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum);
                res.status(200).send({ err: false });
            } else {
                res.status(200).send({ err: true, errmsg: resultadoVerificacion.errorMessage });
            }
        } catch (err) {
            console.error('Error en postAgregarFacturaLinea:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor.' });
        }
    }

    async postEliminarFacturaLinea(req, res) {
        try {
            const empresaCod = req.body.empresaCod;
            const serieCod = req.body.serieCod;
            const facturaVentaNum = req.body.facturaVentaNum;
            const facturaVentaLineaNum = req.body.facturaVentaLineaNum;

            const facturaExistente = libFacturas.comprobarExistenciaFacturaVentaPorCodigo(empresaCod, serieCod, facturaVentaNum);

            if (facturaExistente) {
            

            const linea = await libFacturaLinea.eliminarLinea(facturaVentaNum, empresaCod, serieCod, facturaVentaLineaNum);

            res.send(200, { err: false });
            }else {
                res.status(200).send({ err: true, errmsg: 'La factura no existe.' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor.' });
        }
    }

    async postRellenarFacturaLinea(req, res) {
        try {
            const lineaFactura = req.body.lineaFactura;
    
            console.log(lineaFactura);
            if (Object.prototype.toString.call(lineaFactura) === '[object Object]') {
                const atributosRequeridos = ['empresaCod', 'serieCod', 'facturaVentaNum', 'facturaVentaLineaNum'];
                const atributosOpcionales = ['proyectoCod', 'texto', 'cantidad', 'precio', 'importeBruto', 'descuento', 'tipoIVACod', 'tipoIRPFCod'];
                const todosLosAtributos = [...atributosRequeridos, ...atributosOpcionales];
    
                const atributosLineaFactura = Object.keys(lineaFactura);
    
                const atributosObligatoriosDefinidos = atributosRequeridos.every(key => atributosLineaFactura.includes(key) && lineaFactura[key] !== null && lineaFactura[key] !== undefined);
    
                if (atributosObligatoriosDefinidos) {
                    const atributosFaltantes = atributosRequeridos.filter(key => !atributosLineaFactura.includes(key));
                    const atributosExtra = atributosLineaFactura.filter(key => !todosLosAtributos.includes(key));
    
                    if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                        const atributosInvalidos = atributosLineaFactura.filter(key => {
                            const value = lineaFactura[key];
                            if (value === null || value === undefined) return false;
                            switch (key) {
                                case 'cantidad':
                                case 'precio':
                                case 'importeBruto':
                                case 'descuento':
                                    return isNaN(parseFloat(value));
                                default:
                                    return typeof value !== 'string' || value.trim() === '';
                            }
                        });
    
                        if (atributosInvalidos.length === 0) {
                            const camposParaActualizar = {};
                            for (const key of atributosOpcionales) {
                                if (lineaFactura[key] !== null && lineaFactura[key] !== undefined) {
                                    camposParaActualizar[key] = lineaFactura[key];
                                }
                            }
    
                            for (const key of atributosRequeridos) {
                                camposParaActualizar[key] = lineaFactura[key];
                            }
    
                            if (Object.keys(camposParaActualizar).length === atributosRequeridos.length) {
                                return res.status(200).send({
                                    err: true,
                                    errmsg: 'No hay campos opcionales proporcionados para actualizar.'
                                });
                            }
    
                            const resultadoVerificacion = await libFacturaLinea.verificarFacturaVentaLineaRellenar(lineaFactura);
    
                            if (resultadoVerificacion.isValid) {
                                const lineaFacturaActual = await libFacturaLinea.obtenerFacturaVentaLinea(lineaFactura.empresaCod, lineaFactura.serieCod, lineaFactura.facturaVentaNum, lineaFactura.facturaVentaLineaNum);
    
                                const camposDiferentes = {};
                                // Agregar siempre las claves de referencia
                                for (const key of atributosRequeridos) {
                                    camposDiferentes[key] = lineaFactura[key];
                                }
    
                                // Comparar los campos opcionales
                                for (const key in camposParaActualizar) {
                                    if (lineaFacturaActual[key] !== camposParaActualizar[key]) {
                                        camposDiferentes[key] = camposParaActualizar[key];
                                    }
                                }
    
                                if (Object.keys(camposDiferentes).length > atributosRequeridos.length) {
                                    const camposImporteBrutoKeys = ['cantidad', 'precio', 'importeBruto'];
    
                                    const existenTodosImporteBruto = camposImporteBrutoKeys.every(key => key in lineaFactura && lineaFactura[key] !== null);
    
                                    if (existenTodosImporteBruto) {
                                        const validacionImporteBruto = await libFacturaLinea.verificarCamposImporteBruto(lineaFactura.cantidad, lineaFactura.precio, lineaFactura.importeBruto);
                                        if (!validacionImporteBruto.isValid) {
                                            return res.status(200).send({ err: true, errmsg: validacionImporteBruto.errorMessage });
                                        }
                                    }                                
                                    
                                    const camposImporteDescuentoKeys = ['cantidad', 'precio', 'importeBruto', 'descuento'];
                                    const existenTodosImporteDescuento = camposImporteDescuentoKeys.every(key => key in lineaFactura && lineaFactura[key] !== null);

                                    if (existenTodosImporteDescuento) {
                                        lineaFactura.importeDescuento = libGenerales.redondeoEuros(lineaFactura.importeBruto * (lineaFactura.descuento / 100));
                                        camposDiferentes.importeDescuento = lineaFactura.importeDescuento;

                                        const importeNeto = lineaFactura.importeBruto - lineaFactura.importeDescuento;
                                        camposDiferentes.importeNeto = importeNeto;
                                    }
                                    
    
                                    const resultado = await libFacturaLinea.actualizarFacturaVentaLinea(camposDiferentes);
    
                                    res.status(200).send({ err: false, lineaFacturaActualizada: resultado });
    
                                } else {
                                    res.status(200).send({
                                        err: false,
                                        message: 'No hay cambios para actualizar.'
                                    });
                                }
                            } else {
                                res.status(200).send({ err: true, errmsg: resultadoVerificacion.errorMessage });
                            }
                        } else {
                            res.status(200).send({
                                err: true,
                                errmsg: `Los siguientes atributos de la línea de factura deben tener el tipo de datos correcto: ${atributosInvalidos.join(', ')}.`
                            });
                        }
                    } else {
                        res.status(200).send({
                            err: true,
                            errmsg: `El objeto de la línea de factura debe contener exactamente las siguientes claves obligatorias: ${atributosRequeridos.join(', ')} y solo las siguientes claves opcionales: ${atributosOpcionales.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `Los siguientes atributos obligatorios no están definidos en el objeto de la línea de factura: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {
                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de línea de factura válido' });
            }
        } catch (err) {
            console.error('Error al rellenar línea de factura:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    



}

export default new HttpFacturaLinea();
