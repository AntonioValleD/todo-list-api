// Database
const tasksDatabase = require('../database/db.connect').database.collection('tasks');

const bootstrapTaskList = (userId) => {
    console.log('Creating user task list ...');
    return new Promise(async (resolve, reject) => {
        let newTaskList = {
            userId: userId,
            tasks: []
        };
        await tasksDatabase.insertOne(newTaskList);
        console.log('Task list created!');
        resolve();
    });
};

const findUserTasks = (userId) => {
    console.log('Searching user tasks ...');
    return new Promise(async (resolve, reject) => {
        let userTasks = null;
        console.log('hola');
        await tasksDatabase.find({userId: userId}).forEach((doc) =>{
            console.log('Document found');
            userTasks = doc;
        });
        console.log('hecho!');
        if (userTasks){
            console.log('User tasks found!');
            resolve(userTasks.tasks);
        } else {
            reject(false);
        }
    });
};

const getUserTasks = (userId, filter) => {
    console.log('Getting user tasks ...');
    return new Promise(async (resolve, reject) => {
        try {
            let userTasks = await findUserTasks(userId);
            if (filter == 'all'){
                console.log('All user tasks found!');
                resolve(userTasks);
            } else if (filter == 'completed'){
                let completedTasks = [];
                for (let task of userTasks){
                    if (task.done){
                        completedTasks.push(task);
                    }
                }
                console.log('Done user tasks found!');
                resolve(completedTasks);
            } else if (filter == 'missing'){
                let missingTasks = [];
                for (let task of userTasks){
                    if (!task.done){
                        missingTasks.push(task);
                    }
                }
                console.log('Missing user tasks found!');
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
    console.log('Creating new task list ...');
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
            console.log('Task list created!');
            resolve();
        }
    });
};

const addTask = (userId, taskBody) => {
    console.log('Creating new task');
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
            console.log('New task created!');
            resolve();
        } catch (error) {
            reject();
        }
    });
};

const changeTaskStatus = (userId, index) => {
    console.log('Changing task status ...');
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
            console.log('Task status changed!');
            resolve();
        } catch (error) {
            reject();
        }
    });
};

const editTaskBody = (userId, index, taskBody) => {
    console.log('Editing task ...');
    return new Promise(async (resolve, reject) => {
        try {
            let userTasks = await findUserTasks(userId);
            if (userTasks[index]){
                userTasks[index].taskBody = taskBody;
                await tasksDatabase.updateOne(
                    {userId: userId}, 
                    {$set: {tasks: userTasks}}
                );
                console.log('Task edited!');
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
    console.log('Deleting task ...');
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
                console.log('Task deleted!');
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
    console.log('Cleanig task list ...');
    return new Promise(async (resolve, reject) => {
        await tasksDatabase.updateOne(
            {userId: userId}, 
            {$set: {tasks: []}}
        );
        console.log('Task list clean');
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