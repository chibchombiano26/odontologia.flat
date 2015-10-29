angular.module("starter")
.controller("listadoCitasCtrl", function($scope, $state){

	$scope.misCitas = function(){
		$state.go("app.listadoCitas", {modo : "listando"});
	}

})