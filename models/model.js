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

const sendGrid = new Schema ({
    request: {
    type: String,
    required: true
    },
    request_time: {
        type: Date,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    response_time: {
        type: Date,
        required: true
    }
});

//create collection and add schema
const User = mongoose.model('user', userSchema);
const MailLog = mongoose.model('maillog', sendGrid);
module.exports = {User, MailLog};