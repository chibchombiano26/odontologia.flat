/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("homeCtrl", function($scope, $state){
    
    $scope.solicitarCita = function(){
        $state.go("app.odontologos");
    }
    
    $scope.listadoCitas = function(){
        $state.go("app.listadoCitas", {modo: 'miscitas'});
    }
    
})