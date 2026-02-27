// configuracion
const API_URL = 'http://localhost:3000/api/todos';
let todos = []; 


const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskListContainer = document.getElementById('taskListContainer');
const emptyStateContainer = document.getElementById('emptyStateContainer');
const itemsCount = document.getElementById('itemsCount');



// obtener tareas

const fetchTodos = async () => {
    try {
        
        taskListContainer.innerHTML = '<div class="ui-message">Cargando tareas...</div>';
        const response = await fetch(API_URL);
        const json = await response.json();
        if (json.error) {
            throw new Error(json.error.message);
        }
        todos = json.data; 
        renderTodos(todos); 
    } catch (error) {
        console.error('Error fetching todos:', error);
        taskListContainer.innerHTML = `<div class="ui-message error">Error al cargar las tareas: ${error.message}</div>`;
    }
};


// mostrar tareas
const renderTodos = (tasksToRender) => {
    taskListContainer.innerHTML = '';

    if (tasksToRender.length === 0) {
        emptyStateContainer.classList.remove('oculto'); 
        itemsCount.textContent = '0 elementos restantes';
        return; 
    }

    emptyStateContainer.classList.add('oculto');
    const pendingCount = todos.filter(t => t.completed === 0).length;
    itemsCount.textContent = `${pendingCount} elementos restantes`;

    tasksToRender.forEach(todo => {
        const li = document.createElement('li');
        li.className = `task-item ${todo.completed === 1 ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <div class="view-mode">
                <button class="check-btn"></button> 
                <span class="task-text">${todo.title}</span> 
                <button class="delete-btn">X</button> 
            </div>
            <div class="edit-mode oculto">
                <input type="text" class="edit-input" value="${todo.title}">
                <button class="save-btn">↑</button>
            </div>
        `;

        taskListContainer.appendChild(li);
    });
};


// inicar aplicacion
document.addEventListener('DOMContentLoaded', fetchTodos);


// post tarea nueva
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const title = taskInput.value.trim();
    if (!title) return; 

    const btn = taskForm.querySelector('.add-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        // Hacemos la petición POST a nuestra 
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ title: title }) 
        });

        const json = await response.json();

        if (json.error) {
            throw new Error(json.error.message);
        }

        todos.push(json.data);
        renderTodos(todos);
        taskInput.value = '';

    } catch (error) {
        console.error('Error al crear tarea:', error);
        alert(`Error al guardar: ${error.message}`);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
        taskInput.focus(); // Devuelvo el cursor al boton 
    }
});



// completar , elimiar y editar tareas

taskListContainer.addEventListener('click', async (e) => {
    const li = e.target.closest('.task-item');
    if (!li) return; 

    const taskId = li.dataset.id; 

    if (e.target.classList.contains('delete-btn')) {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
            const json = await response.json();
            
            if (json.error) throw new Error(json.error.message);

            // Actualizamos la memoria local filtrando la que borramos
            todos = todos.filter(t => t.id != taskId);
            renderTodos(todos); // Redibujamos la pantalla
            
        } catch (error) {
            alert(`Error al eliminar: ${error.message}`);
        }
    }

        // accion completar-descompletar
        if (e.target.classList.contains('check-btn')) {
        const todo = todos.find(t => t.id == taskId);
        const newStatus = todo.completed === 1 ? 0 : 1; 

        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: newStatus })
            });
            const json = await response.json();
            
            if (json.error) throw new Error(json.error.message);
            todo.completed = newStatus;
            renderTodos(todos);
        } catch (error) {
            alert(`Error al actualizar estado: ${error.message}`);
        }
    }

    // guarda edicion
    if (e.target.classList.contains('save-btn')) {
        const editInput = li.querySelector('.edit-input');
        const newTitle = editInput.value.trim();

        if (!newTitle) {
            alert("El título de la tarea no puede estar vacío.");
            editInput.focus();
            return;
        }

        try {
            
            const btn = e.target;
            btn.textContent = 'guardando...';

            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle })
            });
            const json = await response.json();
            
            if (json.error) throw new Error(json.error.message);
            const todo = todos.find(t => t.id == taskId);
            todo.title = newTitle;
            renderTodos(todos);
            
        } catch (error) {
            alert(`Error al guardar los cambios: ${error.message}`);
            e.target.textContent = '↑';
        }
    }
});


// editar tarea

taskListContainer.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('task-text')) {
        const li = e.target.closest('.task-item');
        const viewMode = li.querySelector('.view-mode');
        const editMode = li.querySelector('.edit-mode');
        const editInput = li.querySelector('.edit-input');

        viewMode.classList.add('oculto');
        editMode.classList.remove('oculto');

        editInput.focus();
        const val = editInput.value;
        editInput.value = '';
        editInput.value = val;
    }
});





// 8. FILTROS
const filterButtons = document.querySelectorAll('.sidebar-nav .nav-btn[data-filter]');

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filterType = e.target.dataset.filter;
        let filteredTodos = [];
        
        if (filterType === 'all') {
            filteredTodos = todos; 
        } else if (filterType === 'active') {
            filteredTodos = todos.filter(todo => todo.completed === 0); 
        } else if (filterType === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed === 1); 
        }

        renderTodos(filteredTodos);
    });
});



const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const markAllBtn = document.getElementById('markAllBtn');

// boton limpiar completdas
clearCompletedBtn.addEventListener('click', async () => {
    const completedTasks = todos.filter(t => t.completed === 1);
    
    if (completedTasks.length === 0) {
        alert('No hay tareas completadas para limpiar.');
        return;
    }

    if (!confirm(`¿Seguro que deseas eliminar ${completedTasks.length} tarea(s) completada(s)?`)) return;

    try {
        clearCompletedBtn.textContent = 'Borrando...';
        const deletePromises = completedTasks.map(todo => 
            fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' })
        );
        await Promise.all(deletePromises);
        todos = todos.filter(t => t.completed === 0);
        
        
        document.querySelector('.nav-btn[data-filter="all"]').click();

    } catch (error) {
        alert(`Error al limpiar tareas: ${error.message}`);
    } finally {
        clearCompletedBtn.textContent = 'Limpiar completadas';
    }
});

// boton todo
markAllBtn.addEventListener('click', async () => {
    const pendingTasks = todos.filter(t => t.completed === 0);
    
    if (pendingTasks.length === 0) {
        alert('¡Ya tienes todas las tareas listas!');
        return;
    }

    try {
        markAllBtn.textContent = 'Marcando...';
        const updatePromises = pendingTasks.map(todo => 
            fetch(`${API_URL}/${todo.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: 1 })
            })
        );
        await Promise.all(updatePromises);
        todos = todos.map(t => ({ ...t, completed: 1 }));
        renderTodos(todos);

    } catch (error) {
        alert(`Error al actualizar tareas: ${error.message}`);
    } finally {
        markAllBtn.textContent = 'Marcar todo listo';
    }
});



//  exportar
const exportBtn = document.getElementById('exportBtn');
const scrollTopBtn = document.querySelector('.scroll-top-btn');

xportBtn.addEventListener('click', () => {
    if (todos.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }
    

    const dataStr = JSON.stringify(todos, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis_tareas_db.json';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); 
});

// scrool
scrollTopBtn.addEventListener('click', () => {
    taskListContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});