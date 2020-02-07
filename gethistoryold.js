//const moment = require("moment");
//const bodyParser = require("body-parser");
const fs = require('fs');
const request = require('request');
const events = require('events');
let eventEmitter = new events.EventEmitter();
const FILENAME = 'JAN20.json'; //name of the end file

////////////
let data = [];
let json = [];

let STARTDATE = new Date('Jan 1 2020 00:00');
STARTDATE = STARTDATE.toISOString();
let ENDDATE = new Date('Feb 1 2020 00:00');
ENDDATE = ENDDATE.getTime() * 1000;
//ENDDATE = 1383582000;
console.log(ENDDATE);
let lastDate = 0;
let lastID = 0;

options = { //set up the parameters of the GET request
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

function requestData(){
  request(options, function (error, response, body) { //send the GET request
    if (error) throw new Error(error);

    json = JSON.parse(body); //turn the json into a js object
    lastID = json.result.XXBTZUSD.last;
    json = json.result.XXBTZUSD //get rid of everything that isnt data
    lastDate = json[json.length - 1][2];

    console.log("requested");

    //console.log(json[0][2]);
    for (let i = 0; i < json.length; i++) {
      let date = new Date(json[i][2] * 1000); //get Date obj based off of json data
      json[i][2] = date.toISOString(); //convert unix date to iso date in json
      json[i].pop(); //get rid of the useless "" at the end of the array
      json[i].push(i);
    }
    if(data.length == 0){
      data = json;
    }
    else{
        data.concat(json); //add most recent json data to the ongoing data
        console.log(data);
    }

    fs.writeFile('d' + lastID + '.json', json, (err) => {
      if(err){
        console.error("theres an error");
      }
    });

    eventEmitter.emit('done');
  });
}

function checkForMonthEndDate(){
  let whileInterval = setInterval(() => {
    console.log("every 3");
    console.log(lastDate);
    if(lastDate > ENDDATE) {
      clearInterval(whileInterval);
      eventEmitter.emit('stop');
      console.log("stop");
    }
  }, 3000);

}

function write(data){
  console.log("writing");
  this.data = JSON.stringify(data);
  //write to file
  fs.exists(FILENAME, function(exists) {
    //console.log(this.data);
    if (exists) {
      fs.writeFileSync(FILENAME, this.data);
    }
  });
}

eventEmitter.on('write', () => {
  data = {data: data};
  //console.log(JSON.stringify(json));
  write(json);
});

eventEmitter.on('done', () => {
  options.qs.since = '\'' + lastID + '\'';
})
//getData();

let interval = setInterval(() => {
  console.log("every 6");
  requestData();
}, 6000);

eventEmitter.on('stop', () => {
  clearInterval(interval);
  eventEmitter.emit('write');
});

checkForMonthEndDate();

let timeout = setTimeout(()=>{
  eventEmitter.emit('stop');
}, 26000);
