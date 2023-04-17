const express = require('express');
const middlewares = require('./middlewares/middlewares');

// App
const app = express();

// Setting up app middlewares
middlewares.setUpMiddlewares(app);

// Handler functions
const usersHandler = require('./auth/auth.handler');
const taskController = require('./task/task.handler');

// Routes
app.get('/', (req, res) => {
    res.status(200).send(`Server response at port ${process.env.PORT}`);
});

app.post('/auth/signup', usersHandler.userSignUp);
app.post('/auth/login', usersHandler.userLogin);

app.get('/task', taskController.getTaskList);
app.post('/task', taskController.addUserTask);
app.put('/task', taskController.setUpUserTasks);
app.patch('/task', taskController.editUserTask);
app.delete('/task', taskController.deleteUserTask);


exports.app = app;