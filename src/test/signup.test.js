const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app').app;

chai.use(chaiHttp);

let user = {
    userName: 'Antonio', 
    email: 'juan.valle.d@gmail.com', 
    password: '1234'
};
describe('User Sign Up testing', () => {
    it ('Should return 400 when no data is provided', (done) => {
        chai.request(app)
            .post('/auth/signup')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });
    it ('Should return 200 for successful Sign Up', (done) => {
        chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });
    it ('Should return 405 when the user already exists', (done) => {
        chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                chai.request(app)
                .post('/auth/signup')
                .send(user)
                .end((err, res) => {
                    chai.assert.equal(res.statusCode, 405);
                    done();
                });
            });
    });
});