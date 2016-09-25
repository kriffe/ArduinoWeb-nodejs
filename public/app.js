var app = angular.module('arduinoWeb',[]);
 
app.controller('ArduinoConnectionController', ['$scope','$http','$interval', function($scope,$http,$interval) {
	
	$scope.buttonName = "Send";
	
	//Connect to server  for new data
	var socket = io.connect('http://localhost');
	
	$scope.buttonAction = function(){};
	
	 
	$scope.dataBars = [];	

	//Listen for new data updates
	socket.on('newData', function (response) {
				
		for (var i=0;i<response.data.length;i++){
			var data = response.data[i];
			
			var sensorId = data.id;
			var sensorValue = data.value;
			
			if (i >= $scope.dataBars.length){	//Add new bar
				$scope.dataBars.push(new Bar(sensorId,sensorValue));
				
			}	
			else{	//Update existing bar
				$scope.dataBars[i].id = sensorId;
				$scope.dataBars[i].value = sensorValue;
				$scope.dataBars[i].style.width = sensorValue + "%";
			}
		}
		
		$scope.$apply();
		
		//Debug
		console.log(response.data);
	});
	
	
	//Data bar object
	function Bar(id,value){
		this.id = id;
		this.value = value;
		this.style = {
    		'width':'50%'
		}
	}
	
}]);