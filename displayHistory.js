const express = require('express');

let server = express();

server.get('/gui', (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

server.get('/app', (req, res) => {
  res.sendFile(__dirname + "/client/app.js");
});

server.get('/', (req,res) => {
  res.sendFile(__dirname + "/client/index.html");
});

server.get('/json', (req,res) => {
  res.sendFile(__dirname + "/1581483600000000000.json");
});

server.use('/', express.static(__dirname));

server.listen(80);
