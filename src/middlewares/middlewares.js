// Authentication middlewares
const authMiddleware = require('./auth.middleware');
const bodyParser = require('body-parser');

// Router middlewares
const authRoutes = require('../auth/auth.router').router;
const taskRoutes = require('../task/task.router').router;


// Add middlewares function
const setUpMiddlewares = (app) => {
    // Authentication
    app.use(bodyParser.json());
    authMiddleware.initPassport();
    app.use(authMiddleware.protectWithJwt);

    // Routers
    app.use('/auth', authRoutes);
    app.use('/task', taskRoutes);
};


exports.setUpMiddlewares = setUpMiddlewares;