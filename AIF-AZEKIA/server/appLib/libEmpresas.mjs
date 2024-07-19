import { dbConexion } from "./dbConexion.mjs";
import { libGenerales } from "./libGenerales.mjs";

class LibEmpresas {

    async  verificarEmpresaReferenciada(codEmpresa) {
        try {
            const pool = await dbConexion.conectarDB(); // Conectarse a la base de datos
            const request = pool.request(); // Crear una solicitud
            const query = `
                SELECT 
                    COUNT(*) AS count 
                FROM 
                    (
                        SELECT empresaCod FROM Proyecto WHERE empresaCod = @empresaCod
                        UNION ALL
                        SELECT empresaCod FROM Serie WHERE empresaCod = @empresaCod
                        UNION ALL
                        SELECT empresaCod FROM FacturaVenta WHERE empresaCod = @empresaCod
                    ) AS derived;
            `;
            request.input('empresaCod', codEmpresa); 
            const resultado = await request.query(query); 
            await pool.close(); 
    
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar empresa existente por código:', error);
            throw 'Error al comprobar empresa existente por código';
        }
    }
    
    
    async  obtenerEmpresasDatosBasicos() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT empresaCod, razonSocial FROM Empresa';
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener empresasCod:', error);
            throw 'Error al obtener empresasCod';
        }
    }
    
    async  obtenerEmpresas() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM Empresa';
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener empresas:', error);
            throw 'Error al obtener empresas';
        }
    }
    
    async  obtenerEmpresaPorCodEmpresa(codEmpresa) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM Empresa WHERE empresaCod = @empresaCod';
            request.input('empresaCod', codEmpresa);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0] || null;
        } catch (error) {
            console.error('Error al obtener empresa por código de empresa:', error);
            throw 'Error al obtener empresa por código de empresa';
        }
    }
    
    async  agregarEmpresa(empresa) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'INSERT INTO Empresa (empresaCod, CIF, razonSocial, direccion, CP, municipio) VALUES (@empresaCod, @CIF, @razonSocial, @direccion, @CP, @municipio)';
            request.input('empresaCod', empresa.empresaCod);
            request.input('CIF', empresa.CIF);
            request.input('razonSocial', empresa.razonSocial);
            request.input('direccion', empresa.direccion);
            request.input('CP', empresa.CP);
            request.input('municipio', empresa.municipio);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la inserción
        } catch (error) {
            console.error('Error al agregar empresa:', error);
            throw 'Error al agregar empresa';
        }
    }
    
    async  actualizarEmpresa(empresa) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'UPDATE Empresa SET CIF = @CIF, razonSocial = @razonSocial, direccion = @direccion, CP = @CP, municipio = @municipio WHERE empresaCod = @empresaCod';
            request.input('CIF', empresa.CIF);
            request.input('razonSocial', empresa.razonSocial);
            request.input('direccion', empresa.direccion);
            request.input('CP', empresa.CP);
            request.input('municipio', empresa.municipio);
            request.input('empresaCod', empresa.empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la actualización
        } catch (error) {
            console.error('Error al actualizar empresa:', error);
            throw 'Error al actualizar empresa';
        }
    }
    
    async  comprobarExistenciaEmpresaPorCodigo(codEmpresa) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM Empresa WHERE empresaCod = @empresaCod';
            request.input('empresaCod', codEmpresa);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar empresa existente por código:', error);
            throw 'Error al comprobar empresa existente por código';
        }
    }
    
    async  comprobarExistenciaEmpresaPorCIF(CIF, empresaCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM Empresa WHERE CIF = @CIF AND empresaCod != @empresaCod';
            request.input('CIF', CIF);
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar empresa existente por CIF:', error);
            throw 'Error al comprobar empresa existente por CIF';
        }
    }
    
    async  eliminarEmpresa(empresaCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'DELETE FROM Empresa WHERE empresaCod = @empresaCod';
            request.input('empresaCod', empresaCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la eliminación
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
            throw 'Error al eliminar empresa';
        }
    }
    
   async verificarEmpresa(empresa, actualizar = false) {

    if (!libGenerales.verificarCamposVacios(empresa)) {
        return false;
    }

        if (!libGenerales.verificarLongitud(empresa.empresaCod, 20)) {
            return false;
        }
        if (!libGenerales.verificarLongitud(empresa.CIF, 20)) {
            return false;
        }
        if (!libGenerales.verificarLongitud(empresa.razonSocial, 100)) {
            return false;
        }
        if (!libGenerales.verificarLongitud(empresa.direccion, 150)) {
            return false;
        }
        if (!libGenerales.verificarLongitud(empresa.CP, 10)) {
            return false;
        }
        if (!libGenerales.verificarLongitud(empresa.municipio, 50)) {
            return false;
        }
        const empresaExistePorCIF = await this.comprobarExistenciaEmpresaPorCIF(empresa.CIF, empresa.empresaCod);

        if (actualizar === true) {
            return true;
        }

        const empresaExistePorCodigo = await this.comprobarExistenciaEmpresaPorCodigo(empresa.empresaCod);

        return !(empresaExistePorCodigo || empresaExistePorCIF);
    }
    


}

export const libEmpresas = new LibEmpresas();