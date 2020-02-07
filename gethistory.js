const fs = require('fs');
const request = require('request');
const eventEmitter = require('events');

let STARTDATE = new Date('Jan 1 2020 00:00');
STARTDATE = STARTDATE.getTime() * 1000 * 100000;;
let ENDDATE = new Date('Feb 1 2020 00:00');
ENDDATE = ENDDATE.getTime() * 1000 * 100000;

let data = [];

options = { //set up the parameters of the GET request
  method: 'GET',
  url: 'https://api.kraken.com/0/public/OHLC',
  qs: {
    pair: 'xbtusd',
    since: STARTDATE },
  headers: {
     Host: 'api.kraken.com',
     Accept: '*/*',
  }
};

function requestData(number){
  if(number < 2){
    request(options, function (error, response, body) { //send the GET request
      if (error) throw new Error(error);

      json = JSON.parse(body); //turn the json into a js object
      options.qs.since = json.result.last;
      json = json.result.XXBTZUSD //get rid of everything that isnt data

      console.log("requested");

      json = {data: json};
      json = JSON.stringify(json);

      fs.writeFile('json/d' + options.qs.since + '.json', json, (err) => {
        if(err){
          console.error("theres an error");
        }
      });

      let timeout = setTimeout(() => {
        requestData(number++);
      },6000);
    });
  }
}

requestData(0);
