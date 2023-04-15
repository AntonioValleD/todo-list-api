const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app').app;


chai.use(chaiHttp);

describe('Server testing', () => {
    it ('Server should respond at port 3000', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });
});