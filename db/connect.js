const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/venezuelaness');

const mongo = mongoose.connection;
mongo.on('error', console.error.bind(console, 'connection error:'));



module.exports = function(callback) {
    mongo.once('open', callback);
}