const uuid = require('uuid');
const crypto = require('../crypto/crypto');

// Controllers
const taskController = require('../task/task.controller');

// Database
const UserModel = require('../models/dbModels').UserModel;


const findUserWithEmail = (email) => {
    console.log('Searching user ...');
    return new Promise(async (resolve, reject) => {
        let user = await UserModel.findOne({email: email}).exec();
        if (user){
            console.log('User found!');
            resolve({
                userId: user.userId,
                userName: user.userName,
                email: user.email,
                password: user.password
            });
        } else {
            reject(false);
        }
    });
};

const registerUser = (userName, email, password) => {
    console.log('Creating new user ...');
    return new Promise(async (resolve, reject) => {
        try {
            let checkUser = await findUserWithEmail(email);
            console.log('User aready exists');
            reject(false);
        } catch (error) {
            console.log('Building new user ...');
            let userId = uuid.v1();
            let newUser = new UserModel({
                userId: userId,
                userName: userName,
                email: email,
                password: crypto.hashPassword(password)
            });
            await newUser.save();
            await taskController.bootstrapTaskList(userId);
            console.log('New user created');
            resolve();           
        }
    });
};

const checkUserCredentials = (email, password) => {
    console.log('Checking user credentials ...');
    return new Promise(async (resolve, reject) => {
        try {
            let user = await findUserWithEmail(email);
            console.log('Comparing user password ...');
            crypto.comparePasswords(password, user.password, (err, result) => {
                if (!result){
                    reject({statusCode: 401, message: 'Invalid credentials'});
                } else {
                    console.log('Valid credentials found!');
                    resolve(user);
                }
            });
        } catch (error) {
            reject({statusCode: 404, message: 'User not found'});
        }
    });
};


exports.findUserWithEmail = findUserWithEmail;
exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
