import { libSeries } from "../appLib/libSeries.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpSeries {
    
    async postObtenerSeries(req, res) {
        try {
            const series = await libSeries.obtenerSeries();
            if (series && series.length > 0) {
                res.status(200).send({ err: false, series });
            } else {
                res.status(200).send({ err: true, errmsg: 'No hay series añadidas en este momento' });
            }
        } catch (err) {
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }

    async postAgregarSerie(req, res) {
        try {
            const serie = req.body.serie;

            if (Object.prototype.toString.call(serie) === '[object Object]') {

                const atributosRequeridos = ['serieCod', 'empresaCod', 'descripcion', 'ultimoNumUsado'];
                const atributosSerie = Object.keys(serie);

                const atributosFaltantes = atributosRequeridos.filter(key => !atributosSerie.includes(key));
                const atributosExtra = atributosSerie.filter(key => !atributosRequeridos.includes(key));

                if (atributosFaltantes.length === 0 && atributosExtra.length === 0) {
                    // Todas las claves requeridas están presentes y no hay claves adicionales
                    
                    const atributosInvalidos = Object.keys(serie).filter(key => {
                        if (key === 'ultimoNumUsado') {
                            return isNaN(serie[key]) || !Number.isInteger(serie[key]);
                        } else {
                            return typeof serie[key] !== 'string';
                        }
                    });
                    

                    if (atributosInvalidos.length === 0) {
                        // Todos los valores son del tipo de datos adecuado

                        const serieValida = await libSeries.verificarSerie(serie);

                        if (!serieValida) {
                            res.status(200).send({ err: true, errmsg: 'La serie no es válida' });
                        } else {
                            const resultado = await libSeries.agregarSerie(serie);
                            res.status(200).send({ err: false, serie: resultado });
                        }
                    } else {
                        // Si algunos valores no son del tipo de datos adecuado, enviar un mensaje de error
                        res.status(200).send({
                            err: true,
                            errmsg: `Los siguientes atributos de serie deben tener el tipo de datos correcto: ${atributosFaltantes.join(', ')}.`
                        });
                    }
                } else {
                    res.status(200).send({
                        err: true,
                        errmsg: `El objeto de serie debe contener exactamente las siguientes claves: ${atributosRequeridos.join(', ')}.`
                    });
                }
            } else {

                res.status(200).send({ err: true, errmsg: 'El cuerpo de la solicitud no contiene un objeto de serie válido' });
            }
        } catch (err) {
            console.error('Error al agregar serie:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }

    }

    async postActualizarSerie(req, res) {
        try {
            const serie = req.body.serie;

            console.log(serie);

            const serieValida = await libSeries.verificarSerie(serie, true);


            if (!serieValida) {
                res.status(200).send({ err: true, errmsg: 'La serie no es válida' });
            } else {
                const resultado = await libSeries.actualizarSerie(serie);
                res.status(200).send({ err: false, serie: resultado });
            }
        } catch (err) {
            console.error('Error al actualizar la serie:', err);
            res.status(500).send({ err: true, errmsg: 'Error interno del servidor' });
        }
    }
    async postEliminarSerie(req, res) {
        try {
            const serieCod = req.body.serieCod;
            const empresaCod = req.body.empresaCod;

            console.log(serieCod, empresaCod);
            const serieReferenciada = await libSeries.verificarSerieReferenciada(serieCod, empresaCod);
           
            if (serieReferenciada) {
                res.status(200).send({ err: true, errmsg: 'No se puede eliminar la serie porque está referenciada en otras tablas' });
            }else{
                const series = await libSeries.eliminarSerie(serieCod, empresaCod);
                res.send(200, { err: false });
            }
           
        } catch (err) {
            res.send(500);
        }
    }

}

export default new HttpSeries();
