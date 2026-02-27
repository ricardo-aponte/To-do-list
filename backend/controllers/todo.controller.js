const pool = require('../db/database');

// lista tareas
const getAllTodos = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY order_index ASC, id ASC');
        res.status(200).json({ data: result.rows, error: null });
    } catch (error) {
        next(error); 
    }
};


const createTodo = async (req, res, next) => {
    try {
        const { title } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ 
                data: null, 
                error: { message: "El título es obligatorio", details: [] } 
            });
        }

        const result = await pool.query(
            'INSERT INTO todos (title) VALUES ($1) RETURNING *',
            [title.trim()]
        );

        res.status(201).json({ data: result.rows[0], error: null });
    } catch (error) {
        next(error);
    }
};


const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        // 1. Verificamos si la tarea existe
        const check = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ 
                data: null, 
                error: { message: "Tarea no encontrada", details: [] } 
            });
        }
        const currentTodo = check.rows[0];
        const newTitle = title !== undefined ? title : currentTodo.title;
        const newCompleted = completed !== undefined ? completed : currentTodo.completed;

        const result = await pool.query(
            'UPDATE todos SET title = $1, completed = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [newTitle, newCompleted, id]
        );

        res.status(200).json({ data: result.rows[0], error: null });
    } catch (error) {
        next(error);
    }
};


const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        // Si no se eliminó nada, es porque el ID no existía
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                data: null, 
                error: { message: "Tarea no encontrada", details: [] } 
            });
        }
        
        res.status(200).json({ data: result.rows[0], error: null });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo
};