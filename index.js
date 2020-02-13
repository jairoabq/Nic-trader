// const fs = require('fs');
//
// let writeStream = fs.createWriteStream('pepe.txt');
//
// writeStream.write("hello world");
//
// writeStream.close();
//
// let filename = 1234
// filename = filename + ".json";
// console.log(filename);

// let time = new Date(1577895485.868 * 1000);
// console.log(time.toISOString());
// let time2 = new Date(time.toISOString());
// console.log(time.getTime());


let STARTDATE = new Date('Feb 12 2020 0:00');//set the start date in UTC
//date is written in current timezone but the moment the class constructor runs, it converts to UTC time
console.log(STARTDATE.toISOString());
