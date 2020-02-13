function makePlot(data) {
  var layout = {
    dragmode: 'zoom',
    margin: {
      r: 10,
      t: 25,
      b: 40,
      l: 60
    },
    showlegend: false,
    xaxis: {
      autorange: true,
      rangeslider: {range: ['2017-01-17 12:00', '2017-02-10 12:00']},
      title: 'Date',
      type: 'date'
    },
    yaxis: {
      autorange: true,
      type: 'linear'
    },

    annotations: [
      {
        x: '2017-01-31',
        y: 0.9,
        xref: 'x',
        yref: 'paper',
        text: 'largest movement',
        font: {color: 'magenta'},
        showarrow: true,
        xanchor: 'right',
        ax: -20,
        ay: 0
      }
    ],

    shapes: [
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: '2017-01-31',
            y0: 0,
            x1: '2017-02-01',
            y1: 1,
            fillcolor: '#d3d3d3',
            opacity: 0.2,
            line: {
                width: 0
            }
        }
      ]
  };

  Plotly.newPlot('myDiv', data, layout);
}

$(document).ready(() => {

  let trace1 =  {
    x: [],
    close: [],
    decreasing: {line: {color: '#7F7F7F'}},
    high: [],
    increasing: {line: {color: '#17BECF'}},
    line: {color: 'rgba(31,119,180,1)'},
    low: [],
    open: [],
    type: 'candlestick',
    xaxis: 'x',
    yaxis: 'y'
  };

	$.getJSON('/json', (data) => {
    data = data.data;
    for(let i = 0; i < data.length; i++){
      trace1.x.push(data[i].time);
      trace1.close.push(data[i].close);
      trace1.high.push(data[i].high);
      trace1.low.push(data[i].low);
      trace1.open.push(data[i].open);
    }
    var data = [trace1];

    makePlot(data);

  });
});
