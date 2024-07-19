import { dbConexion } from "./dbConexion.mjs";
import { libGenerales } from "./libGenerales.mjs";

class LibClientes {
   
    async  verificarClienteReferenciado(clienteCod) {
        try {
            const pool = await dbConexion.conectarDB(); 
            const request = pool.request(); 
            const query = `
                SELECT 
                    COUNT(*) AS count 
                FROM 
                    (
                        SELECT clienteCod FROM Proyecto WHERE clienteCod = @clienteCod
                        UNION ALL
                        SELECT clienteCod FROM FacturaVenta WHERE clienteCod = @clienteCod
                    ) AS derived;
            `;
            request.input('clienteCod', clienteCod); 
            const resultado = await request.query(query); 
            await pool.close(); 
    
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar cliente existente por código:', error);
            throw 'Error al comprobar cliente existente por código';
        }
    }
    
   
    async  obtenerClientesDatosBasicos() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT clienteCod, razonSocial FROM Cliente';
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener clientesCod:', error);
            throw error;
        }
    }
    
    async obtenerClientes() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM Cliente';
            const resultados = await request.query(query);
           await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error; 
        }
    }
    
    async  obtenerClientePorCodigo(clienteCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM Cliente WHERE clienteCod = @clienteCod';
            request.input('clienteCod', clienteCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0] || null;
        } catch (error) {
            console.error('Error al obtener cliente por código de cliente:', error);
            throw 'Error al obtener cliente por código de cliente';
        }
    }
    
  async agregarCliente(cliente) {
            console.log('Cliente:', cliente);
            try {
                const pool = await dbConexion.conectarDB();
                const request = pool.request();
                const query = 'INSERT INTO Cliente (clienteCod, CIF, razonSocial, direccion, CP, municipio) VALUES (@clienteCod, @CIF, @razonSocial, @direccion, @CP, @municipio)';
                request.input('clienteCod', cliente.clienteCod);
                request.input('CIF', cliente.CIF);
                request.input('razonSocial', cliente.razonSocial);
                request.input('direccion', cliente.direccion);
                request.input('CP', cliente.CP);
                request.input('municipio', cliente.municipio);
            
                const resultado = await request.query(query);
                pool.close();
                return(resultado);
            } catch (error) {
                console.error('Error al agregar cliente:', error);
                return (error);
            }
    }
    
    async  actualizarCliente(cliente) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'UPDATE Cliente SET CIF = @CIF, razonSocial = @razonSocial, direccion = @direccion, CP = @CP, municipio = @municipio WHERE clienteCod = @clienteCod';
            request.input('CIF', cliente.CIF);
            request.input('razonSocial', cliente.razonSocial);
            request.input('direccion', cliente.direccion);
            request.input('CP', cliente.CP);
            request.input('municipio', cliente.municipio);
            request.input('clienteCod', cliente.clienteCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la actualización
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            throw 'Error al actualizar cliente';
        }
    }
    

    async  comprobarExistenciaClientePorCodigo(clienteCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM Cliente WHERE clienteCod = @clienteCod';
            request.input('clienteCod', clienteCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar cliente existente por código:', error);
            throw error;
        }
    }
    
    async  comprobarExistenciaClientePorCIF(CIF, clienteCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM Cliente WHERE CIF = @CIF AND clienteCod != @clienteCod';
            request.input('CIF', CIF);
            request.input('clienteCod', clienteCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar cliente existente por CIF:', error);
            throw error;
        }
    }
    
    async  eliminarCliente(clienteCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'DELETE FROM Cliente WHERE clienteCod = @clienteCod';
            request.input('clienteCod', clienteCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; 
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            throw 'Error al eliminar cliente';
        }
    }
    

   async verificarCliente(cliente) {
        if (!libGenerales.verificarCamposVacios(cliente)) {
            return false;
        }

        if (!libGenerales.verificarLongitud(cliente.clienteCod, 20) ||
            !libGenerales.verificarLongitud(cliente.CIF, 20) ||
            !libGenerales.verificarLongitud(cliente.razonSocial, 100) ||
            !libGenerales.verificarLongitud(cliente.direccion, 150) ||
            !libGenerales.verificarLongitud(cliente.CP, 10) ||
            !libGenerales.verificarLongitud(cliente.municipio, 50)) {
            return false;
        }

        const clienteExistePorCodigo = await this.comprobarExistenciaClientePorCodigo(cliente.clienteCod);
        const clienteExistePorCIF = await this.comprobarExistenciaClientePorCIF(cliente.CIF , cliente.clienteCod);

        return !(clienteExistePorCodigo || clienteExistePorCIF);
    }
}

export const libClientes = new LibClientes();
