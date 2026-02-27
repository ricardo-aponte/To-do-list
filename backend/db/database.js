const { Pool } = require('pg');
require('dotenv').config();

// config
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// test
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a la base de datos PostgreSQL:', err.stack);
    } else {
        console.log(' Conectado exitosamente a la base de datos PostgreSQL');
    }
    if (client) release(); 
});

module.exports = pool;