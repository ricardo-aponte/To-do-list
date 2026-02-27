# To-Do List 

Una aplicación web Full-Stack de lista de tareas (Single Page Application) diseñada para crear, leer, actualizar y eliminar tareas (CRUD). 

Este proyecto demuestra la implementación de una arquitectura cliente-servidor clásica sin el uso de frameworks en el frontend, priorizando el rendimiento, la manipulación directa del DOM y la comunicación asíncrona con una base de datos

## Tecnologías Utilizadas

* **Frontend:** HTML5 Semántico, CSS3 puro (Grid/Flexbox) y Vanilla JavaScript.
* **Backend:** Node.js con Express.
* **Base de Datos:** PostgreSQL (paquete `pg` para Node).

##  Requisitos Previos

Para ejecutar este proyecto en tu máquina local, necesitas tener instalado:
* [Node.js](https://nodejs.org/) (v14 o superior)
* [PostgreSQL](https://www.postgresql.org/) (v12 o superior)

##  Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo:

1. **Clonar el repositorio:**
   \`\`\`bash
   git clone <URL_DE_TU_REPOSITORIO_AQUI>
   cd <NOMBRE_DE_LA_CARPETA>
   \`\`\`

2. **Instalar dependencias del servidor:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar la Base de Datos:**
   * Abre PostgreSQL (pgAdmin o psql) y crea una base de datos llamada `todo_db` (o el nombre que hayas usado).
   * Ejecuta el script SQL incluido en el proyecto para crear la tabla `todos` y agregar datos de prueba.
   * *Nota: Asegúrate de actualizar las credenciales (usuario, contraseña, puerto) en el archivo `backend/db/database.js` para que coincidan con tu configuración local de Postgres.*

## Ejecutar la Aplicación

1. **Iniciar el servidor Backend:**
   Abre una terminal en la raíz del proyecto y ejecuta:
   \`\`\`bash
   node backend/server.js
   \`\`\`
   El servidor debería indicar que está corriendo en `http://localhost:3000`.

2. **Iniciar el Frontend:**
   Como el frontend está construido en HTML/JS puro, simplemente haz doble clic en el archivo `index.html` para abrirlo en tu navegador web de preferencia, o utiliza una extensión como Live Server en VS Code.