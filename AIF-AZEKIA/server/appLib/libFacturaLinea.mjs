import { dbConexion } from "./dbConexion.mjs";
import { libFacturas } from "./libFacturas.mjs";
import { libGenerales } from "./libGenerales.mjs";
import { libEmpresas } from "./libEmpresas.mjs";
import { libSeries } from "./libSeries.mjs";
import { libProyectos } from "./libProyectos.mjs";
import { libImpuestos } from "./libImpuestos.mjs";

class LibFacturaLinea {

    async eliminarLineasPorFactura(facturaVentaNum, empresaCod, serieCod) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                DELETE FROM 
                    FacturaVentaLinea 
                WHERE 
                    facturaVentaNum = @facturaVentaNum AND empresaCod = @empresaCod AND serieCod = @serieCod;
            `;
            request.input('facturaVentaNum', facturaVentaNum);
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            const resultado = await request.query(query);
            await pool.close();

            return resultado.rowsAffected[0];
        } catch (error) {
            console.error('Error al eliminar FacturaVentaLineas:', error);
            throw 'Error al eliminar FacturaVentaLineas';
        }
    }

    async obtenerFacturaLineas(empresaCod, serieCod, facturaVentaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM facturaventalinea WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaNum = @facturaVentaNum';
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            const resultados = await request.query(query);
            await pool.close();
            return resultados.recordset || [];
        } catch (error) {
            console.error('Error al obtener lineas factura:', error);
            throw 'Error al obtener facturas';
        }
    }

    async obtenerUltimaIDFacturaVentaLinea(empresaCod, serieCod, facturaVentaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();

            const query = `
                SELECT TOP 1 facturaVentaLineaNum 
                FROM FacturaVentaLinea 
                WHERE empresaCod = @empresaCod 
                  AND serieCod = @serieCod 
                  AND facturaVentaNum = @facturaVentaNum 
                ORDER BY facturaVentaLineaNum DESC
            `;

            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);

            const resultados = await request.query(query);
            await pool.close();

            if (resultados.recordset.length > 0) {
                return resultados.recordset[0].facturaVentaLineaNum;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('Error al obtener facturaVentaLineaNum:', error);
            throw 'Error al obtener facturaVentaLineaNum';
        }
    }


    async agregarFacturaVentaLinea(empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                INSERT INTO FacturaVentaLinea 
                (empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum, proyectoCod, texto, cantidad, precio, importeBruto, descuento, importeDescuento, importeNeto, tipoIVACod, tipoIRPFCod)
                VALUES 
                (@empresaCod, @serieCod, @facturaVentaNum, @facturaVentaLineaNum, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
            `;
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            request.input('facturaVentaLineaNum', facturaVentaLineaNum);

            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0];
        } catch (error) {
            console.error('Error al agregar línea de factura:', error);
            throw 'Error al agregar línea de factura';
        }
    }

    async actualizarFacturaVentaLinea(camposParaActualizar) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();

            let query = 'UPDATE FacturaVentaLinea SET ';

            const sets = [];

            for (const [key, value] of Object.entries(camposParaActualizar)) {
                if (key !== 'empresaCod' && key !== 'serieCod' && key !== 'facturaVentaNum' && key !== 'facturaVentaLineaNum') {
                    sets.push(`${key} = @${key}`);
                    request.input(key, value);
                }
            }

            query += sets.join(', ') + ' ';

            query += 'WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaNum = @facturaVentaNum AND facturaVentaLineaNum = @facturaVentaLineaNum';

            request.input('empresaCod', camposParaActualizar.empresaCod);
            request.input('serieCod', camposParaActualizar.serieCod);
            request.input('facturaVentaNum', camposParaActualizar.facturaVentaNum);
            request.input('facturaVentaLineaNum', camposParaActualizar.facturaVentaLineaNum);

            const resultado = await request.query(query);

            await pool.close();

            return resultado.rowsAffected[0];
        } catch (error) {
            console.error('Error al actualizar línea de factura:', error);
            throw 'Error al actualizar línea de factura';
        }
    }

    async eliminarLinea(facturaVentaNum, empresaCod, serieCod, facturaVentaLineaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = `
                DELETE FROM 
                    FacturaVentaLinea 
                WHERE 
                    facturaVentaNum = @facturaVentaNum AND empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaLineaNum = @facturaVentaLineaNum;
            `;
            request.input('facturaVentaNum', facturaVentaNum);
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaLineaNum', facturaVentaLineaNum);

            const resultado = await request.query(query);
            await pool.close();

            return resultado.rowsAffected[0];
        } catch (error) {
            console.error('Error al eliminar FacturaVentaLineas:', error);
            throw 'Error al eliminar FacturaVentaLineas';
        }
    }


    async verficarFacturaVentaLineaAgregar(empresaCod, serieCod, facturaVentaNum) {

        if (!await libGenerales.verificarLongitud(empresaCod, 20)) {
            return { isValid: false, errorMessage: 'El código de la empresa debe tener una longitud máxima de 20 caracteres.' };
        }

        if (!await libGenerales.verificarLongitud(serieCod, 10)) {
            return { isValid: false, errorMessage: 'El código de la serie debe tener una longitud máxima de 10 caracteres.' };
        }

        if (isNaN(facturaVentaNum)) {
            return { isValid: true, errorMessage: 'El número de la factura de venta debe ser formato numérico.' };
        }

        if (typeof empresaCod !== 'string' || typeof serieCod !== 'string') {
            return { isValid: false, errorMessage: 'Los códigos de empresa, serie y cliente deben ser cadenas de texto.' };
        }

        if (!await libEmpresas.comprobarExistenciaEmpresaPorCodigo(empresaCod)) {
            return { isValid: false, errorMessage: 'El código de la empresa no existe.' };
        }

        if (!await libSeries.comprobarExistenciaSeriePorCodigo(serieCod, empresaCod)) {
            console.log(serieCod);
            return { isValid: false, errorMessage: 'La serie no está asociada a la empresa.' };
        }

        if (!await libSeries.comprobarRelacionSerieYEmpresa(serieCod, empresaCod)) {
            return { isValid: false, errorMessage: 'La serie no está asociada a la empresa.' };
        }

        if (!await libFacturas.obtenerFacturaExistente(empresaCod, serieCod, facturaVentaNum)) {
            return { isValid: false, errorMessage: 'No existe una factura con el mismo código de empresa, serie y número de factura de venta.' };
        }

        return { isValid: true };

    }

    async verificarFacturaVentaLineaRellenar(lineaFactura) {
        const { empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum } = lineaFactura;

        if (!await libGenerales.verificarLongitud(empresaCod, 20)) {
            return { isValid: false, errorMessage: 'El código de la empresa debe tener una longitud máxima de 20 caracteres.' };
        }
        if (!await libEmpresas.comprobarExistenciaEmpresaPorCodigo(empresaCod)) {
            return { isValid: false, errorMessage: 'El código de la empresa no existe.' };
        }

        if (!await libGenerales.verificarLongitud(serieCod, 10)) {
            return { isValid: false, errorMessage: 'El código de la serie debe tener una longitud máxima de 10 caracteres.' };
        }
        if (!await libSeries.comprobarExistenciaSeriePorCodigo(serieCod, empresaCod)) {
            return { isValid: false, errorMessage: 'La serie no está asociada a la empresa.' };
        }
        if (!await libSeries.comprobarRelacionSerieYEmpresa(serieCod, empresaCod)) {
            return { isValid: false, errorMessage: 'La serie no está asociada a la empresa.' };
        }

        if (isNaN(facturaVentaNum)) {
            return { isValid: false, errorMessage: 'El número de la factura de venta debe ser formato numérico.' };
        }
        if (!await libFacturas.comprobarExistenciaFacturaVentaPorCodigo(empresaCod, serieCod, facturaVentaNum)) {
            return { isValid: false, errorMessage: 'La factura indicada no existe' };
        }


        if (isNaN(facturaVentaLineaNum)) {
            return { isValid: false, errorMessage: 'El número de la linea de factura de venta debe ser formato numérico.' };
        }

        if (!await this.comprobarExistenciaFacturaVentaLineaPorCodigo(empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum)) {
            return { isValid: false, errorMessage: 'La linea indicada no existe' };
        }


        const validations = [];

        // Validaciones para proyectoCod
        if (lineaFactura.proyectoCod !== undefined && lineaFactura.proyectoCod !== null) {
            if (!await libProyectos.comprobarExistenciaProyectoPorCodigo(lineaFactura.proyectoCod)) {
                validations.push({ isValid: false, errorMessage: 'El código del proyecto no existe.' });
            }
        }

        // Validaciones para texto
        if (lineaFactura.texto !== undefined && lineaFactura.texto !== null) {
            if (typeof lineaFactura.texto !== 'string') {
                validations.push({ isValid: false, errorMessage: 'El texto debe ser una cadena de texto.' });
            }
        }

        if (lineaFactura.cantidad !== undefined && lineaFactura.cantidad !== null) {
            if (isNaN(lineaFactura.cantidad)) {
                validations.push({ isValid: false, errorMessage: 'La cantidad debe ser formato numérico.' });
            } else if (!Number.isInteger(lineaFactura.cantidad)) {
                validations.push({ isValid: false, errorMessage: 'La cantidad debe ser un número entero.' });
            }
        }

        // Validaciones para precio
        if (lineaFactura.precio !== undefined && lineaFactura.precio !== null) {
            if (isNaN(lineaFactura.precio)) {
                validations.push({ isValid: false, errorMessage: 'El precio debe ser formato numérico.' });
            } else {
                const decimalesPrecio = lineaFactura.precio.toString().split('.')[1];
                if (decimalesPrecio && decimalesPrecio.length > 2) {
                    validations.push({ isValid: false, errorMessage: 'El precio debe tener como máximo dos decimales.' });
                }
            }
        }

        // Validaciones para importeBruto
        if (lineaFactura.importeBruto !== undefined && lineaFactura.importeBruto !== null) {
            if (isNaN(lineaFactura.importeBruto)) {
                validations.push({ isValid: false, errorMessage: 'El importe bruto debe ser formato numérico.' });
            } else {
                const decimalesBruto = lineaFactura.importeBruto.toString().split('.')[1];
                if (decimalesBruto && decimalesBruto.length > 2) {
                    validations.push({ isValid: false, errorMessage: 'El importe bruto debe tener como máximo dos decimales.' });
                }
            }
        }

        // Validaciones para descuento
        if (lineaFactura.descuento !== undefined && lineaFactura.descuento !== null) {
            if (isNaN(lineaFactura.descuento)) {
                validations.push({ isValid: false, errorMessage: 'El descuento debe ser formato numérico.' });
            } else {
                const decimalesDescuento = lineaFactura.descuento.toString().split('.')[1];
                if (decimalesDescuento && decimalesDescuento.length > 2) {
                    validations.push({ isValid: false, errorMessage: 'El descuento debe tener como máximo dos decimales.' });
                }
                if (lineaFactura.descuento < 0 || lineaFactura.descuento > 100) {
                    validations.push({ isValid: false, errorMessage: 'El descuento debe estar entre 0 y 100.' });
                }
            }
        }


        // Validaciones para importeNeto (continuación)
        if (lineaFactura.importeNeto !== undefined && lineaFactura.importeNeto !== null) {
            if (isNaN(lineaFactura.importeNeto)) {
                validations.push({ isValid: false, errorMessage: 'El importe neto debe ser formato numérico.' });
            } else {
                const decimalesNeto = lineaFactura.importeNeto.toString().split('.')[1];
                if (decimalesNeto && decimalesNeto.length > 2) {
                    validations.push({ isValid: false, errorMessage: 'El importe neto debe tener como máximo dos decimales.' });
                }
            }
        }


        // Validaciones para tipoIVACod
        if (lineaFactura.tipoIVACod !== undefined && lineaFactura.tipoIVACod !== null) {
            if (!await libImpuestos.comprobarExistenciaImpuestoPorCodigo(lineaFactura.tipoIVACod)) {
                validations.push({ isValid: false, errorMessage: 'El código del tipo de IVA no existe.' });
            }
        }

        // Validaciones para tipoIRPFCod
        if (lineaFactura.tipoIRPFCod !== undefined && lineaFactura.tipoIRPFCod !== null) {
            if (!await libImpuestos.comprobarExistenciaImpuestoPorCodigo(lineaFactura.tipoIRPFCod)) {
                validations.push({ isValid: false, errorMessage: 'El código del tipo de IRPF no existe.' });
            }
        }

        // Si hay errores de validación, retornarlos
        if (validations.length > 0) {
            return { isValid: false, errorMessage: validations.map(validation => validation.errorMessage).join('  ') };
        }

        const camposOpcionales = ['proyectoCod', 'texto', 'cantidad', 'precio', 'importeBruto', 'descuento', 'importeNeto', 'tipoIVACod', 'tipoIRPFCod'];
        if (camposOpcionales.every(key => lineaFactura[key] === undefined || lineaFactura[key] === null)) {
            return { isValid: false, errorMessage: 'No hay campos opcionales definidos para actualizar.' };
        }
        // Si no hay errores de validación, retornar éxito
        return { isValid: true };
    }

    async verificarCamposImporteBruto(cantidad, precio, importeBruto) {
        try {
            if (cantidad <= 0 || isNaN(cantidad)) {
                return { isValid: false, errorMessage: 'La cantidad debe ser un número positivo.' };
            }

            if (precio <= 0 || isNaN(precio)) {
                return { isValid: false, errorMessage: 'El precio debe ser un número positivo.' };
            }

            const importeBrutoCalculado = cantidad * precio;

            if (importeBruto !== undefined && importeBruto !== importeBrutoCalculado) {
                return { isValid: false, errorMessage: 'El importe bruto proporcionado no coincide con el calculado.' };
            }

            return { isValid: true };
        } catch (error) {
            return { isValid: false, errorMessage: 'Error al verificar los campos de importe bruto.' };
        }
    }


    async comprobarExistenciaFacturaVentaLineaPorCodigo(empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT COUNT(*) AS count FROM FacturaVentaLinea WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaNum = @facturaVentaNum AND facturaVentaLineaNum = @facturaVentaLineaNum';
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            request.input('facturaVentaLineaNum', facturaVentaLineaNum);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0].count > 0;
        } catch (error) {
            console.error('Error al comprobar Factura existente por código:', error);
            throw 'Error al comprobar  Factura por código';
        }
    }
    async obtenerFacturaVentaLinea(empresaCod, serieCod, facturaVentaNum, facturaVentaLineaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'SELECT * FROM FacturaVentaLinea WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaNum = @facturaVentaNum AND facturaVentaLineaNum = @facturaVentaLineaNum';
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            request.input('facturaVentaLineaNum', facturaVentaLineaNum);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.recordset[0];
        } catch (error) {
            console.error('Error al obtener linea:', error);
            throw 'Error al obtener linea:', error;
        }
    }

    async limpiarTablaFacturaVentaImpusto(empresaCod, serieCod, facturaVentaNum){
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const query = 'DELETE FROM FacturaVentaImpuesto WHERE empresaCod = @empresaCod AND serieCod = @serieCod AND facturaVentaNum = @facturaVentaNum';
            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);
            const resultado = await request.query(query);
            await pool.close();
            return resultado.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al limpiar tabla FacturaVentaImpuesto:', error);
            throw 'Error al limpiar tabla FacturaVentaImpuesto';
        }
    }
    async insertarDatosFacturaVentaImpuestos(empresaCod, serieCod, facturaVentaNum, facturaVentaImpuestos) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            
            // Generar la consulta con múltiples valores
            let query = `
                INSERT INTO FacturaVentaImpuesto 
                (empresaCod, serieCod, facturaVentaNum, impuestoCod, base, cuota)
                VALUES 
            `;
    
            const values = facturaVentaImpuestos.map(impuesto => {
                const { tipo, base, cuota } = impuesto;
                return `('${empresaCod}', '${serieCod}', ${facturaVentaNum}, '${tipo}', ${base}, ${cuota})`;
            });
    
            query += values.join(', ');
    
            // Ejecutar la consulta
            await request.query(query);
    
            // Cerrar la conexión
            await pool.close();
        } catch (error) {
            console.error('Error al insertar datos en FacturaVentaImpuesto:', error);
            throw 'Error al insertar datos en FacturaVentaImpuesto';
        }
    }
    
    

    async obtenerImportesFacturaLineas(empresaCod, serieCod, facturaVentaNum) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();

            const query = `
                SELECT 
                    importeBruto,
                    importeDescuento,
                    importeNeto,
                    tipoIVACod,
                    tipoIRPFCod	
                FROM 
                    FacturaVentaLinea 
                WHERE 
                    empresaCod = @empresaCod 
                    AND serieCod = @serieCod 
                    AND facturaVentaNum = @facturaVentaNum
            `;

            request.input('empresaCod', empresaCod);
            request.input('serieCod', serieCod);
            request.input('facturaVentaNum', facturaVentaNum);

            const resultado = await request.query(query);
            await pool.close();

            if (resultado.recordset.length === 0) {
                throw new Error('No se encontraron líneas para la factura especificada.');
            }

            return resultado.recordset;
        } catch (error) {
            console.error('Error al obtener los totales de la factura:', error);
            throw new Error('Error al obtener los totales de la factura:', error);
        }
    }

}

export const libFacturaLinea = new LibFacturaLinea();