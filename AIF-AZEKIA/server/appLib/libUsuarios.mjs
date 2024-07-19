import { dbConexion } from "./dbConexion.mjs";

class LibUsuarios {

    async validarCredenciales(correo, contrasena) {
        try {
            const pool = await dbConexion.conectarDB();
            const request = pool.request();
            const consultaUsuario = 'SELECT * FROM Usuario WHERE Correo = @correo';
            request.input('correo', correo);
            const resultados = await request.query(consultaUsuario);
    
            if (resultados.recordset.length === 0) {
                await pool.close();
                return { valido: false};
            }
    
            const usuario = resultados.recordset[0];
            if (usuario.contrasena !== contrasena) {
                await pool.close();
                return { valido: false};
            }
    
            await pool.close();
            return { valido: true, usuario }; // Credenciales válidas
    
        } catch (error) {
            console.error('Error al validar credenciales:', error);
            throw error;
        }
    }
    

    
}

export const libUsuarios = new LibUsuarios();