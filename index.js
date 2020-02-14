/* Node Modules */
const fs = require('fs'); //require filereader
const request = require('request'); //npm i request an http requester
const eventEmitter = require('events');
const OHLC = require('./OHLC/OHLC');

/* set time */
let STARTDATE = new Date('Feb 11 2020 21:00');//set the start date in UTC
STARTDATE = STARTDATE.getTime();//turn this date into the unix representation
let STARTDATEORIGINAL = STARTDATE;

let fileOutputDate = STARTDATE;

MINDATE = STARTDATE + 60000;
MINDATE /= 1000;

let ENDDATE = new Date('Feb 13 2020 10:00'); //set the end date
ENDDATE = ENDDATE.getTime(); //turn this date into the unix representation

let data = []; //where all the final data will go

options = { //set up the parameters of the GET request
  method: 'GET',
  url: 'https://api.kraken.com/0/public/Trades',
  qs: {
    pair: 'xbtusd', //Currency pair BTC USD
    since: (STARTDATE * 1000000)},
  headers: {
     Host: 'api.kraken.com', //URL
     Accept: '*/*', //accept any form of response
  }
};

let leftoverTradeData = [];

function writeDataToFile(filename, writeData){ //generic data writer async
  return new Promise((resolve, reject) => { //a long proccess so don't block other proccesses
    try {
      let from = writeData[0].time;
      let to = writeData[writeData.length - 1].time;

      writeData = { //store the
        from: from,
        to: to, //make json obj
        data: writeData
      };
      //console.log(writeData);
      writeData = JSON.stringify(writeData); //turn data passed in writeData into json string object

      filename = __dirname + '/json/' + filename + '.json'; //make the filename
      console.log(filename);
      let writeStream = fs.createWriteStream(filename); //open a write stream, much more efficient for large files

      writeStream.write(writeData); //write the data

      writeStream.close(); //close writeStream
      resolve(filename); //tell Node that everything worked out.
    }
    catch (error) {
      reject(error);//tell the promise something bad has happened
    }
  });
}

let filesCreated = 0; //store how many files have been made.

let ohlcData = []; //what the OHLC data will eventually be stored in
let splitIntoMins = []; //make a larger array of mins where each min is seperated from other mins

/* Parse Data */
function parseData(requestedData) { //parse the data coming from web
  return new Promise((resolve, reject) => {

    let singleMin = []; //init a single min of trade data
    let json = requestedData; //make json the same as requested data
    let filetime = MINDATE - 60;

    leftoverTradeData = []; //get rid of the last min of leftover data

    for (let i = 0; i < json.length; i++) {
      let date = json[i][2];

      json[i].pop(); //get rid of the last meaningless bit to save memory

      if(date < MINDATE && options.qs.since / 1000000000 > MINDATE){ //if the data is within the min and makes up a full min (i.e. not at the end of the json file where a min could be split up between two different API calls)
        singleMin.push(json[i]);
      }
      else if(options.qs.since / 1000000000 < MINDATE) { //if the end of the json data finishes before the end of the min.
        leftoverTradeData.push(json[i]);
      }
      else { //if the next min is within the last min of the file and has moved onto a new min;
        MINDATE += 60; //the min is full and now we iterate to next min
        splitIntoMins.push(singleMin); //add to the larger array of mins
        singleMin = []; //make the next min array empty
        singleMin.push(json[i]); //start the next min array
      }
    }
    console.log("Minutes of OHLC data proccessed: " + splitIntoMins.length);

    if(splitIntoMins.length > 730){ //make sure theres a lil more than we need
      let minSet = splitIntoMins.slice(0,720); //get the first 720 elements of the array
      splitIntoMins = splitIntoMins.slice(720, splitIntoMins.length); //delete the first 720 elements from the array

      for(let i = 0; i < minSet.length; i++) {
        singleMin = minSet[i];//now that the mins are seperated, we can reverse it

        //TODO add the volume for more descriptive stats
        let open; //reference error if not initiated outside the if statements
        let close;
        let high;
        let low;
        let time = new Date(fileOutputDate);
        //console.log(i + " ", singleMin);
        if(singleMin.length > 0) { //if there were trades that min
          open = singleMin[0][0]; //set open
          close = singleMin[singleMin.length - 1][0]; //set close

          high = open;
          low = open;

          for(let j = 0; j < singleMin.length; j++){ //iterate thru min till max is found

            if(singleMin[j][0] > high){
              high = singleMin[j][0];
            }

            if(singleMin[j][0] < low){ //iterate thru min till minimum is found
              low = singleMin[j][0];
            }
          }
        }
        else { //if there were not any trades during that min
          open = ohlcData[i-1][3]; //make all the vars the same as the last datapoint's close
          high = open;
          close = open;
          low = open;
        }

        let ohlc = new OHLC(time.toISOString(), open, high, low, close); //make a new obj from class
        ohlcData.push(ohlc.toObj()); //push the object
        fileOutputDate += 60000; //add a min worth of milliseconds to the output date
      }

      filename = STARTDATE + 'F' + (filesCreated);

      writeDataToFile(filename, ohlcData).then(r => { //call the write file function async
          console.log("Wrote " + r + " to the filesystem");
          filesCreated += 1;
          ohlcData = [];
          console.log(ohlcData);
          resolve("Parsed");
        }).catch(err => console.error(err));
    }
  });
}

/* Request Data */
function requestData(number) { //request data
  console.log('since: ', options.qs.since / 1000000); //since does not corrispond to a date
  console.log("Enddate: ", ENDDATE);
  if(options.qs.since / 1000000 < ENDDATE && number < 120) {

    request(options, function (error, response, body) { //send the GET request
      //if (error) throw new Error(error);

      json = JSON.parse(body); //turn the json into a js object
      options.qs.since = json.result.last;
      json = json.result.XXBTZUSD //get rid of everything that isnt data

      console.log("GET <- since: " + options.qs.since); //output to the console
      console.log("API CALLS: " + (number + 1));

      json = leftoverTradeData.concat(json); //get the last little bit of data

      let timeout = setTimeout(() => { //make a new call to the server for more data every 6000 milliseconds or 6 sec
        number += 1; //keep track of how many times we've iterated thru the function
        requestData(number); //call the func we in rn
      }, 6000); //not guarenteed every 6 seconds, but min amount rather spent between api calls

      parseData(json).then(r => {  //call the parse data async
          console.log("Data " + r); //prints if works if written to a file;
        }).catch(err => console.error(err));
    });
  }
}
requestData(0); //start the call stack
