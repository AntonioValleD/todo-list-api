const uuid = require('uuid');
const crypto = require('../crypto/crypto');

// Controllers
const taskController = require('../task/task.controller');

// Database
const usersDatabase = require('../database/db.connect').database.collection('users');

const findUserWithEmail = (email) => {
    console.log('Searching user ...');
    return new Promise(async (resolve, reject) => {
        let user = null;
        await usersDatabase.find({email: email}).forEach((doc) =>{
            user = doc;
        });
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
            // User already exists
            reject(false);
        } catch (error) {
            console.log('Building new user ...');
            let userId = uuid.v1();
            let newUser = {
                userId: userId,
                userName: userName,
                email: email,
                password: crypto.hashPassword(password)
            };
            await taskController.bootstrapTaskList(userId);
            await usersDatabase.insertOne(newUser);
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
