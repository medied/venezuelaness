var express = require('express');
var morgan = require('morgan');
var app = express();
var path = require('path');
var cors = require('cors');
const connect = require('./db/connect.js');
const db = require('./db/db.js');

let slideIndex = 1;

let state = {
  currentUPortURI: '',
  currentUserUPortAddress: ''
};

function uploadCedulaImg(img) {
  console.log("uploadCedulaImg() invoked");
  data.cedulaImg = img;
  console.log(data);
}

function uploadStringImg(img) {
  console.log("uploadStringImg() invoked");
  data.stringImg = img;
  console.log(data);
}


// uPort Setup
const uriCallback = (uri) => {
  state.currentUportURI = uri;
}
const uport = require('./uport/uport.js').New(uriCallback)

// Express Setup
const PORT = 80;
// allow redirects
app.use(cors({origin: `http://localhost:${PORT}`}));

// logging
app.use(morgan('combined'));
// serve public dir
app.use(express.static('public'))

// Mongo Setup + Server startup
connect(() => {
  app.listen(PORT);
});


// Send a new uport-app-link
app.get('/uport-app-link', function(req, res){
  // Send the response with state.currentUportURI
  setTimeout(() => {
    res.send(state.currentUportURI)
  }, 1000)
  // Refresh the state.currentUportURI
  // (this is very hacky)
  uport.RequestCredentials((credentials) => {
    console.log('RECEIVED CREDENTIALS: ', JSON.stringify(credentials, null, 2));
    db.CreateUser(credentials, (err) => {
      uport.AttestCredentials(credentials.address)
      console.log(`write completed ${err}`)
    });
    
  });
});