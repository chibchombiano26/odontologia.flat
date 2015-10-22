angular.module('hefesoft.parse')
.service('parseService', 
	['$q', '$timeout', 'pubNubService', '$ionicLoading', 'ngFB', function ($q, $timeout, pubNubService, $ionicLoading, ngFB) {
	
	
	var dataFactory = {};
	
	dataFactory.error = function(er, promise) {
       
       if(hefesoftLogActivated){
       	alert("Error: " + er.code + " " + er.message);
       	console.log("Error: " + er.code + " " + er.message);
       }
       
       debugger
       $ionicLoading.hide();
       promise.reject(er);
    }
    
    dataFactory.loginOpenFb = function(){
        
      Parse.User.logOut();
      var deferred = $q.defer();
      $ionicLoading.show();
      
      ngFB.login({scope: 'email,public_profile,publish_actions'}).then(
        function (response) {
          
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                dataFactory.getOpenFb().then(function(result){
                  $ionicLoading.hide();
                  deferred.resolve(result);
                })
            } else {
                $ionicLoading.hide();
                deferred.reject("Error login fb");
                alert('Facebook login failed');
            }
      });
      
      return deferred.promise;
    }
    
    dataFactory.loginFb = function(){
        $ionicLoading.show();
        
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            $ionicLoading.hide();
            if (!user.existed()) {
              updateInoProfile(user); 
            } else {
              updateInoProfile(user);
            }
          },
          error: function(user, error) {
            $ionicLoading.hide();
            alert("Error realizando la autorizacions");
          }
        });
    }
    
    function updateInoProfile(user){
      dataFactory.getInfo().then(function(dataUser){
          
          user.set("email", dataUser.email);
          user.set("picture", dataUser.picture);
          user.set("name",  dataUser.name);
          user.save();
          
          pubNubService.initialise(dataUser.email);
      });
    }
    
    dataFactory.getInfo = function(){
        var deferred = $q.defer();
        FB.api('/me', {fields: 'name,email,picture'}, function(response) {
          deferred.resolve(response);
        });
        
        return deferred.promise;
    }
    
    dataFactory.getOpenFb = function(){
      var deferred = $q.defer();
      
      ngFB.api({
        path: '/me',
        params: {fields: 'id,name,email,picture'}
      }).then(
      function (user) {
        dataFactory.saveFaceBookUserParse(user, deferred);
      },
      function (error) {
        deferred.reject(error);
        alert('Facebook error: ' + error.error_description);
      });
      
      return deferred.promise;
    }
    
    
    dataFactory.saveFaceBookUserParse =  function(data, deferred){
          var user = new Parse.User();
          user.set("username", data.email);
          user.set("name", data.name);
          user.set("password", data.id);
          user.set("email", data.email);
          
          //fb implementation
          user.set("pictureUrl", data.picture.data.url);

          dataFactory.existUser(data.email).then(function(result){
            if(result.length == 0){
              dataFactory.signUp(user, deferred);
            }
            else{
              dataFactory.login(data.email, data.id, deferred);
            }
          });
       }

     dataFactory.existUser =  function (user){
         var deferred = $q.defer();
         var query = new Parse.Query(Parse.User);
         query.equalTo("email", user);
         query.find({
           success: function(result) {
             console.log(result);
             deferred.resolve(result);
           },
           error : function(e){ dataFactory.error(e, deferred)}
         });
         return deferred.promise;
       }

     dataFactory.signUp =  function(user, deferred){
         user.signUp(null, {
           success: function(user) {
             deferred.resolve(user);
             //saveRegistrationId(user);
           },
           error: function(e){ dataFactory.error(e, deferred)}
         });
       }

      dataFactory.login =  function(username, pass, deferred){
         Parse.User.logIn(username, pass, {
          success: function(user) {
            deferred.resolve(user);
           // saveRegistrationId(user);
          },
          error: function(e){ dataFactory.error(e, deferred)}
        });
       }
       
       /*
       //Cuando el usuario se loguea i hay posibilidad de enviar push notification en chrome guardar el id de la registracion
       function saveRegistrationId(user){
           var timer = $timeout(function(){
            if(subscriptionId){
                
                user.set("registrationId", subscriptionId);
                user.save();
                //Detiene el timer
                $timeout.cancel(timer);
            }   
           },3000);
           
            
       }
       */

	
	 
	return dataFactory;

}])