require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db/database'); 

// rutas
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//rutas 
app.use('/api/todos', todoRoutes);

// Middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        data: null, 
        error: { message: "Error interno del servidor", details: [err.message] } 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});