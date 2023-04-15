// Database
let tasksDatabase = require('../database/db.connect').tasksCollection;

const bootstrapTaskList = (userId) => {
    return new Promise(async (resolve, reject) => {
        let newTaskList = {
            userId: userId,
            tasks: []
        };
        await tasksDatabase.insertOne(newTaskList);
        resolve();
    });
};

const findUserTasks = (userId) => {
    return new Promise(async (resolve, reject) => {
        let userTasks = null;
        await tasksDatabase.find({userId: userId}).forEach((doc) =>{
            userTasks = doc;
        });
        if (userTasks){
            resolve(userTasks.tasks);
        } else {
            reject(false);
        }
    });
};

const getUserTasks = (userId, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userTasks = await findUserTasks(userId);
            if (filter == 'all'){
                resolve(userTasks);
            } else if (filter == 'completed'){
                let completedTasks = [];
                for (let task of userTasks){
                    if (task.done){
                        completedTasks.push(task);
                    }
                }
                resolve(completedTasks);
            } else if (filter == 'missing'){
                let missingTasks = [];
                for (let task of userTasks){
                    if (!task.done){
                        missingTasks.push(task);
                    }
                }
                resolve(missingTasks);
            } else {
                reject();
            }
        } catch (error) {
            reject();
        }
    });
};

const setUpTasks = (userId, taskList) => {
    return new Promise(async (resolve, reject) => {
        if (taskList[0] == ''){
            reject();
        } else {
            let userTasks = [];
            for (let taskBody of taskList){
                let task = {
                    index: userTasks.length,
                    taskBody: taskBody,
                    done: false
                };
                userTasks.push(task);
            }
            await tasksDatabase.updateOne(
                {userId: userId}, 
                {$set: {tasks: userTasks}}
            );
            resolve();
        }
    });
};

const addTask = (userId, taskBody) => {
    return new Promise(async (resolve, reject) => {
        if (taskBody == ''){
            reject();
        }
        try {
            let userTasks = await findUserTasks(userId);
            let newTask = {
                index: userTasks.length,
                taskBody: taskBody,
                done: false
            };
            userTasks.push(newTask);
            await tasksDatabase.updateOne(
                {userId: userId}, 
                {$set: {tasks: userTasks}}
            );
            resolve();
        } catch (error) {
            reject();
        }
    });
};

const changeTaskStatus = (userId, index) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userTasks = await findUserTasks(userId);
            if (userTasks[index].done == false){
                userTasks[index].done = true;
            } else if (userTasks[index].done == true){
                userTasks[index].done = false;
            } else {
                reject();
            }
            await tasksDatabase.updateOne(
                {userId: userId}, 
                {$set: {tasks: userTasks}}
            );
            resolve();
        } catch (error) {
            reject();
        }
    });
};

const editTaskBody = (userId, index, taskBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userTasks = await findUserTasks(userId);
            if (userTasks[index]){
                userTasks[index].taskBody = taskBody;
                await tasksDatabase.updateOne(
                    {userId: userId}, 
                    {$set: {tasks: userTasks}}
                );
                resolve();
            } else {
                reject();
            }
        } catch (error) {
            reject();
        }
    });
};

const deleteTask = (userId, index) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userTasks = await findUserTasks(userId);
            if (userTasks[index]){
                userTasks.splice(index, 1);
                for (let i = 0; i < userTasks.length; i++){
                    userTasks[i].index = i;
                }
                await tasksDatabase.updateOne(
                    {userId: userId}, 
                    {$set: {tasks: userTasks}}
                );
                resolve();
            } else {
                reject();
            }
        } catch (error) {
            reject();
        }
    });
};

const cleanUpUserTasks = (userId) => {
    return new Promise(async (resolve, reject) => {
        await tasksDatabase.updateOne(
            {userId: userId}, 
            {$set: {tasks: []}}
        );
        resolve();
    });
};


exports.bootstrapTaskList = bootstrapTaskList;
exports.cleanUpUserTasks = cleanUpUserTasks;
exports.addTask = addTask;
exports.setUpTasks = setUpTasks;
exports.getUserTasks = getUserTasks;
exports.editTaskBody = editTaskBody;
exports.changeTaskStatus = changeTaskStatus;
exports.deleteTask = deleteTask;