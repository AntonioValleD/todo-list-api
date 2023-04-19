const express = require('express');
const cors = require('cors');
const middlewares = require('./middlewares/middlewares');

// Database connection
const { dbConnect } = require('./database/db.connect');
dbConnect();

// App
const app = express();

// Seting cors
app.use(cors());

// Setting up app middlewares
middlewares.setUpMiddlewares(app);

// Handler functions
const usersHandler = require('./auth/auth.handler');
const taskController = require('./task/task.handler');
let port = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
    res.status(200).json(`Server response at port ${port}`);
});

app.post('/auth/signup', usersHandler.userSignUp);
app.post('/auth/login', usersHandler.userLogin);

app.get('/task', taskController.getTaskList);
app.post('/task', taskController.addUserTask);
app.put('/task', taskController.setUpUserTasks);
app.patch('/task', taskController.editUserTask);
app.delete('/task', taskController.deleteUserTask);


exports.app = app;