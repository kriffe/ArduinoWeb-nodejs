var five = require("johnny-five");
var board = new five.Board();



//Arduino sensors to send to Web Client
var SENSOR_PINS = [
	1,2,3
]

var UPDATE_INTERVAL = 2000;

//Storage of lates values
var latestValueBuffer = Array(SENSOR_PINS.length);




//Arduino with StandardFirmataPlus running (Johnny-five) ---------------------------------------------------------

//Main loop for reading data
var arduinoLoop = function(){
	  for (var i=0;i<SENSOR_PINS.length;i++){
	    var pin = SENSOR_PINS[i];
		latestValueBuffer[i] = new SensorDataStruct(pin,Math.random(30)*100);  
	  }		
}

//Arduino init sequence
var arduinoInit = function(){
	
	//Start loop faster than the broadcast function
	this.loop(UPDATE_INTERVAL/2, arduinoLoop);
	
	var led = new five.Led(13);
	led.blink(500);
}

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", arduinoInit);


//Sensor data simple structure
function SensorDataStruct(sensorId,value){
	this.id = sensorId,
	this.value = value
}





//Web server setup -----------------------------------------------------------------------------------------------
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//Map files to expose to client
app.use("/",express.static('public'));
app.use("/socket.io",express.static('node_modules/socket.io-client'));
app.use("/angular",express.static('node_modules/angular'));
app.use("/bootstrap",express.static('node_modules/bootstrap/dist'));
app.use("/angular-ui-bootstrap",express.static('node_modules/angular-ui-bootstrap/dist'));




//Socket IO communication	
io.on('connection', function (socket) {	//New client socket created
	socket.emit('ready', { hello: 'world' });
	
});

function broadcastSensorValues(){
	io.sockets.emit('newData', {success: true, data:latestValueBuffer});
}

var interval = setInterval(function() { 
	  broadcastSensorValues();
	}, UPDATE_INTERVAL);

	
	



server.listen(80, function () {
  console.log('Example app listening on port 80!');
});


