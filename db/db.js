const models = require('./models.js');

// @arg uportCredentials is the object returned by uport.RequestCredentials
// @arg callback(err) returns after writing to the db
function CreateUser(uportCredentials, callback) {
    const name = uportCredentials.name;
    const address = uportCredentials.address;
    if (!name || !address) {
        callback(new Error(`Could not create new User. uPort credentials missing name or address: ${uportCredentials}`));
        return;
    }
    const user = new models.User({
        uportName: name,
        uportAddress: address
    });
    user.save(callback);
}

module.exports = {
    CreateUser: CreateUser,
};