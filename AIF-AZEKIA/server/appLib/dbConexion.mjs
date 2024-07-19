import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

class DbConexion {



    async conectarDB() {
        const sqlConfig = {
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_NAME,
            server: process.env.DB_SERVER,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
                acquireTimeoutMillis: 20000,
            },
            options: {
                encrypt: false,
                trustServerCertificate: true,
                valueOfcryptoCredentialsDetails: {
                    minVersion: 'TLSv1',
                    ciphers: 'DEFAULT@SECLEVEL=0',
                },
            }
        };
     //   console.log(sqlConfig);

        try {
            const pool = new sql.ConnectionPool(sqlConfig);
            await pool.connect();
           //console.log('Conexión establecida correctamente.');
            return pool;

        } catch (err) {
            console.error('Error al conectar a la base de datos:', err);
           return err;
        };
    }
}

export const dbConexion = new DbConexion();
