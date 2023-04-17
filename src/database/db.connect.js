/*
let MongoClient = require("mongodb").MongoClient;
require('dotenv').config();

//Database credentials
// let dbUserName = 'taskUser';
// let dbPassword = 'Dwc4MrV7KCpzS6ds';
let url = process.env.MONGODB_URL;

let dbName = 'taskManager';
if (process.env.NODE_ENV === 'test'){
    dbName = 'testDb';
}

// Database connection
let client = new MongoClient(url);
let database = client.db(dbName);
console.log('Database connected'); 



// let url = 'mongodb+srv://taskUser:Dwc4MrV7KCpzS6ds@cluster0.bqariom.mongodb.net/?retryWrites=true&w=majority'
// let id = '68b03160-da36-11ed-926b-0361a1a22855'
// let tasks = tasksCollection.find({userId: id});
// tasks.forEach((doc) => {
//     console.log(doc);
// })
*/
const mongoose = require('mongoose');
require('dotenv').config();

let url = process.env.MONGODB_URL;
if (process.env.NODE_ENV === 'test'){
    url = process.env.MONGODB_TEST_URL;
};

const dbConnect = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected...');
        /*
        const UserModel = mongoose.model('users', {
            userId: String,
            userName: String,
            email: String,
            password: String
        });
        
        let email = "sksksd@gmail.com";
        let user = await UserModel.findOne({email: email}).exec();
        console.log(user);
        */
    } catch (error) {
        console.log(error);
    }
};

module.exports = { dbConnect };