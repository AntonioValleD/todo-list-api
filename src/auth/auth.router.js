const express = require('express');
const router = express.Router();

// Handler functions
const usersHandler = require('./auth.handler');

// Sign Up route
router.route('/signup')
    .post(usersHandler.userSignUp);

router.route('/login')
    .post(usersHandler.userLogin)


exports.router = router;