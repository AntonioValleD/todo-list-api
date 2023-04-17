// Authentication middlewares
const authMiddleware = require('./auth.middleware');
const bodyParser = require('body-parser');


// Add middlewares function
const setUpMiddlewares = (app) => {
    // Authentication
    app.use(bodyParser.json());
    authMiddleware.initPassport();
    app.use(authMiddleware.protectWithJwt);
};


exports.setUpMiddlewares = setUpMiddlewares;