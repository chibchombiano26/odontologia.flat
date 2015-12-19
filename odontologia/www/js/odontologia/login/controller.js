/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("loginCtrl", function($scope, pubNubService, parseService, $state){
      
    var isWindowsPhone = ionic.Platform.isWindowsPhone();

    if(!hefesoft.isEmpty(Parse.User.current())){
      $state.go("app.home");
    }

    // Open the login modal
    $scope.login = function() {      
      //parseService.loginFb();      
        parseService.loginOpenFb().then(function(result){        
        var imagenUsuario = Parse.User.current().get("pictureUrl");
        var email = Parse.User.current().get("email");
        
        pubNubService.initialise(email);
        $state.go("app.home");
      })
      
    };
    
})