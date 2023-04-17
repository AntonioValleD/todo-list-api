const mongoose =  require('mongoose');

// Database Models
const UserModel = mongoose.model('users', {
    userId: String,
    userName: String,
    email: String,
    password: String
});
const TaskModel = mongoose.model('tasks', {
    userId: String,
    tasks: Array
});


exports.UserModel = UserModel;
exports.TaskModel = TaskModel;