var express = require('express');
var morgan = require('morgan');
const fileUpload = require('express-fileupload');
var app = express();
var path = require('path');
var cors = require('cors');
const connect = require('./db/connect.js');
const db = require('./db/db.js');
const getCNE = require('./get_cne.js');

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
    state.currentUserUPortAddress = credentials.address
    console.log(`SET currentUserUPortAddress to ${credentials.address}`)
    console.log('RECEIVED CREDENTIALS: ', JSON.stringify(credentials, null, 2));
    db.CreateUser(credentials, (err) => {
      console.log(`write completed ${err}`)
    });
    
  });
});

// app.post

// This is the request that marks the point where the user submitted all his data
app.post('/last-photo-upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  let cedulaImg = req.files.cedulaImg;
  cedulaImg.mv(__dirname + './public/images/' + cedulaImg.name + '.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('<html><h1 style>¡Listo! Estamos procesando tu cédula digital. Te enviaremos una notificación a uPort cuando hayamos verificado tu identidad</h1></html>');
    res.end();
  });
  // db request below
  db.AddVerificationPhotoPath(state.currentUserUPortAddress, 'SOME_PATH', (err) => {
    // TODO(ale): this is a good place to add the solidity CNE contract call
    getCNE.GetCNEDetails(24311800, (json, htmlStr) => {
      if (json.error) {
        console.log(json.error);
      }
      const cneData = {
        cneHTMLHash: '', // TODO(ale): can we hash the data here the same way its being hashed in the contract?
        cneHTMLStr: htmlStr,
        cneHTMLParsedJSON: json, 
      }
      db.AddCNEData(state.currentUserUPortAddress, cneData, (err, user) => {
        console.log(`AddCNEData with ${err} and ${user}`)
        if (!err && user) {
          // Verify that the persons uPort name matches the cneData name
          if (user.uportName === user.cneHTMLParsedJSON.nombre) {
            // the user is verified
            console.log(`VERIFICATION SUCCESSFUL FOR ${user.uportName}, TRIGGERING TPL AND ATTESTATION`)
            // TODO(medied): do a res.send here that triggers a simple success message on the frontend ('verificado, deberias recibir tu verification en uport pronto')
            // TODO(ale): trigger the TPL request from here.
            uport.AttestCredentials(credentials.address)
          } else {
            // TODO(medied): sop a res.send here that says that your info doesn't match the info on the cne data
            console.log(`WASNT ABLE TO MATCH ${user.uportName} with ${user.cneHTMLParsedJSON.nombre}`)
          }
        }
      });
    })
  })
});