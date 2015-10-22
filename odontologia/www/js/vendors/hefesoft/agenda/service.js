angular.module("starter")
.service("agendaService", function($q){
  
  var dataFactory = {};
  
  
  dataFactory.getAgenda = function(calendarId, date){
      var deferred = $q.defer();
      
      var url = "https://script.google.com/macros/s/AKfycbx9NEkdam4juM9-sg01VqSMtLghUsJ0ALpGHUfBoHhnOHBdDiM/exec?calendarId=" + calendarId + "&fecha=" + date +"&callback=?";
      
      $.getJSON(url, function( returnValue ){
          deferred.resolve(returnValue);
      });
      
      return deferred.promise;
  }
  
  dataFactory.generateIntervals = function(start, end, interval, intervalFormat){
      var range = moment(start).twix(end);
      var splits = range.split(interval, intervalFormat);
      return splits;
  }
  
  
  dataFactory.test = function(){
    dataFactory.getDisponibilidad(new Date(),9, 8, 15, "futbolito152@gmail.com").then(function(result){
      debugger  
    })    
  }
  
  /*
      Fecha en la que se valida disponibilidad
      hora de inicio de trabajo
      numero de horas que se trabajaran ese dia
      intervalos en cada cita
  */
  dataFactory.getDisponibilidad = function(fecha, horaInicio, horasLaborales, intervalos, calendarId){
    
      var deferred = $q.defer();
      var start = moment(fecha).set("hour", horaInicio).set("minute", 0).set("second", 0);  
      var end = start.clone().add(horasLaborales, "hours");
      var interval = intervalos;
      var intervalormat = "minutes";
      
      var intervals = dataFactory.generateIntervals(start, end, interval, intervalormat);
      
      dataFactory.getAgenda(calendarId, start.toString()).then(function(result){
          var horariosDisponibles = disponibilidad(intervals,result);
          deferred.resolve(horariosDisponibles);
      })
      
      return deferred.promise;
      
  }
  
  function disponibilidad(horariosDisponibles, horariosOcupados){
      
      var resultado = [];
      
      for (var i = 0; i < horariosDisponibles.length; i++) {
          
          //Por ejemplo de 8 a 8 y cuarto
          var tiempoValidar = horariosDisponibles[i];
          
          var disponible = validarOverlap(tiempoValidar, horariosOcupados);
          
          if(!disponible){
              resultado.push(tiempoValidar);
          }
      }
      
      return resultado;
  }
  
  function validarOverlap(tiempoValidar, horariosOcupados){
      
      for (var i = 0; i < horariosOcupados.length; i++) {
          var horarioOcupado = horariosOcupados[i];
          
          var range1 = moment(tiempoValidar.start).twix(tiempoValidar.end);
          var range2 = moment(horarioOcupado[2]).twix(horarioOcupado[3]);

          var resultado = range2.overlaps(range1);
          
          if(resultado){
              break
          }
          
          //var resultado = range2.contains(tiempoValidar.start);
      }
      
      return resultado;
  }
  
  return dataFactory;
    
})