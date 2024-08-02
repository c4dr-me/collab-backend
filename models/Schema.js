const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    telephone: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); 
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    company: {
        type: String,
        required: false, 
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    photo: {
        type: String,
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post' 
    }],
    token: {
        type: String,
        unique: true,
        required: true,
    },
    notifications: [{
        type: { type: String },
        message: { type: String },
        senderEmail: {type: String},
        read: { type: Boolean, default: false },
        date: { type: Date, default: Date.now }
      }]
});

const CollabUser = mongoose.model('CollabUser', userSchema);

module.exports = CollabUser;