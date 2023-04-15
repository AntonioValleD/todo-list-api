const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app').app;

chai.use(chaiHttp);

let user = {
    userName: 'Carlos', 
    email: 'carlos48@gmail.com', 
    password: '9876'
};
let invalidUser = {
    userName: 'Carlos', 
    email: 'carlos48@gmail.com', 
    password: '1234'
};

describe('User login testing', () => {
    it ('Should return 400 when no login data is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });
    it ('Should return 404 when user is not registered', (done) => {
        chai.request(app)
            .post('/auth/login')
            .send(user)
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 404);
                done();
            });
    });
    it ('Should return 401 for invaild user credentials', (done) => {
        chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                chai.request(app)
                    .post('/auth/login')
                    .send(invalidUser)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 401);
                        done();
                    });
            });
    });
    it ('Should return 200 for successful login', (done) => {
        chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                chai.request(app)
                    .post('/auth/login')
                    .send(user)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        done();
                    });
            });
    });
});