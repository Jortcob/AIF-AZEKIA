import { dbConexion } from "./dbConexion.mjs";
import { libGenerales } from "./libGenerales.mjs";

class LibSeries {

    async  verificarSerieReferenciada(serieCod, empresaCod) {
        try {
            const pool = await dbConexion.conectarDB(); 
            const request = pool.request(); 
            const query = `
                SELECT 
                    COUNT(*) AS count 
                FROM 
                    FacturaVenta
                WHERE 
                    serieCod = @serieCod AND empresaCod = @empresaCod;
            `;
            request.input('serieCod', serieCod); 
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query); 
            await pool.close(); 
    
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar serie existente por código:', error);
            throw 'Error al comprobar serie existente por código';
        }
    }
    
    async  obtenerSeries() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `SELECT Serie.*, Empresa.razonSocial AS razonSocialEmpresa
                        FROM Serie
                        JOIN Empresa ON Serie.empresaCod = Empresa.empresaCod 
                        ORDER BY Serie.serieCod
                        `;
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener series:', error);
            throw 'Error al obtener series';
        }
    }
    
    async  obtenerSeriePorCodigo(serieCod, empresaCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM Serie WHERE serieCod = @serieCod AND empresaCod = @empresaCod';
            request.input('serieCod', serieCod);
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0] || null;
        } catch (error) {
            console.error('Error al obtener serie por código:', error);
            throw 'Error al obtener serie por código';
        }
    }
    
    async  comprobarExistenciaSeriePorCodigo(serieCod, empresaCod) {        
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM Serie WHERE serieCod = @serieCod AND empresaCod = @empresaCod';
            request.input('serieCod', serieCod);
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar serie existente por código:', error);
            throw 'Error al comprobar serie existente por código';
        }
    }

    async  comprobarRelacionSerieYEmpresa(serieCod, empresaCod) {        
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                SELECT COUNT(*) AS count 
                FROM Serie 
                WHERE serieCod = @serieCod 
                  AND empresaCod = @empresaCod
            `;
            request.input('serieCod', serieCod);
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar serie y empresa por código:', error);
            throw 'Error al comprobar serie y empresa por código';
        }
    }
    
    async  agregarSerie(serie) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'INSERT INTO Serie (serieCod, empresaCod, descripcion, ultimoNumUsado) VALUES (@serieCod, @empresaCod, @descripcion, @ultimoNumUsado)';
            request.input('serieCod', serie.serieCod);
            request.input('empresaCod', serie.empresaCod);
            request.input('descripcion', serie.descripcion);
            request.input('ultimoNumUsado', serie.ultimoNumUsado);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la inserción
        } catch (error) {
            console.error('Error al agregar serie:', error);
            throw 'Error al agregar serie';
        }
    }
    
    async  actualizarSerie(serie) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'UPDATE Serie SET descripcion = @descripcion, ultimoNumUsado = @ultimoNumUsado WHERE serieCod = @serieCod AND empresaCod = @empresaCod';
            request.input('descripcion', serie.descripcion);
            request.input('ultimoNumUsado', serie.ultimoNumUsado);
            request.input('empresaCod', serie.empresaCod);
            request.input('serieCod', serie.serieCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la actualización
        } catch (error) {
            console.error('Error al actualizar serie:', error);
            throw 'Error al actualizar serie';
        }
    }
    
    async  eliminarSerie(serieCod, empresaCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'DELETE FROM Serie WHERE serieCod = @serieCod AND empresaCod = @empresaCod';
            request.input('serieCod', serieCod);
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la eliminación
        } catch (error) {
            console.error('Error al eliminar serie:', error);
            throw 'Error al eliminar serie';
        }
    }
    
    async verificarSerie(serie, actualizar = false) {
        if (!libGenerales.verificarCamposVacios(serie)) {
            return false;
        }
        
        if (!libGenerales.verificarLongitud(serie.serieCod, 10)) {
            return false;
        }
    
        if (!libGenerales.verificarLongitud(serie.descripcion, 100)) {
            return false;
        }
    

        if (typeof serie.empresaCod !== 'string' || typeof serie.serieCod !== 'string') {
            return false;
        }
     
        if (isNaN(serie.ultimoNumUsado) || !Number.isInteger(serie.ultimoNumUsado)) {
            return false;
        }
    
        if (actualizar === true) {
            return true;
        }
    
        const serieExistente = await this.obtenerSeriePorCodigo(serie.serieCod, serie.empresaCod);
    
        return !serieExistente;
    }
    
}

export const libSeries = new LibSeries();
