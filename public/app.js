var myApp = angular.module('myApp',[]);
 
myApp.controller('HelloWorldController', ['$scope','$http','$interval', function($scope,$http,$interval) {
	
	$scope.buttonName = "Send";
	
	$scope.buttonAction = sendSomeData;
	
	$scope.buttonStyle = {
			'width':'500px'
	}
 
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


	
	
	var loop = $interval(getSomeData,1000);


	
	
	function sendSomeData(){
		
	}
	
	function getSomeData(){
		$http({
		  method: 'GET',
		  url: '/data'
		}).then(function successCallback(response) {
         var value = response.data.value;
			
			$scope.bars[0].style.height = 100*value/1024 + "%"; 						
			$scope.arduinoOutput = response.data.value;
			
      
		  }, function errorCallback(response) {
			  console.warn(response);
		  });
	}
}]);