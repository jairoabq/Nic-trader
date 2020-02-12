modules.exports = class OHLC { //create a class for each min of data
  constructor(time, open, high, low, close){
    this.time = time;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
  }
  toArray(){
    return [time, open, high, low, close];
  }
}

module.export = OHLC;
