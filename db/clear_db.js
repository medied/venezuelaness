const models = require('./models.js');
const connect = require('./connect.js');

connect(() => {
    models.User.remove({}, (err) => {
        console.log('REMOVAL COMPLETED with err: ', err);
    })
})
