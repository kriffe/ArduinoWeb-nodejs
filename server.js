var SerialPort = require("serialport");

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var config = require('./config.js');
var endOfLine = require('os').EOL;


//Map files to expose to client
app.use("/",express.static('public'));
app.use("/socket.io",express.static('node_modules/socket.io-client'));
app.use("/angular",express.static('node_modules/angular'));
app.use("/bootstrap",express.static('node_modules/bootstrap/dist'));
app.use("/angular-ui-bootstrap",express.static('node_modules/angular-ui-bootstrap/dist'));


var latestValue = 6;	//Single value storage (instead of buffer)

//Socket IO communication	
io.on('connection', function (socket) {	//New client socket created
	socket.emit('ready', { hello: 'world' });
	
});

function broadcastSensorValue(){
	io.sockets.emit('newData', {value:latestValue});
}

var interval = setInterval(function() { 
	  broadcastSensorValue();
	}, 1000);


//Arduino communication

console.log("Attempting to connect to " + config.comPort);
console.log("-------------------------------");
var port = new SerialPort(config.comPort, {
	baudRate: 9600,
	parser: SerialPort.parsers.readline('\r\n')
});

port.on('data', function (data) { 
  
	var d = data.split(":"); //Expect two parts on format NAME:VALUE
	if (d.length > 1){ 
		latestValue = d[1];
	}
	else{
			console.warn("Invalid data" + data);	
	}
	
});


port.on('open',function(){});

server.listen(80, function () {
  console.log('Example app listening on port 80!');
});


