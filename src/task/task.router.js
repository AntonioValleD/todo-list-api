const express = require('express');
const router = express.Router();

// Handlers
const taskController = require('./task.handler');


router.route('/')
    .get(taskController.getTaskList)
    .post(taskController.addUserTask)
    .put(taskController.setUpUserTasks)
    .patch(taskController.editUserTask)
    .delete(taskController.deleteUserTask)

exports.router = router;