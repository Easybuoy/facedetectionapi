const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    entries: {
        type: Number,
        required: true
    },
    date_joined: {
        type: Date,
        required: true
    }
});


//create collection and add schema
const User = mongoose.model('user', userSchema);

module.exports = User;