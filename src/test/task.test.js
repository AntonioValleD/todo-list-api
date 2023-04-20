const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app').app;

chai.use(chaiHttp);

// Controllers
const usersController = require('../auth/users.controller');
const taskController = require('../task/task.controller');
const UserModel = require('../models/dbModels').UserModel;
const TaskModel = require('../models/dbModels').TaskModel;

// Test settings
let user = {
    userName: 'Rodrigo', 
    email: 'rodri25@gmail.com', 
    password: '3254'
};
let user2 = {
    userName: 'Ramiro', 
    email: 'ram500@gmail.com', 
    password: '3111'
};
let taskList = ['Hacer la cama', 'Ir al parque', 'Preparar la cena', 'Dormir'];
let task1 = 'Hacer de comer';
before(async () => {
    await usersController.registerUser(user.userName, user.email, user.password);
    await usersController.registerUser(user2.userName, user2.email, user2.password);
    let userId = (await usersController.findUserWithEmail(user.email)).userId;
    await taskController.addTask(userId, 'Barrer la casa');
});

describe('Task controller testing', async() => {
    it ('Should return 200 and the user task-list', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .get('/task/all')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.assert.equal(res.body.taskList.length, 1);
                        chai.assert.equal(res.body.taskList[0].taskBody, 'Barrer la casa');
                        chai.assert.equal(res.body.taskList[0].done, false);
                        done();
                    });
            });
    });
    it ('Should return 201 when task is created', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .post('/task')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .send({taskBody: task1})
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 201);
                        chai.request(app)
                            .get('/task/all')
                            .set('Authorization', `JWT ${token}`, 
                                'Content-Type', 'application/json')
                            .end((err, res) => {
                                chai.assert.equal(res.body.taskList.length, 2);
                                chai.assert.equal(res.body.taskList[1].taskBody, task1);
                                chai.assert.equal(res.body.taskList[1].done, false);
                                done();
                            });
                    });
            });
    });
    it ('Should return 200 when task list is modified', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user2)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .put('/task')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .send({taskList: taskList})
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/task/all')
                            .set('Authorization', `JWT ${token}`, 
                                'Content-Type', 'application/json')
                            .end((err, res) => {
                                chai.assert.equal(res.body.taskList.length, 4);
                                done();
                            });
                    });
            });
    });
    it ('Should return 200 when task status is updated', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user2)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .patch('/task')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .send({status: true, index: 0})
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/task/all')
                            .set('Authorization', `JWT ${token}`, 
                                'Content-Type', 'application/json')
                            .end((err, res) => {
                                chai.assert.equal(res.body.taskList[0].done, true);
                                done();
                            });
                    });
            });
    });
    it ('Should return 200 when task is modified', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user2)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .patch('/task')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .send({taskBody: 'Lavar la ropa', index: 0})
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/task/all')
                            .set('Authorization', `JWT ${token}`, 
                                'Content-Type', 'application/json')
                            .end((err, res) => {
                                chai.assert.equal(res.body.taskList.length, 4);
                                chai.assert.equal(res.body.taskList[0].taskBody, 'Lavar la ropa');
                                done();
                            });
                    });
            });
    });
    it ('Should return 200 when task is deleted', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user2)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .delete('/task')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .send({index: 0})
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/task/all')
                            .set('Authorization', `JWT ${token}`, 
                                'Content-Type', 'application/json')
                            .end((err, res) => {
                                chai.assert.equal(res.body.taskList.length, 3);
                                done();
                            });
                    });
            });
    });
    it ('Should return 200 when all tasks are deleted', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send(user2)
            .end((err, res) => {
                let token = res.body.token;
                chai.request(app)
                    .delete('/task')
                    .set('Authorization', `JWT ${token}`, 
                        'Content-Type', 'application/json')
                    .send({all: true})
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/task/all')
                            .set('Authorization', `JWT ${token}`, 
                                'Content-Type', 'application/json')
                            .end((err, res) => {
                                chai.assert.equal(res.body.taskList.length, 0);
                                done();
                            });
                    });
            });
    });
});

after(async () => {
    await UserModel.deleteMany({}).exec();
    await TaskModel.deleteMany({}).exec();
});