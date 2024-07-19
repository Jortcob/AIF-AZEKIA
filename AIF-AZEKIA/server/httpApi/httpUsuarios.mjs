import { libUsuarios } from "../appLib/libUsuarios.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpUsuarios {

    async  mostrarEmpresas(req, res) {
        try {
            res.sendFile(path.join(staticFilesPath, 'pages/empresas/empresa.html'));
        } catch (error) {
            console.error('Error al procesar la acción de mostrar empresas:', error);
            res.status(500).send('Error al procesar la acción de mostrar empresas');
        }
    }

    async  mostrarClientes(req, res) {
        try {
            res.sendFile(path.join(staticFilesPath, 'pages/clientes/cliente.html'));
        } catch (error) {
            console.error('Error al procesar la acción de mostrar clientes:', error);
            res.status(500).send('Error al procesar la acción de mostrar clientes');
        }
    }

    async  mostrarProyectos(req, res) {
        try {
            res.sendFile(path.join(staticFilesPath, 'pages/proyectos/proyecto.html'));
        } catch (error) {
            console.error('Error al procesar la acción de mostrar proyectos:', error);
            res.status(500).send('Error al procesar la acción de mostrar proyectos');
        }
    }

    async mostrarDetallesProyectos(req, res) {
        try {
        res.sendFile(path.join(staticFilesPath, 'pages/proyectos/detallesProyectos/detallesProyectos.html'));
        
    } catch (error) {
            console.error('Error al procesar la acción de facturas:', error);
            res.status(500).send('Error al conectar con la base de datos');
        }    
    }

    async  mostrarSeries(req, res) {
        try {
            res.sendFile(path.join(staticFilesPath, 'pages/series/serie.html'));
        } catch (error) {
            console.error('Error al procesar la acción de mostrar series:', error);
            res.status(500).send('Error al procesar la acción de mostrar series');
        }
    }
    
    async  mostrarImpuestos(req, res) {
        try {
            res.sendFile(path.join(staticFilesPath, 'pages/impuestos/impuesto.html'));
        } catch (error) {
            console.error('Error al procesar la acción de mostrar impuestos:', error);
            res.status(500).send('Error al procesar la acción de mostrar impuestos');
        }
    }

    async mostrarClientes(req, res) {
        try {
        res.sendFile(path.join(staticFilesPath, 'pages/clientes/cliente.html'));
        
    } catch (error) {
            console.error('Error al procesar la acción de cliente:', error);
            res.status(500).send('Error al conectar con la base de datos');
        }
    }

    async mostrarFacturas(req, res) {
        try {
        res.sendFile(path.join(staticFilesPath, 'pages/facturas/facturas.html'));
        
    } catch (error) {
            console.error('Error al procesar la acción de facturas:', error);
            res.status(500).send('Error al conectar con la base de datos');
        }    
    }

    async crearFactura(req, res) {
        try {
        res.sendFile(path.join(staticFilesPath, 'pages/crearFacturas/crearfactura.html'));
        
    } catch (error) {
            console.error('Error al procesar la acción de facturas:', error);
            res.status(500).send('Error al conectar con la base de datos');
        }    
    }

    async mostrarLogin(req, res) {
        try {
        res.sendFile(path.join(staticFilesPath, 'pages/login/login.html'));
        
    } catch (error) {
            console.error('Error al procesar la acción de login:', error);
            res.status(500).send('Error al conectar con la base de datos');
        }    
    }

    async postLogin(req, res) {
        console.log('Iniciando función postLogin...'); 
        const correo = req.body.correo;
        const contrasena = req.body.contrasena;
        try {
            console.log('Validando credenciales...'); 
            const resultadoValidacion = await libUsuarios.validarCredenciales(correo, contrasena);
    
            if (resultadoValidacion.valido) {
                console.log('Credenciales válidas.'); 
                res.status(200).send({ valido: true });
            } else {
                res.status(200).send({ valido: false });
            }
        } catch (error) {
            console.error('Error al validar credenciales:', error);
            res.status(500).json({ error: true, message: 'Error interno del servidor' });
        }
    }
    
  
    

}

export default new HttpUsuarios();
