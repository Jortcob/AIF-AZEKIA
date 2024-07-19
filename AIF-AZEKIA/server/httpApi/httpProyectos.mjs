import { libProyectos } from "../appLib/libProyectos.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpProyectos {
    
    async postObtenerProyectosDatosBasicos(req, res) {
        try {
            const datosProyecto = await libProyectos.obtenerProyectosDatosBasicos();
            if (datosProyecto && datosProyecto.length > 0) {
                res.status(200).send({ err: false, datosProyecto });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay proyectos añadidos en este momento' });
            }
        } catch (err) {
            console.error('Error al obtener proyectos:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postObtenerProyectos(req, res) {
        try {
            const proyectos = await libProyectos.obtenerProyectos();
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

    async postAgregarProyecto(req, res) {
        try {
            const proyecto = req.body.proyecto;

            if (Object.prototype.toString.call(proyecto) === '[object Object]') {

                const atributosRequeridos = ['proyectoCod', 'nombre', 'fechaInicio', 'fechaFinPrevisto', 'empresaCod', 'clienteCod', 'importeTotalPrevisto', 'importeExtraPrevisto'];
                const atributosProyecto = Object.keys(proyecto);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosProyecto.includes(key));
                const atributosExtra = atributosProyecto.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales
                    
                    const atributosInvalidos = Object.keys(proyecto).filter(key => {
                         if (key === 'importeTotalPrevisto' || key === 'importeExtraPrevisto') {
                            return isNaN(proyecto[key]);
                        } else {
                            return typeof proyecto[key] !== 'string';
                        }
                    });
                    

                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        const proyectoValido = await libProyectos.verificarProyecto(proyecto);

                        if (!proyectoValido) {
                            res.status(200).send({ err: true, errmsg: 'El proyecto no es válido' });
                        } else {
                            const resultado = await libProyectos.agregarProyecto(proyecto);
                            res.status(200).send({ err: false, proyecto: resultado });
                        }
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

    async postActualizarProyecto(req, res) {
        try {
            const proyecto = req.body.proyecto;

            console.log(proyecto);

            const proyectoValido = await libProyectos.verificarProyecto(proyecto, true);


            if (!proyectoValido) {
                res.status(200).send({ err: true, errmsg: 'El proyecto no es válido' });
            } else {
                const resultado = await libProyectos.actualizarProyecto(proyecto);
                res.status(200).send({ err: false, proyecto: resultado });
            }
        } catch (err) {
            console.error('Error al actualizar el proyecto:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postEliminarProyecto(req, res) {
        try {
            const proyectoCod = req.body.proyectoCod;

            const proyectoReferenciado = await libProyectos.verificarProyectoReferenciado(proyectoCod)
            
            if (proyectoReferenciado) {
                res.status(200).send({ err: true, errmsg: 'No se puede eliminar el proyecto porque está referenciado en otras tablas' });
            }else{
            const proyectos = await libProyectos.eliminarProyecto(proyectoCod);
            res.send(200, { err: false });
            }
        } catch (err) {
            res.send(500);
        }
    }

}

export default new HttpProyectos();
