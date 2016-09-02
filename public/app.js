var myApp = angular.module('myApp',[]);
 
myApp.controller('HelloWorldController', ['$scope','$http','$interval', function($scope,$http,$interval) {
	
	$scope.buttonName = "Send";
	
	$scope.buttonAction = sendSomeData;
	
	
	var loop = $interval(getSomeData,1000);
	
	
	function sendSomeData(){
		
	}
	
	function getSomeData(){
		$http({
		  method: 'GET',
		  url: '/data'
		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.arduinoOutput = response.data.value;
			// this callback will be called asynchronously
			// when the response is available
		  }, function errorCallback(response) {
			  console.warn(response);
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		  });
	}
}]);