/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("odontologoCtrl", function($scope, $state, $stateParams, $q, $ionicLoading, utilService){
    
    inicializar();
    $scope.Odontologos = [];
    
    function inicializar(){
        $ionicLoading.show();
        cargarOdontologos().then(function(result){
            for (var i = 0; i < result.length; i++) {
                $scope.Odontologos.push(result[i].toJSON());
            }
            $ionicLoading.hide();
        })
    }
    
    function cargarOdontologos(){
        var deferred = $q.defer();
        var odontolgos = Parse.User;
        var query = new Parse.Query(odontolgos);
        query.equalTo("esMedico", true);
        query.find().then(function(resultado){
            deferred.resolve(resultado);
        })
        
        return deferred.promise;
    }
    
    $scope.solicitarCita= function(item){
        utilService['medicoSeleccionado'] = item;
        $state.go("app.citas", {id : item.email})
    }
    
})