const validator = require('validator');
const mongoose  = require('mongoose');
require('mongoose-type-url');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Invalid email'],
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
});

module.exports.usersModel = mongoose.model('user', userSchema);