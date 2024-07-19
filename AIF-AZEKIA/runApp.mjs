import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'; 
import path from 'path';
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import morgan from 'morgan';


import httpEmpresas from './server/httpApi/httpEmpresas.mjs';
import httpClientes from './server/httpApi/httpClientes.mjs';
import httpImpuestos from './server/httpApi/httpImpuestos.mjs';
import httpSeries from './server/httpApi/httpSeries.mjs';
import httpUsuarios from './server/httpApi/httpUsuarios.mjs';
import httpFacturas from './server/httpApi/httpFacturas.mjs';
import httpProyectos from './server/httpApi/httpProyectos.mjs';
import httpProyectosDetalles from './server/httpApi/httpProyectosDetalles.mjs';
import httpFacturaLinea from './server/httpApi/httpFacturaLinea.mjs';

dotenv.config();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/browser')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', httpUsuarios.mostrarLogin);

app.post('/login', httpUsuarios.postLogin);

app.get('/detallesProyectos', httpUsuarios.mostrarDetallesProyectos);

app.get('/empresas', httpUsuarios.mostrarEmpresas);

app.get('/clientes', httpUsuarios.mostrarClientes);

app.get('/proyectos', httpUsuarios.mostrarProyectos);

app.get('/series', httpUsuarios.mostrarSeries);

app.get('/facturas', httpUsuarios.mostrarFacturas);

app.get('/impuestos', httpUsuarios.mostrarImpuestos);

app.get('/crearfactura', httpUsuarios.crearFactura);

// Funciones de empresas 

app.post('/obtenerEmpresasDatosBasicos', httpEmpresas.postObtenerEmpresasDatosBasicos);

app.post('/obtenerEmpresas', httpEmpresas.postObtenerEmpresas);

app.post('/agregarEmpresa', httpEmpresas.postAgregarEmpresa);

app.post('/actualizarEmpresa', httpEmpresas.postActualizarEmpresa);

app.post('/eliminarEmpresa', httpEmpresas.postEliminarEmpresa);

// Funciones de clientes

app.post('/obtenerClientesDatosBasicos', httpClientes.postObtenerClientesDatosBasicos);

app.post('/obtenerClientes', httpClientes.postObtenerClientes);

app.post('/agregarCliente', httpClientes.postAgregarCliente);

app.post('/actualizarCliente', httpClientes.postActualizarCliente);

app.post('/eliminarCliente', httpClientes.postEliminarCliente);

//Funciones de impuestos

app.post('/obtenerIVA', httpImpuestos.postObtenerIVA);

app.post('/obtenerIRPF', httpImpuestos.postObtenerIRPF);

app.post('/obtenerTipoImpuestos', httpImpuestos.postObtenerTipoImpuestos);

app.post('/obtenerImpuestos', httpImpuestos.postObtenerImpuestos);

app.post('/agregarImpuesto', httpImpuestos.postAgregarImpuesto);

app.post('/actualizarImpuesto', httpImpuestos.postActualizarImpuesto);

app.post('/eliminarImpuesto', httpImpuestos.postEliminarImpuesto);


//Funciones de series

app.post('/obtenerSeries', httpSeries.postObtenerSeries);

app.post('/agregarSerie', httpSeries.postAgregarSerie);

app.post('/actualizarSerie', httpSeries.postActualizarSerie);

app.post('/eliminarSerie', httpSeries.postEliminarSerie);

//Funciones de proyectos

app.post('/obtenerProyectos', httpProyectos.postObtenerProyectos);

app.post('/obtenerProyectosDatosBasicos', httpProyectos.postObtenerProyectosDatosBasicos);

app.post('/agregarProyecto', httpProyectos.postAgregarProyecto);

app.post('/actualizarProyecto', httpProyectos.postActualizarProyecto);

app.post('/eliminarProyecto', httpProyectos.postEliminarProyecto);

//Funciones de proyectos producidos

app.get('/obtenerProyectosProducidos', httpProyectosDetalles.getObtenerProyectosProducidos);

app.get('/obtenerProyectosCertificados', httpProyectosDetalles.getObtenerProyectosCertificados);

app.post('/agregarProyectoProducido', httpProyectosDetalles.postAgregarProyectoProducido);

app.post('/actualizarProyectoProducido', httpProyectosDetalles.postActualizarProyectoProducido);

app.post('/eliminarProyectoProducido', httpProyectosDetalles.postEliminarProyectoProducido);

//Funciones de facturas

app.post('/obtenerFacturas', httpFacturas.postObtenerFacturas);

app.post('/agregarFactura', httpFacturas.postAgregarFactura);

app.post('/eliminarFactura', httpFacturas.postEliminarFactura);


//Funciones de lineas factura

app.post('/obtenerDatosFinalesFactura', httpFacturaLinea.postObtenerDatosFinalesFactura);

app.post('/obtenerFacturaLineas', httpFacturaLinea.postObtenerFacturaLineas);

app.post('/eliminarFacturaLinea', httpFacturaLinea.postEliminarFacturaLinea);

app.post('/agregarFacturaLinea', httpFacturaLinea.postAgregarFacturaLinea);

app.post('/rellenarFacturaLinea', httpFacturaLinea.postRellenarFacturaLinea);

//Funciones de prueba


app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});