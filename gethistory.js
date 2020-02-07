const moment = require("moment");
const bodyParser = require("body-parser");
const http = require('http');
const fs = require('fs');
const request = require('request');

const FILENAME = 'JAN20.json'; //name of the end file
let data; //long data stream
let json; //individual data from the server

var options = { //set up the parameters of the GET request
  method: 'GET',
  url: 'https://api.kraken.com/0/public/Trades',
  qs: {
    pair: 'xbtusd',
    since: '0' },
  headers: {
     Host: 'api.kraken.com',
     Accept: '*/*',
   }
};

request(options, function (error, response, body) { //send the GET request
  if (error) throw new Error(error);

  json = JSON.parse(body); //turn the json into a js object
  json = json.result.XXBTZUSD //get rid of everything that isnt data
  data.concat(json); //add most recent json data to the ongoing data
  console.log(json[0][3]);
});




data = JSON.stringify(data);
//write to file
fs.exists(FILENAME, function(exists) {
  if (exists) {
    fs.writeFileSync(FILENAME, data);
  }
});
