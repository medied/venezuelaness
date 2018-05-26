const connect = require('./connect.js');
const db = require('./db.js');


connect(() => {
    db.CreateUser({address: 'FAKE_ADDRESS', name: 'sebastian delgado'}, (err) => {
        console.log(`write completed ${err}`)
    });
});