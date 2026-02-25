const pool = require('../db/database');

// GET /api/todos
const getAllTodos = async (req, res, next) => {
    try {
    
        const result = await pool.query('SELECT * FROM todos ORDER BY order_index ASC, id ASC');
        
        res.status(200).json({ data: result.rows, error: null });
    } catch (error) {
        next(error); 
    }
};

// POST /api/todos
const createTodo = async (req, res, next) => {
    try {
        const { title } = req.body;
        
        // Validación
        if (!title || title.trim() === '') {
            return res.status(400).json({ 
                data: null, 
                error: { message: "El título es obligatorio", details: [] } 
            });
        }

        // Evitamos SQL Injection usando queries parametrizadas ($1)
        const result = await pool.query(
            'INSERT INTO todos (title) VALUES ($1) RETURNING *',
            [title.trim()]
        );

        res.status(201).json({ data: result.rows[0], error: null });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTodos,
    createTodo
};