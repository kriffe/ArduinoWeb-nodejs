var five = require("johnny-five");
var board = new five.Board();


var SENSOR_LIST = [
		{pin: 1, label:"Sensor 1"},
		{pin: 2, label:"Sensor 2"},
]




var UPDATE_INTERVAL = 500;

//Storage of lates values
var latestValueBuffer = Array(SENSOR_LIST.length);
//Create empty data structs
for (var i=0;i<SENSOR_LIST.length;i++){
	latestValueBuffer[i] = new SensorDataStruct(SENSOR_LIST[i].pin,SENSOR_LIST[i].label,0);  	//Populate data structs
}



//Arduino with StandardFirmataPlus running (Johnny-five) ---------------------------------------------------------


// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function(){
	var scope = this;
	
	
	//Register read function for every analog pin
	for (var i=0;i<SENSOR_LIST.length;i++){
		registerAnalogRead(i,SENSOR_LIST[i].pin,SENSOR_LIST[i].label);
	}
	
	
	//Debug loop
	scope.loop(1000, function(){
		console.log("Sensor values");
		console.log(latestValueBuffer);
	});
	
	
	//Function for registering analog read
	function registerAnalogRead(index,pin,label){
		scope.pinMode(pin, five.Pin.ANALOG);
		scope.analogRead(pin, function(voltage) {
			latestValueBuffer[index] = new SensorDataStruct(pin,label,voltage);  
		});
	}

});


//Sensor data simple structure
function SensorDataStruct(sensorId,label,value){
	this.id = sensorId;
	this.label = label;
	this.value = value;
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
	
	//Listen for button action
	socket.on('buttonAction',function(data){
		console.log(data);
	});
	
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


