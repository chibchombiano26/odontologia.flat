/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("citasCtrl", function($scope, $state, agendaService, pubNubService, $ionicLoading, $stateParams, citasService, utilService, $rootScope, PubNub, $timeout){
    
    var mesActual = moment().get("month");
    var diaActual = moment().get("date");
    var meses = moment.months();
    var intervalo = {};

    $scope.months = meses.splice(mesActual);
    $scope.days = [];
    $scope.data = [];
    $scope.disponibilidad = [];
    $scope.paciente = {};
    $scope.invalido = true;
    
    $scope.prestadorData = utilService['medicoSeleccionado'];    
    var currentUsername = Parse.User.current().get("email");
    var prestador = $stateParams.id;

    if(hefesoft.isEmpty($scope.prestadorData)){
        $state.go("app.odontologos");
    }
    
    misCitas();
    cargarIntervalos();    
    pubNubService.initialise(currentUsername);
    subscribeMessage(currentUsername);

    function subscribeMessage(channelName){        
        $rootScope.$on(PubNub.ngMsgEv(channelName), function(event, payload) {
            if(payload.message.modo === "recargarCitas"){            
                misCitas();
            }
        })
    }

    function cargarIntervalos(){        
        citasService.getCitasInvervalo(prestador).then(function(data){
            if(data.length >0){            
                var result = data[0].toJSON();
                intervalo = { horaInicio : parseInt(result.horaInicio), intervaloCitas : parseInt(result.intervaloCitas), numeroHorasTrabajo : parseInt(result.numeroHorasTrabajo)};
            }
        })
    }
    
    function misCitas(){        
        citasService.obtenerCitasSolicitante().then(function(result){
            $scope.data = [];            
            for (var i = 0; i < result.length; i++) {
                $scope.data.push(result[i].toJSON());
            }
        });
    }
    
    $scope.monthChange = function(item){
        $scope.invalido = true;

        var monthSelected = moment().month(item).get('month');
        var yearSelected = moment().month(item).get('year');        

        var daysMonth = getDaysInMonth(monthSelected, yearSelected);

        if(mesActual == monthSelected){
            $scope.days = daysMonth.splice(diaActual -1); 
        }
        else{
           $scope.days = daysMonth;    
        }
    }
    
    $scope.dayChange = function(day, month){
        var fecha = moment({year : moment().get('year'), month: moment().month(month).get('month'), day: day });
        
        if(fecha.isValid()){
            /*Aveces cuando el calendario del medico no es publico se queda cargando es para evitar que se quede asi*/
            consultarDisponibilidad(fecha);
            $timeout(function(){                
                $ionicLoading.hide();
            },30000);
        }  
    }
    
    $scope.disponibilidadChange = function(item){
        
    }
    
    function consultarDisponibilidad(fecha){        
        $ionicLoading.show();
        agendaService.getDisponibilidad(fecha, intervalo.horaInicio, intervalo.numeroHorasTrabajo, intervalo.intervaloCitas, prestador).then(function(result){

        /*Activa el boton de solicitar*/
        $scope.invalido = false;

        var disponibilidad = [];
        for (var i = 0; i < result.length; i++) {
            disponibilidad.push(result[i]);
            result[i]['label'] = result[i].start.format("HH:mm") + " a " + result[i].end.format("HH:mm");
        }
        
        var fechaActual = moment(new Date()); 
        var result = _.filter(disponibilidad, function(i){
          var inicio = moment(i.start);
          return moment(inicio).isAfter(fechaActual);
        });

        $scope.disponibilidad = result;
        $ionicLoading.hide();
      }, 
      function(error){
        alert(error);
        $ionicLoading.hide();
      })
    }
    
    function getDaysInMonth(month, year) {
     var date = new Date(year, month, 1);
     var days = [];
         while (date.getMonth() === month) {
            days.push(moment(date).get("date"));
            date.setDate(date.getDate() + 1);
         }
     return days;
    }
    
      $scope.solicitar = function(item){
        item["id"] = Parse.User.current().id;
        item["email"] = Parse.User.current().get("email");
        item["name"] = Parse.User.current().get("name");
        item["pictureUrl"] = Parse.User.current().get("pictureUrl");
        item["message"] = item.name + " ha solicitado una cita para el "  + item.start.format("LLLL");

        if($scope.paciente.hasOwnProperty("numeroContacto")){
            item["numeroContacto"] = $scope.paciente.numeroContacto.toString();
        }
        else{
           item["numeroContacto"] = "No suministrado";   
        }

        pubNubService.sendMessage(prestador, angular.toJson(item));
        saveCita(item, prestador);
    }
    
    function saveCita(item, prestador){
        $ionicLoading.show();
        var Cita = Parse.Object.extend("Citas");
        var cita = new Cita;
        var prestadorSeleccionado = utilService.medicoSeleccionado;
        
        cita.set("idUsuario", item.id);
        cita.set("email", item.email);
        cita.set("name", item.name);
        cita.set("pictureUrl", item.pictureUrl);
        cita.set("message", item.message);
        cita.set("medico", prestador);
        cita.set("start", item.start.format("YYYY-MM-DD HH:mm"));
        cita.set("end", item.end.format("YYYY-MM-DD HH:mm"));
        cita.set("estado", "solicitada");

        if($scope.paciente.hasOwnProperty("numeroContacto")){
            cita.set("numeroContacto", $scope.paciente.numeroContacto.toString());
        }
        else{
           cita.set("numeroContacto", "No suministrado");
        }
        
        //Prestador
        cita.set("prestadorPictureUrl", prestadorSeleccionado.pictureUrl);
        cita.set("prestadorName", prestadorSeleccionado.name);
        cita.set("prestadorEmail", prestadorSeleccionado.email);
        
        cita.save().then(function(entidad){
            $ionicLoading.hide();
            $state.go("app.success")
        })
    }
    
})