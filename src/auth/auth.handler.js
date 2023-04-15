const jwt = require('jsonwebtoken');

// Controllers
const usersController = require('./users.controller');

const userSignUp = async (req, res) => {
    if (!req.body.userName || !req.body.email || !req.body.password){
        // No Sign Up data was provided inside the body
        return res.status(400).json({message: 'No data was provided'});
    }

    try {
        await usersController.registerUser(req.body.userName, req.body.email, req.body.password);
        return res.status(200).json({message: 'Sign up successfully'});
    } catch (error) {
        return res.status(405).json({message: 'User already exists'});
    }
};

const userLogin = async (req, res) => {
    if (!req.body.email || !req.body.password){
        // No login data was provided inside the body
        return res.status(400).json({message: 'No data was provided'});
    }

    try {
        let user = await usersController.checkUserCredentials(req.body.email, req.body.password);
        const token = jwt.sign(user, 'secretPassword');
        return res.status(200).json({token: token});
    } catch (error) {
        return res.status(error.statusCode).json({message: error.message});
    }
};


exports.userSignUp = userSignUp;
exports.userLogin = userLogin;