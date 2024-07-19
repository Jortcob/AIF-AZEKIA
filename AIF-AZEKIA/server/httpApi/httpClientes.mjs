import { libClientes } from "../appLib/libClientes.mjs";
import { libGenerales } from "../appLib/libGenerales.mjs";

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpClientes {
    async postObtenerClientesDatosBasicos(req, res) {
        try {
            const datosCliente = await libClientes.obtenerClientesDatosBasicos();
            if (datosCliente && datosCliente.length > 0) {
                res.status(200).send({ err: false, datosCliente });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay clientes añadidos en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postObtenerClientes(req, res) {
        try {
            const clientes = await libClientes.obtenerClientes();
            console.log('clientes:', clientes)
            if (clientes && clientes.length > 0) {
                res.status(200).send({ err: false, clientes });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay clientes añadidos en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
            console.log('4');

        }
    }

    async postAgregarCliente(req, res) {
        try {
            const cliente = req.body.cliente;

            if (Object.prototype.toString.call(cliente) === '[object Object]') {

                const atributosRequeridos = ['clienteCod', 'CIF', 'razonSocial', 'direccion', 'CP', 'municipio'];
                const atributosCliente = Object.keys(cliente);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosCliente.includes(key));
                const atributosExtra = atributosCliente.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales

                    const atributosInvalidos = Object.keys(cliente).filter(key => typeof cliente[key] !== 'string');

                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        const clienteValido = await libClientes.verificarCliente(cliente);

                        if (!clienteValido) {
                            res.status(200).send({ err: true, errmsg: 'El cliente no es válido' });
                        } else {
                            const resultado = await libClientes.agregarCliente(cliente);
                            res.status(200).send({ err: false, cliente: resultado });
                        }
                    } else {
                        // Si algunos valores no son del tipo de datos adecuado, enviar un mensaje de error
                        res.status(200).send({
                            err: true,
                            errmsg: `Los siguientes atributos de cliente deben ser del tipo varchar: ${atributosFaltantes.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `El objeto de cliente debe contener exactamente las siguientes claves: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {
                // Si req.body.cliente no es un objeto válido, enviar un mensaje de error
                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de cliente válido' });
            }
        } catch (err) {
            console.error('Error al agregar cliente:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postActualizarCliente(req, res) {
        try {
            const cliente = req.body.cliente;
            const cifAnterior = await libClientes.obtenerClientePorCodigo(cliente.clienteCod);

            if (cifAnterior && cifAnterior.CIF !== cliente.CIF) {
                const clienteExistePorCIF = await libClientes.comprobarExistenciaClientePorCIF(cliente.CIF, cliente.clienteCod);
                if (clienteExistePorCIF) {
                    res.status(200).send({ err: true, errmsg: 'El CIF del cliente ya existe en la base de datos' });
                    return;
                }
            }

            const resultado = await libClientes.actualizarCliente(cliente);
            res.status(200).send({ err: false, cliente: { cliente } });
        } catch (err) {
            console.error('Error al actualizar el cliente:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postEliminarCliente(req, res) {
        try {
            const clienteCod = req.body.clienteCod;

            const clienteReferenciado = await libClientes.verificarClienteReferenciado(clienteCod);

            if (clienteReferenciado) {
                res.status(200).send({ err: true, errmsg: 'No se puede eliminar el cliente porque está referenciado en otras tablas' });
                return;
            }else{
            await libClientes.eliminarCliente(clienteCod);
            res.send(200, { err: false });
            }
        } catch (err) {
            res.send(500);
        }
    }
}

export default new HttpClientes();
