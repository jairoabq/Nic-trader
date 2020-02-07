const EventEmitter = require('events');
const fs = require('fs');

class WriteData extends EventEmitter {
  execute() {
    console.log('write');
    this.emit('finish');
  }
}

const writeData = new WriteData();



writeData.on('finish', () => {
  console.log("hello");
});

writeData.execute();

let STARTDATE = new Date('Jan 1 2018 00:00');
STARTDATE = STARTDATE.getTime();
let ENDDATE = new Date('Feb 6 2020 22:00');
ENDDATE = ENDDATE.getTime();

let interval = setInterval(() => console.log(STARTDATE, ENDDATE), 1000);
setTimeout(() => clearInterval(interval), 13000);

let content = 'pussy';

fs.writeFile('newFile.txt', content, (err) => {
  if(err){
    console.error("Theres an error");
  }
});
