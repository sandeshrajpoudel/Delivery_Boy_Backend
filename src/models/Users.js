const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



const UserSchema = new mongoose.Schema({


    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: String,
        required: true,
        default: "USER",
        enum: ["USER", "ADMIN"]
    }

});


const Users = mongoose.model('Users', UserSchema);

module.exports = Users;