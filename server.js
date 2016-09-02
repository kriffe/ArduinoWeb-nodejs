var SerialPort = require("serialport");
var endOfLine = require('os').EOL;

var express = require('express');
var app = express();


//Web server definition
app.use("/",express.static('public'));


app.get("/data",function(req,res){
	var obj = {value:Math.random()};
	res.json(obj);
});

//Arduino communication

var port = new SerialPort("COM5", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});


port.on('data', function (data) { 
  console.log('Data: ' + data);
  
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


