const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    uportName: {
        type: String,
        required: true
    },
    uportAddress: { // Primary key
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    verificationPhotoPath: String,
    cneHTMLStr: String,
    cneHTMLHash: String,
    cneHTMLParsedJSON: Object,
})

const User = mongoose.model('User', userSchema)

module.exports = { User: User }