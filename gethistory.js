const fs = require('fs');
const request = require('request');
const eventEmitter = require('events');

let STARTDATE = new Date('Jan 1 2020 00:00');
STARTDATE = STARTDATE.getTime() * 1000 * 100000;;
let ENDDATE = new Date('Feb 1 2020 00:00');
ENDDATE = ENDDATE.getTime() * 1000 * 100000;

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

function requestData(){
  request(options, function (error, response, body) { //send the GET request
    if (error) throw new Error(error);

    json = JSON.parse(body); //turn the json into a js object
    lastID = json.result.XXBTZUSD.last;
    console.log(lastID);
    json = json.result.XXBTZUSD //get rid of everything that isnt data
    //lastDate = json[json.length - 1][2];

    console.log("requested");

    //console.log(json[0][2]);
  /*  for (let i = 0; i < json.length; i++) {
      let date = new Date(json[i][2] * 1000); //get Date obj based off of json data
      json[i][2] = date.toISOString(); //convert unix date to iso date in json
      json[i].pop(); //get rid of the useless "" at the end of the array
      json[i].push(i);
    }*/
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

    //eventEmitter.emit('done');
  });
}
