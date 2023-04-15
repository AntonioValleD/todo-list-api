let MongoClient = require("mongodb").MongoClient;

// Database credentials
let dbUserName = 'taskUser';
let dbPassword = 'Dwc4MrV7KCpzS6ds';
let dbName = 'taskManager';

if (process.env.NODE_ENV === 'test'){
    dbName = 'testDb';
}

let url = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.bqariom.mongodb.net/?retryWrites=true&w=majority`;

// Database connection
let client = new MongoClient(url);
let database = client.db(dbName);
let usersCollection = database.collection('users');
let tasksCollection = database.collection('tasks');
console.log('Database connected');

/*
let id = '910e5e10-d9fb-11ed-b88f-d3c7a9e47de5'
let tasks = tasksCollection.find({userId: id});
tasks.forEach((doc) => {
    console.log(doc);
})
*/

exports.usersCollection = usersCollection;
exports.tasksCollection = tasksCollection;