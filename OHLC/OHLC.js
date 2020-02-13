module.exports = class OHLC { //create a class for each min of data
  constructor(time, open, high, low, close){
    this.time = time;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
  }
  toArray(){
    let array = [this.time, this.open, this.high, this.low, this.close];
    console.log(array);
    return array
  }
  toObj(){
    let obj = {
      time: this.time,
      open: this.open,
      high: this.high,
      low: this.low,
      close: this.close
    }
    return obj;
  }
}
