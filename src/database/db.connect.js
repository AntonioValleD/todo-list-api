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

exports.database = database;