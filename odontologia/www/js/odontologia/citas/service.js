/*global angular, Parse, _, moment*/
angular.module('starter')
.service('citasService', function($q){
    
    var datafactory = {};    
   
     datafactory.obtenerPrestadores = function(item){
        var deferred = $q.defer();
        var Pacientes = Parse.Object.extend("Prestador");
        var pacientes = new Parse.Query(Pacientes);
        
        pacientes.equalTo("username", item.email);
        pacientes.find()
        .then(function(data){
            deferred.resolve(data); 
        },
        function(data, error){
         deferred.reject(error);    
        });
        
        return deferred.promise;
    }

    datafactory.obtenerCitas = function(){
        var deferred = $q.defer()
        var Citas = Parse.Object.extend('Citas');
        var query = new Parse.Query(Citas);
        query.equalTo("medico", Parse.User.current().get('email'));
        query.find().then(function(result){
            deferred.resolve(result);
        })
        return deferred.promise;
    }
    
    datafactory.obtenerCitasSolicitante = function(){
        var deferred = $q.defer()
        var Citas = Parse.Object.extend('Citas');
        var query = new Parse.Query(Citas);
        query.equalTo("idUsuario", Parse.User.current().id);
        query.find().then(function(result){
            deferred.resolve(result);
        })
        return deferred.promise;        
    }

    datafactory.getCitasInvervalo = function(prestador){
        var deferred = $q.defer()
        var Citas = Parse.Object.extend('Citas_Intervalos');
        var query = new Parse.Query(Citas);
        query.equalTo("prestador", prestador);
        query.find().then(function(result){
            deferred.resolve(result);
        })
        return deferred.promise;
    }
    
    datafactory.actualizarCita = function (id ,aprobado){
        var Citas = Parse.Object.extend('Citas');
        var citas = new Citas;
        citas.set('id', id);
        citas.set('estado', aprobado);
        citas.save();
    }
    
    return datafactory;
    
})