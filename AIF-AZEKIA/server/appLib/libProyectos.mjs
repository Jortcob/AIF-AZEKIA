import { dbConexion } from "./dbConexion.mjs";
import { libGenerales } from "./libGenerales.mjs";

class LibProyectos {
   
    async  comprobarExistenciaProyectoPorCodigo(proyectoCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM Proyecto WHERE proyectoCod = @proyectoCod';
            request.input('proyectoCod', proyectoCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar proyecto existente por código:', error);
            throw 'Error al comprobar proyecto existente por código';
        }
    }
   
    async  verificarProyectoReferenciado(proyectoCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                SELECT 
                    COUNT(*) AS count 
                FROM 
                    (
                        SELECT proyectoCod FROM FacturaVentaLinea WHERE proyectoCod = @proyectoCod
                        UNION ALL
                        SELECT proyectoCod FROM ProyectoProducido WHERE proyectoCod = @proyectoCod
                        UNION ALL
                        SELECT proyectoCod FROM ProyectoCertificado WHERE proyectoCod = @proyectoCod
                    ) AS derived;
            `;
            request.input('proyectoCod', proyectoCod); 
            const resultado = await request.query(query); 
            await pool.close(); 
    
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar proyecto existente por código:', error);
            throw 'Error al comprobar proyecto existente por código';
        }
    }
    
    async  obtenerProyectosDatosBasicos() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT proyectoCod, nombre FROM Proyecto';
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            throw error;
        }
    }
    async  obtenerProyectos() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                SELECT Proyecto.*, Cliente.razonSocial AS razonSocialCliente, Empresa.razonSocial AS razonSocialEmpresa
                FROM Proyecto
                JOIN Cliente ON Proyecto.clienteCod = Cliente.clienteCod
                JOIN Empresa ON Proyecto.empresaCod = Empresa.empresaCod
            `;
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            throw 'Error al obtener proyectos';
        }
    }
    
    
    async  obtenerProyectoPorCodigo(proyectoCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM Proyecto WHERE proyectoCod = @proyectoCod';
            request.input('proyectoCod', proyectoCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0] || null;
        } catch (error) {
            console.error('Error al obtener proyecto por código:', error);
            throw 'Error al obtener proyecto por código';
        }
    }
    
    async  agregarProyecto(proyecto) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'INSERT INTO Proyecto (proyectoCod, nombre, fechaInicio, fechaFinPrevisto, empresaCod, clienteCod, importeTotalPrevisto, importeExtraPrevisto) VALUES (@proyectoCod, @nombre, @fechaInicio, @fechaFinPrevisto, @empresaCod, @clienteCod, @importeTotalPrevisto, @importeExtraPrevisto)';
            request.input('proyectoCod', proyecto.proyectoCod);
            request.input('nombre', proyecto.nombre);
            request.input('fechaInicio', proyecto.fechaInicio);
            request.input('fechaFinPrevisto', proyecto.fechaFinPrevisto);
            request.input('empresaCod', proyecto.empresaCod);
            request.input('clienteCod', proyecto.clienteCod);
            request.input('importeTotalPrevisto', proyecto.importeTotalPrevisto);
            request.input('importeExtraPrevisto', proyecto.importeExtraPrevisto);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la inserción
        } catch (error) {
            console.error('Error al agregar proyecto:', error);
            throw 'Error al agregar proyecto';
        }
    }
    
    async  actualizarProyecto(proyecto) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'UPDATE Proyecto SET nombre = @nombre, fechaInicio = @fechaInicio, fechaFinPrevisto = @fechaFinPrevisto, empresaCod = @empresaCod, clienteCod = @clienteCod, importeTotalPrevisto = @importeTotalPrevisto, importeExtraPrevisto = @importeExtraPrevisto WHERE proyectoCod = @proyectoCod';
            request.input('nombre', proyecto.nombre);
            request.input('fechaInicio', proyecto.fechaInicio);
            request.input('fechaFinPrevisto', proyecto.fechaFinPrevisto);
            request.input('empresaCod', proyecto.empresaCod);
            request.input('clienteCod', proyecto.clienteCod);
            request.input('importeTotalPrevisto', proyecto.importeTotalPrevisto);
            request.input('importeExtraPrevisto', proyecto.importeExtraPrevisto);
            request.input('proyectoCod', proyecto.proyectoCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la actualización
        } catch (error) {
            console.error('Error al actualizar proyecto:', error);
            throw 'Error al actualizar proyecto';
        }
    }
    
    async  eliminarProyecto(proyectoCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'DELETE FROM Proyecto WHERE proyectoCod = @proyectoCod';
            request.input('proyectoCod', proyectoCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la eliminación
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            throw 'Error al eliminar proyecto';
        }
    }
    

    async verificarProyecto(proyecto, actualizar = false) {
        if (!libGenerales.verificarCamposVacios(proyecto)) {
            return false;
        }
        
        if (!libGenerales.verificarLongitud(proyecto.proyectoCod, 20)) {
            return false;
        }
    
        if (!libGenerales.verificarLongitud(proyecto.nombre, 100)) {
            return false;
        }
    
        
    
        // Verificar que los campos de empresaCod y clienteCod sean cadenas de texto (pueden ser validados según el formato esperado)
        if (typeof proyecto.empresaCod !== 'string' || typeof proyecto.clienteCod !== 'string') {
            return false;
        }
    
        // Verificar que los campos de importeTotalPrevisto e importeExtraPrevisto sean números
        if (isNaN(proyecto.importeTotalPrevisto) || isNaN(proyecto.importeExtraPrevisto)) {
            return false;
        }
    
        if (actualizar === true) {
            return true;
        }
    
        const proyectoExistente = await this.obtenerProyectoPorCodigo(proyecto.proyectoCod);
    
        return !proyectoExistente;
    }
    
}

export const libProyectos = new LibProyectos();
