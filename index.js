// Archivo restaurado manualmente
// Importamos las dependencias necesarias
const express = require('express'); // Framework para crear el servidor y las rutas
const cors = require('cors'); // Middleware para permitir solicitudes desde otros orígenes

const app = express(); // Creamos la aplicación de Express
const PORT = process.env.PORT || 4000; // Definimos el puerto, usando una variable de entorno o 4000 por defecto

// Middlewares para procesar JSON y habilitar CORS
app.use(cors());
app.use(express.json());

// Array en memoria para almacenar las tareas y un contador para los IDs
let tasks = [];
let nextId = 1;

// Endpoint para obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  res.json(tasks); // Devuelve el array de tareas en formato JSON
});

// Endpoint para crear una nueva tarea
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  // Validamos que el título esté presente
  if (!title) return res.status(400).json({ error: 'El título es requerido' });
  // Creamos la nueva tarea
  const newTask = { id: nextId++, title, description: description || '', completed: false };
  tasks.push(newTask); // Agregamos la tarea al array
  res.status(201).json(newTask); // Respondemos con la tarea creada
});

// Endpoint para actualizar una tarea existente
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  // Buscamos la tarea por su ID
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  // Actualizamos los campos si se enviaron en la petición
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  res.json(task); // Respondemos con la tarea actualizada
});

// Endpoint para eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  // Buscamos el índice de la tarea a eliminar
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
  tasks.splice(index, 1); // Eliminamos la tarea del array
  res.status(204).end(); // Respondemos sin contenido
});

// Iniciamos el servidor y mostramos un mensaje en consola
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});