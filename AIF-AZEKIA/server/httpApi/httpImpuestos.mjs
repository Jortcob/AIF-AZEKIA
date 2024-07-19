import { libImpuestos } from "../appLib/libImpuestos.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpImpuestos {
    
    async postObtenerIVA(req, res) {
        try {
            const IVA = await libImpuestos.obtenerIVA();
            if (IVA && IVA.length > 0) {
                res.status(200).send({ err: false, IVA });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay tipo IVA añadidos en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postObtenerIRPF(req, res) {
        try {
            const IRPF = await libImpuestos.obtenerIRPF();
            if (IRPF && IRPF.length > 0) {
                res.status(200).send({ err: false, IRPF });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay tipo IRPF añadidos en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postObtenerTipoImpuestos(req, res) {
        try {
            const tipoImpuestos = await libImpuestos.obtenerTipoImpuestos();
            if (tipoImpuestos && tipoImpuestos.length > 0) {
                res.status(200).send({ err: false, tipoImpuestos });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay tipo impuestos añadidos en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postObtenerImpuestos(req, res) {
        try {
            const impuestos = await libImpuestos.obtenerImpuestos();
            if (impuestos && impuestos.length > 0) {
                res.status(200).send({ err: false, impuestos });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay impuestos añadidos en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postAgregarImpuesto(req, res) {
        try {
            const impuesto = req.body.impuesto;

            if (Object.prototype.toString.call(impuesto) === '[object Object]') {

                const atributosRequeridos = ['impuestoCod', 'tipoImpuesto', 'porcentaje'];
                const atributosImpuesto = Object.keys(impuesto);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosImpuesto.includes(key));
                const atributosExtra = atributosImpuesto.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales
                    
                    const atributosInvalidos = Object.keys(impuesto).filter(key => {
                        if (key === 'porcentaje') {
                            return typeof impuesto[key] !== 'number';
                        } else {
                            return typeof impuesto[key] !== 'string';
                        }
                    });
                    

                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        const impuestoValido = await libImpuestos.verificarImpuesto(impuesto);

                        if (!impuestoValido) {
                            res.status(200).send({ err: true, errmsg: 'El impuesto no es válido' });
                        } else {
                            const resultado = await libImpuestos.agregarImpuesto(impuesto);
                            res.status(200).send({ err: false, impuesto: resultado });
                        }
                    } else {
                        // Si algunos valores no son del tipo de datos adecuado, enviar un mensaje de error
                        res.status(200).send({
                            err: true,
                            errmsg: `Los siguientes atributos de impuesto deben ser del tipo varchar: ${atributosFaltantes.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `El objeto de impuesto debe contener exactamente las siguientes claves: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {

                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de impuesto válido' });
            }
        } catch (err) {
            console.error('Error al agregar impuesto:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }

    }

    async postActualizarImpuesto(req, res) {
        try {
            const impuesto = req.body.impuesto;

            console.log(impuesto);

            const impuestoValido = await libImpuestos.verificarImpuesto(impuesto, true);


            if (!impuestoValido) {
                res.status(200).send({ err: true, errmsg: 'El impuesto no es válido' });
            } else {
                const resultado = await libImpuestos.actualizarImpuesto(impuesto);
                res.status(200).send({ err: false, impuesto: resultado });
            }
        } catch (err) {
            console.error('Error al actualizar el impuesto:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postEliminarImpuesto(req, res) {
        try {
            const impuestoCod = req.body.impuestoCod;
            const impuestos = await libImpuestos.eliminarImpuesto(impuestoCod);
            res.send(200, { err: false });
        } catch (err) {
            res.send(500);
        }
    }

}

export default new HttpImpuestos();
