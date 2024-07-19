import { libProyectosDetalles } from "../appLib/libProyectosDetalles.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpProyectosProducidos {
    
    async getObtenerProyectosProducidos(req, res) {
        try {
            const proyectos = await libProyectosDetalles.obtenerProyectosProducidos();
            if (proyectos && proyectos.length > 0) {
                res.status(200).send({ err: false, proyectos });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay proyectos añadidos en este momento' });
            }
        } catch (err) {
            console.error('Error al obtener proyectos:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async getObtenerProyectosCertificados(req, res) {
        try {
            const proyectos = await libProyectosDetalles.obtenerProyectosCertificados();
            if (proyectos && proyectos.length > 0) {
                res.status(200).send({ err: false, proyectos });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay proyectos añadidos en este momento' });
            }
        } catch (err) {
            console.error('Error al obtener proyectos:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postAgregarProyectoProducido(req, res) {
        try {
            const proyecto = req.body.proyecto;

            if (Object.prototype.toString.call(proyecto) === '[object Object]') {

                const atributosRequeridos = ['proyectoCod', 'fecha', 'importe'];
                const atributosProyecto = Object.keys(proyecto);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosProyecto.includes(key));
                const atributosExtra = atributosProyecto.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales
                    
                    const atributosInvalidos = Object.keys(proyecto).filter(key => {
                         if (key === 'importe') {
                            return isNaN(proyecto[key]);
                        } else {
                            return typeof proyecto[key] !== 'string';
                        }
                    });
                    

                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        
                            const resultado = await libProyectosDetalles.agregarProyectoProducido(proyecto);
                            res.status(200).send({ err: false, proyecto: resultado });
                        
                    } else {
                        // Si algunos valores no son del tipo de datos adecuado, enviar un mensaje de error
                        res.status(200).send({
                            err: true,
                            errmsg: `Los siguientes atributos del proyecto deben tener el tipo de datos correcto: ${atributosInvalidos.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `El objeto del proyecto debe contener exactamente las siguientes claves: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {

                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de proyecto válido' });
            }
        } catch (err) {
            console.error('Error al agregar proyecto:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }

    }

    async postActualizarProyectoProducido(req, res) {
        try {
            const proyecto = req.body.proyecto;
            
            console.log(proyecto);
                const resultado = await libProyectosDetalles.actualizarProyectoProducido(proyecto);
                res.status(200).send({ err: false, proyecto: resultado });
            
        } catch (err) {
            console.error('Error al actualizar el proyecto:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postEliminarProyectoProducido(req, res) {
        try {
            const proyectoCod = req.body.proyectoCod;

            const fecha = req.body.fecha;
            
            const proyectos = await libProyectosDetalles.eliminarProyectoProducido(proyectoCod, fecha);
            res.send(200, { err: false });
            
        } catch (err) {
            res.send(500);
        }
    }

}
export default new HttpProyectosProducidos();
