var myApp = angular.module('myApp',[]);
 
myApp.controller('HelloWorldController', ['$scope','$http','$interval', function($scope,$http,$interval) {
	
	$scope.buttonName = "Send";
	
	$scope.buttonAction = function(){};
	

 
  $scope.bars = [
    { id:"bar1",
      style :{
    		'height':'50%',
    		'width':'50px',
    		'background':'green'
    	}
    }
      
  ];	

	$scope.barStyle1 = {
		'height':'50%',
		'width':'50px',
		'background':'green'
	}

	//Connect to server
	var socket = io.connect('http://localhost');
	
	//Listen for new data updates
	socket.on('newData', function (data) {
		$scope.bars[0].style.height = 100*data.value/1024 + "%"; 	
	});
	
}]);