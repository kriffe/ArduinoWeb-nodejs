var app = angular.module('arduinoWeb',[]);
 
app.controller('ArduinoConnectionController', ['$scope','$http','$interval', function($scope,$http,$interval) {
	
	$scope.buttonName = "Send";
	
	//Connect to server  for new data
	var socket = io.connect('http://localhost');
	
	$scope.buttonAction = function(){
		socket.emit('buttonAction', { action: 'action1' });
	};
	
	 
	$scope.dataBars = [];	

	//Listen for new data updates
	socket.on('newData', function (response) {
				
		for (var i=0;i<response.data.length;i++){
			var data = response.data[i];
			
			var sensorValue = 100*data.value/1024;	//Assume 1024 as max
			
			if (i >= $scope.dataBars.length){	//Add new bar
				$scope.dataBars.push(new Bar(data.id,data.label,sensorValue));
				
			}	
			else{	//Update existing bar
				$scope.dataBars[i].id = data.id;
				$scope.dataBars[i].value = Math.round(100*sensorValue)/100;
				$scope.dataBars[i].label = data.label;
			}
		}
		
		$scope.$apply();
		
		//Debug
		//console.log(response.data);
	});
	
	
	//Resize function for div bars
	$scope.generateBarStyle = function(value){
		//Color bars
		var color = "#ff0000";
		if (value >= 50){
			color = "#00ff00";
		}
		
		return {
			background: color,
			width: value + "%"
		}
	}
	
	
	
	
	
	//Data bar object
	function Bar(id,label,value){
		this.id = id;
		this.label = label;
		this.value = Math.round(100*value)/100;	//Round to some decimals
	}
	
}]);