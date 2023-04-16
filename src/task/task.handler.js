// Controllers
const taskController = require('./task.controller');

const getTaskList = async (req, res) => {
    if (!req.body.filter){
        return res.status(400).json({
            message: 'Missing data',
            error: 'Filter object (all/completed/missing) is needed'
        });
    }
    try {
        let taskList = await taskController.getUserTasks(req.user.userId, req.body.filter);
        return res.status(200).json({taskList: taskList});
    } catch (error) {
        return res.status(400).json({message: 'Tasks not found'});
    }
};

const addUserTask = async (req, res) => {
    if (!req.body.taskBody){
        return res.status(400).json({
            message: 'Missing data',
            error: 'TaskBody object (string) is needed'
        });
    }
    try {
        await taskController.addTask(req.user.userId, req.body.taskBody);
        return res.status(201).json({message: 'Task created successfully'});
    } catch (error) {
        return res.status(400).json({
            message: 'Missing data',
            error: 'TaskBody must not be an empty object'
        });
    }
};

const setUpUserTasks = async (req, res) => {
    if (!req.body.taskList){
        return res.status(400).json({
            message: 'Missing data',
            error: 'TaskList object (array) is needed'
        });
    }
    try {
        await taskController.setUpTasks(req.user.userId, req.body.taskList);
        return res.status(200).json({message: 'Tasks created successfully'});
    } catch (error) {
        return res.status(400).json({
            message: 'Missing data',
            error: 'TaskList must not be an empty object'
        });
    }
};

const editUserTask = async (req, res) => {
    if (req.body.status){
        if (!req.body.index && req.body.index != 0){
            return res.status(400).json({
                message: 'Missing data',
                error: 'Task index is needed'
            });
        }
        try {
            await taskController.changeTaskStatus(req.user.userId, req.body.index);
            return res.status(200).json({message: 'Tasks status updated successfully'});
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: 'Task not found',
                error: 'Provided task index does not exist in database'
            });
        }
    } else {
        if (!req.body.taskBody || (!req.body.index && req.body.index != 0)){
            return res.status(400).json({
                message: 'Missing data',
                error: 'taskBody and index objects are needed'
            });
        }
        try {
            await taskController.editTaskBody(req.user.userId, req.body.index, req.body.taskBody);
            return res.status(200).json({message: 'Task edited successfully'});
        } catch (error) {
            return res.status(400).json({
                message: 'Task not found',
                error: 'Provided task index does not exist in database'
            });
        }
    }
};

const deleteUserTask = async (req, res) => {
    if (req.body.all){
        await taskController.cleanUpUserTasks(req.user.userId);
        res.status(200).json({message: 'All tasks deleted successfully'});
    } else {
        if (!req.body.index && req.body.index != 0){
            return res.status(400).json({
                message: 'Missing data',
                error: 'Task index is needed'
            });
        }
        try {
            await taskController.deleteTask(req.user.userId, req.body.index);
            return res.status(200).json({message: 'Task deleted successfully'});
        } catch (error) {
            return res.status(400).json({
                message: 'Task not found',
                error: 'Provided task index does not exist in database'
            });
        }
    }
};


exports.getTaskList = getTaskList;
exports.addUserTask = addUserTask;
exports.setUpUserTasks = setUpUserTasks;
exports.editUserTask = editUserTask;
exports.deleteUserTask = deleteUserTask;