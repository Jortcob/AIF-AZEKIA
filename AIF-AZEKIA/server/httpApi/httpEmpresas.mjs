import { libEmpresas } from "../appLib/libEmpresas.mjs";
import { libGenerales } from "../appLib/libGenerales.mjs";

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpEmpresas {

    async postObtenerEmpresasDatosBasicos(req, res) {
        try {
            const datosEmpresa = await libEmpresas.obtenerEmpresasDatosBasicos();
            if (datosEmpresa && datosEmpresa.length > 0) {
                res.status(200).send({ err: false, datosEmpresa });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay empresas añadidas en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postObtenerEmpresas(req, res) {
        try {
            const empresas = await libEmpresas.obtenerEmpresas();
            if (empresas && empresas.length > 0) {
                res.status(200).send({ err: false, empresas });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay empresas añadidas en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }


    async postAgregarEmpresa(req, res) {
        try {
            const empresa = req.body.empresa;

            if (Object.prototype.toString.call(empresa) === '[object Object]') {

                const atributosRequeridos = ['empresaCod', 'CIF', 'razonSocial', 'direccion', 'CP', 'municipio'];
                const atributosEmpresa = Object.keys(empresa);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosEmpresa.includes(key));
                const atributosExtra = atributosEmpresa.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales

                    const atributosInvalidos = Object.keys(empresa).filter(key => typeof empresa[key] !== 'string');


                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        const empresaValida = await libEmpresas.verificarEmpresa(empresa);

                        if (!empresaValida) {
                            res.status(200).send({ err: true, errmsg: 'La empresa no es válida' });
                        } else {
                            const resultado = await libEmpresas.agregarEmpresa(empresa);
                            res.status(200).send({ err: false, empresa: resultado });
                        }
                    } else {
                        // Si algunos valores no son del tipo de datos adecuado, enviar un mensaje de error
                        res.status(200).send({
                            err: true,
                            errmsg: `Los siguientes atributos de empresa deben ser del tipo varchar: ${atributosFaltantes.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `El objeto de empresa debe contener exactamente las siguientes claves: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {
                // Si req.body.empresa no es un objeto válido, enviar un mensaje de error
                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de empresa válido' });
            }
        } catch (err) {
            console.error('Error al agregar empresa:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }

    }

    async postActualizarEmpresa(req, res) {
        try {
            const empresa = req.body.empresa;
            const cifAnterior = await libEmpresas.obtenerEmpresaPorCodEmpresa(empresa.empresaCod);

            if (cifAnterior && cifAnterior.CIF !== empresa.CIF) {
                const empresaExistePorCIF = await libEmpresas.comprobarExistenciaEmpresaPorCIF(empresa.CIF, empresa.empresaCod);
                if (empresaExistePorCIF) {
                    res.status(200).send({ err: true, errmsg: 'El CIF de la empresa ya existe en la base de datos' });
                    return;
                }
            }

            const empresaValida = await libEmpresas.verificarEmpresa(empresa, true);

            if (!empresaValida) {
                res.status(200).send({ err: true, errmsg: 'La empresa no es válida' });
            } else {
                const resultado = await libEmpresas.actualizarEmpresa(empresa);
                res.status(200).send({ err: false, empresa: resultado });
            }
        } catch (err) {
            console.error('Error al actualizar la empresa:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }


    async postEliminarEmpresa(req, res) {
        try {
            const empresaCod = req.body.empresaCod;
            const empresaReferenciada = await libEmpresas.verificarEmpresaReferenciada(empresaCod);
            if (empresaReferenciada) {
                res.status(200).send({ err: true, errmsg: 'No se puede eliminar la empresa porque está referenciada en otras tablas' });
            }else{
                const empresas = await libEmpresas.eliminarEmpresa(empresaCod);
                res.send(200, { err: false });
            }
            
        } catch (err) {
            res.send(500);
        }
    }

}

export default new HttpEmpresas();
