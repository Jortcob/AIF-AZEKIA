import { dbConexion } from "./dbConexion.mjs";
import { libGenerales } from "./libGenerales.mjs";
import { libSeries } from "./libSeries.mjs";
import { libEmpresas } from "./libEmpresas.mjs";
import { libClientes } from "./libClientes.mjs";

class LibFacturas {

    
    async  agregarFactura(factura, bloqueada) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'INSERT INTO FacturaVenta (empresaCod, serieCod, facturaVentaNum, clienteCod, fechaEmision, bloqueada) VALUES (@empresaCod, @serieCod, @facturaVentaNum, @clienteCod, @fechaEmision, @bloqueada)';
            request.input('empresaCod', factura.empresaCod);
            request.input('serieCod', factura.serieCod);
            request.input('facturaVentaNum', factura.facturaVentaNum);
            request.input('clienteCod', factura.clienteCod);
            request.input('fechaEmision', factura.fechaEmision);
            request.input('bloqueada', bloqueada);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; // Número de filas afectadas por la inserción
        } catch (error) {
            console.error('Error al agregar factura:', error);
            throw 'Error al agregar factura';
        }
    }
    
    async  obtenerFacturas() {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                SELECT FacturaVenta.*, Cliente.razonSocial AS razonSocialCliente, Empresa.razonSocial AS razonSocialEmpresa
                FROM FacturaVenta
                JOIN Cliente ON FacturaVenta.clienteCod = Cliente.clienteCod
                JOIN Empresa ON FacturaVenta.empresaCod = Empresa.empresaCod
            `;
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener facturas:', error);
            throw 'Error al obtener facturas';
        }
    }
    
    async eliminarFactura(empresaCod, serieCod, facturaventaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'DELETE FROM facturaventa WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaventaNum =  @facturaventaNum';
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaventaNum', facturaventaNum);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0]; 
        } catch (error) {
            console.error('Error al eliminar factura:', error);
            throw 'Error al eliminar factura';
        }
    }
    
    async verificarFacturaVentaReferenciada(facturaVentaNum, empresaCod, serieCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request(); 
            const query = `
                SELECT 
                    COUNT(*) AS count 
                FROM 
                    FacturaVentaLinea 
                WHERE 
                    facturaVentaNum = @facturaVentaNum AND empresaCod = @empresaCod AND serieCod = @serieCod;
            `;
            request.input('facturaVentaNum', facturaVentaNum);           
            request.input('empresaCod', empresaCod);            
            request.input('serieCod', serieCod);
            const resultado = await request.query(query);
            await pool.close(); 
    
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar referencia de facturaVentaNum:', error);
            throw 'Error al comprobar referencia de facturaVentaNum';
        }
    }
    
   async  verificarFactura(factura, actualizar = false) {
    if (!libGenerales.verificarCamposVacios(factura)) {
        return { isValid: false, errorMessage: 'Todos los campos deben estar llenos.' };
    }
    
    if (!libGenerales.verificarLongitud(factura.empresaCod, 20)) {
        return { isValid: false, errorMessage: 'El código de la empresa debe tener una longitud máxima de 20 caracteres.' };
    }

    if (!libGenerales.verificarLongitud(factura.serieCod, 10)) {
        return { isValid: false, errorMessage: 'El código de la serie debe tener una longitud máxima de 10 caracteres.' };
    }
    
    if (isNaN(factura.facturaVentaNum)) {
        return { err: true, errorMessage: 'El número de la factura de venta debe ser formato numérico.' };
    }

    if (!libGenerales.verificarLongitud(factura.facturaVentaNum, 20)) {
        return { isValid: false, errorMessage: 'El número de la factura de venta debe tener una longitud máxima de 20 caracteres.' };
    }

    if (!libGenerales.verificarLongitud(factura.clienteCod, 20)) {
        return { isValid: false, errorMessage: 'El código del cliente debe tener una longitud máxima de 20 caracteres.' };
    }

    if (isNaN(Date.parse(factura.fechaEmision))) {
        return { isValid: false, errorMessage: 'La fecha de emisión no es válida.' };
    }

    if (typeof factura.empresaCod !== 'string' ||
        typeof factura.serieCod !== 'string' ||
        typeof factura.clienteCod !== 'string') {
        return { isValid: false, errorMessage: 'Los códigos de empresa, serie y cliente deben ser cadenas de texto.' };
    }

    if(!await libClientes.comprobarExistenciaClientePorCodigo(factura.clienteCod)){
        return { isValid: false, errorMessage: 'El código del cliente no existe.' };
    }

    if(!await libEmpresas.comprobarExistenciaEmpresaPorCodigo(factura.empresaCod)){
        return { isValid: false, errorMessage: 'El código de la empresa no existe.' };
    }

    if(!await libSeries.comprobarExistenciaSeriePorCodigo(factura.serieCod, factura.empresaCod)){
        return { isValid: false, errorMessage: 'El código de la serie no existe.' };
    }

    if(!await libSeries.comprobarRelacionSerieYEmpresa(factura.serieCod, factura.empresaCod)){
        return { isValid: false, errorMessage: 'La serie no está asociada a la empresa.' };
    }

    if (!await this.verificarSecuenciaLogicaFactura(factura)) {
        return { isValid: false, errorMessage: 'La secuencia lógica de la fecha de emisión no es correcta.' };
    }
    
    if (actualizar === true) {
        return { isValid: true };
    }


    if (await this.obtenerFacturaExistente(factura.empresaCod, factura.serieCod, factura.facturaVentaNum)) {
        return { isValid: false, errorMessage: 'Ya existe una factura con el mismo código de empresa, serie y número de factura de venta.' };
    }

    return { isValid: true };
}


    async  verificarSecuenciaLogicaFactura(factura) {
        try {
            const facturasExistentes = await this.obtenerFacturasPorCodigos(factura.empresaCod, factura.serieCod);
    
            for (let facturaExistente of facturasExistentes) {
                if (factura.facturaVentaNum > facturaExistente.facturaVentaNum && new Date(facturaExistente.fechaEmision) > new Date(factura.fechaEmision)) {
                    return false; 
                } else if (factura.facturaVentaNum < facturaExistente.facturaVentaNum && new Date(facturaExistente.fechaEmision) < new Date(factura.fechaEmision)) {
                    return false; 
                }
            }
    
            return true;
        } catch (error) {
            console.error('Error al verificar secuencia lógica de factura:', error);
            throw 'Error al verificar secuencia lógica de factura';
        }
    }
    
    async  obtenerFacturaExistente(empresaCod, serieCod, facturaVentaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                SELECT * FROM FacturaVenta
                WHERE empresaCod = @empresaCod 
                AND serieCod = @serieCod 
                AND facturaVentaNum = @facturaVentaNum
            `;
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0];
        } catch (error) {
            console.error('Error al obtener factura por código:', error);
            throw 'Error al obtener factura por código';
        }
    }
    
    async  obtenerFacturasPorCodigos(empresaCod, serieCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                SELECT *
                FROM FacturaVenta
                WHERE empresaCod = @empresaCod
                AND serieCod = @serieCod
            `;
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset;
        } catch (error) {
            console.error('Error al obtener facturas existentes:', error);
            throw 'Error al obtener facturas existentes';
        }
    }
    
    async comprobarExistenciaFacturaVentaPorCodigo(empresaCod, serieCod, facturaVentaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM FacturaVenta WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaNum = @facturaVentaNum';
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar Factura existente por código:', error);
            throw 'Error al comprobar  Factura por código';
        }
    }

}

export const libFacturas = new LibFacturas();