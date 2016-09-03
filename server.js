	var SerialPort = require("serialport");
var endOfLine = require('os').EOL;

var express = require('express');
var app = express();

var config = require('./config.js');

//Web server definition
app.use("/",express.static('public'));


var latestValue = 0;

app.get("/data",function(req,res){
	var obj = {value:latestValue};
	res.json(obj);
});



//Arduino communication
console.log(config);
var port = new SerialPort(config.comPort, {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\r\n')
});


port.on('data', function (data) { 
  console.log('Data: ' + data);
	var d = data.split(":");
console.log(data);
	if (d.length > 1){ //Expect two parts on format NAME:VALUE
		latestValue = d[1];
	}
	else{
		
			console.warn("Invalid data" + data);	
		
	}
	/*port.write('ABC'+endOfLine, function(err) {
		if (err) {
		  return console.log('Error on write: ', err.message);
		}
		console.log('message written');
	 });*/
});


port.on('open',function(){
	
});


app.listen(80, function () {
  console.log('Example app listening on port 80!');
});


