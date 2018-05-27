var express = require('express');
var morgan = require('morgan');
var app = express();
var path = require('path');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const connect = require('./db/connect.js');
const db = require('./db/db.js');

let state = {
  currentUPortURI: '',
  currentUserUPortAddress: ''
};

// uPort Setup
const uriCallback = (uri) => {
  state.currentUportURI = uri;
}
const uport = require('./uport/uport.js').New(uriCallback)

// Express Setup
const PORT = 8080;
// allow redirects
app.use(cors({origin: `http://localhost:${PORT}`}));

// logging
app.use(morgan('combined'));
// serve public dir
app.use(express.static('public'))
app.use(fileUpload());

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

app.post('/upload', function(req, res) {
  console.log('POST - upload');
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + '/public/images/' + fileName + '.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});