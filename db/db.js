const models = require('./models.js');

// @arg uportCredentials is the object returned by uport.RequestCredentials
// @arg callback(err) returns after writing to the db
function CreateUser(uportCredentials, bip39, callback) {
    const name = uportCredentials.name;
    const address = uportCredentials.address;
    if (!name || !address) {
        callback(new Error(`Could not create new User. uPort credentials missing name or address: ${uportCredentials}`));
        return;
    }
    const user = new models.User({
        uportName: name,
        uportAddress: address,
        bip39Phrase: bip39,
        verified: false
    });
    user.save(callback);
}

// @arg path the path of the photo you are saving
// @arg callback(err) returns after writing to the db
function AddVerificationPhotoPath(uPortAddress, path, callback) {
    models.User.findOne({uportAddress: uPortAddress}, (err, user) => {
        if (err) {
            callback(err);
            return;
        } else if (!user) {
            callback(new Error(`No user found for this address (${uPortAddress})`));
            return;
        }
        user.verificationPhotoPath = path;
        user.save(callback);
    });
}

// @arg path the path of the photo you are saving
// @arg cneData is json with the following fields: cneHTMLStr, cneHTMLHash, cneHTMLParsedJSON
// @arg callback(err) returns after writing to the db
function AddCNEData(uPortAddress, cneData, callback) {
    models.User.findOne({uportAddress: uPortAddress}, (err, user) => {
        if (err) {
            callback(err);
            return;
        } else if (!user) {
            callback(new Error(`No user found for this address (${uPortAddress})`));
            return;
        }
        user.cneHTMLStr = cneData.cneHTMLStr;
        user.cneHTMLHash = cneData.cneHTMLHash;
        user.cneHTMLParsedJSON = cneData.cneHTMLParsedJSON;
        user.save(callback);
        callback(null, user);
    })
}

module.exports = {
    CreateUser: CreateUser,
    AddVerificationPhotoPath: AddVerificationPhotoPath,
    AddCNEData: AddCNEData
};