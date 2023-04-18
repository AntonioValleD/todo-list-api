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