const mongoose = require('mongoose');
// const crypto = require('crypto');
// const User = require('../models/Schema');
const dotenv = require('dotenv');
dotenv.config();

// const generateUniqueToken = () => {
//     return crypto.randomBytes(16).toString('hex');
// };

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected`);
       // await updateUsersWithToken(); 
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// const updateUsersWithToken = async () => {
//     try {
//         const users = await User.find();
//         for (let user of users) {
//             if (!user.token) {
//                 user.token = generateUniqueToken();
//                 await user.save();
//                 console.log(`Updated user ${user.email} with token`);
//             }
//         }
//         console.log('All users updated');
//     } catch (error) {
//         console.error('Error updating users:', error);
//     } finally {
//         mongoose.disconnect();
//     }
// };

module.exports = ConnectDB;
