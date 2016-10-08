var five = require("johnny-five");
var board = new five.Board();



//Arduino sensors to send to Web Client
var ANALOG_READ_PINS = [
	1,2,3
]

var UPDATE_INTERVAL = 500;

//Storage of lates values
var latestValueBuffer = Array(ANALOG_READ_PINS.length);
//Create empty data structs
for (var i=0;i<ANALOG_READ_PINS.length;i++){
	var pin = ANALOG_READ_PINS[i];
	latestValueBuffer[i] = new SensorDataStruct(pin,0);  	//Populate data structs
}



//Arduino with StandardFirmataPlus running (Johnny-five) ---------------------------------------------------------


// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function(){
	var scope = this;
	
	
	//Register read function for every analog pin
	for (var i=0;i<ANALOG_READ_PINS.length;i++){
		var pin = ANALOG_READ_PINS[i];
		registerAnalogRead(i,ANALOG_READ_PINS[i]);
	}
	
	
	//Debug loop
	scope.loop(1000, function(){
		console.log("Sensor values");
		console.log(latestValueBuffer);
	});
	
	
	//Function for registering analog read
	function registerAnalogRead(index,pin){
		scope.pinMode(pin, five.Pin.ANALOG);
		scope.analogRead(pin, function(voltage) {
			latestValueBuffer[index] = new SensorDataStruct(pin,voltage);  
		});
	}

});


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


