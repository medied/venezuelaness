const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    uportName: {
        type: String,
        required: true
    },
    uportAddress: { 
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User: User }