const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// endpoints
router.get('/',todoController.getAllTodos);
router.post('/',todoController.createTodo);

router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;