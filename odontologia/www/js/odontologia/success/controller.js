/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("successCtrl", function($scope, $state){
    
    $scope.volver = function(){
        $state.go("app.home");
    }
    
})