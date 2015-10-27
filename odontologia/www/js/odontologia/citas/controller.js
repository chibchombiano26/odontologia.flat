/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("citasCtrl", function($scope, $state, agendaService, pubNubService, $ionicLoading, $stateParams, citasService, utilService){
    
    var mesActual = moment().get("month");
    var diaActual = moment().get("date");
    var meses = moment.months();


    $scope.months = meses.splice(mesActual);
    $scope.days = [];
    $scope.data = [];
    $scope.disponibilidad = [];
    
    var currentUsername = Parse.User.current().get("email");
    var prestador = $stateParams.id;
    
    if(angular.isDefined($stateParams.modo)){
        misCitas();
    }
    
    pubNubService.initialise(currentUsername);
    
    function misCitas(){
        $scope.data = [];
        citasService.obtenerCitasSolicitante().then(function(result){
            for (var i = 0; i < result.length; i++) {
                $scope.data.push(result[i].toJSON());
            }
        });
    }
    
    $scope.monthChange = function(item){
        var monthSelected = moment().month(item).get('month');
        var yearSelected = moment().month(item).get('year');        

        var daysMonth = getDaysInMonth(monthSelected, yearSelected);
        $scope.days = daysMonth.splice(diaActual -1); 
    }
    
    $scope.dayChange = function(day, month){
        var fecha = moment({year : moment().get('year'), month: moment().month(month).get('month'), day: day });
        
        if(fecha.isValid()){
           consultarDisponibilidad(fecha);
        }  
    }
    
    $scope.disponibilidadChange = function(item){
        
    }
    
    function consultarDisponibilidad(fecha){
        $ionicLoading.show();
        agendaService.getDisponibilidad(fecha,9, 8, 15, "futbolito152@gmail.com").then(function(result){
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