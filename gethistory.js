const fs = require('fs'); //require filereader
const request = require('request'); //npm i request an http requester
const eventEmitter = require('events');

let STARTDATE = new Date('Jan 1 2020 00:00');//set the start date
STARTDATE = STARTDATE.getTime();//turn this date into the unix representation
STARTDATE = STARTDATE * 1000000; //add 6 trailing zeros to fulfil server requirements

MINDATE = STARTDATE + 6000 * 1000000

let ENDDATE = new Date('Feb 1 2020 00:00'); //set the end date
ENDDATE = ENDDATE.getTime(); //turn this date into the unix representation

let data = []; //where all the final data will go

options = { //set up the parameters of the GET request
  method: 'GET',
  url: 'https://api.kraken.com/0/public/Trades',
  qs: {
    pair: 'xbtusd',
    since: /*"\'" + */STARTDATE }, //+ "\'"},
  headers: {
     Host: 'api.kraken.com',
     Accept: '*/*',
  }
};

console.log(options.qs.since);

function requestData() {
  if(options.qs.since / 1000000 < ENDDATE) {
    //console.log(number);
    request(options, function (error, response, body) { //send the GET request
      if (error) throw new Error(error);

      json = JSON.parse(body); //turn the json into a js object
      options.qs.since = json.result.last;
      json = json.result.XXBTZUSD //get rid of everything that isnt data

      console.log("requested");

      for (let i = 0; i < json.length; i++) {
        let date = new Date(json[i][2] * 1000); //get Date obj based off of json data
        json[i][2] = date.toISOString(); //convert unix date to iso date in json
        json[i].pop(); //get rid of the useless "" at the end of the array
        //json[i].push(i);
      }


      if(data.length == 0){
        data = json;
        //console.log(data);
      }
      else{
        console.log(data.length);
        data = data.concat(json);
        console.log(data.length);
      }

      console.log(options.qs.since);

      let timeout = setTimeout(() => {
        requestData();
      },6000);
    });
  }
  else{
    data = {data: data};

    //console.log(data);

    data = JSON.stringify(data);

    //console.log(data);

    fs.writeFileSync('json/d' + options.qs.since + '.json', data, (err) => {
      if(err){
        console.error("theres an error");
      }
    });
  }
}

//requestData();
