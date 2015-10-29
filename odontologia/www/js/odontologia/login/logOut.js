angular.module("starter")
.controller("logOutCtrl", function($scope, $state){
	
	Parse.User.logOut().then(function(result){
		$state.go("index.login");
	})

	$scope.login = function(){
		$state.go("index.login");	
	}
})