const express = require('express');
const middlewares = require('./middlewares/middlewares');

// App
const app = express();

// Setting up app middlewares
middlewares.setUpMiddlewares(app);

// Main route
app.get('/', (req, res) => {
    res.status(200).send('Server response at port 3000');
});

exports.app = app;