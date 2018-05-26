var express = require('express');
var app = express();
var path = require('path');

let slideIndex = 1;

let data = {}; // placeholder

function connectWithUport() {
  console.log("connectWithUport() invoked");
}

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

app.use(express.static('public'))
app.listen(8080);
