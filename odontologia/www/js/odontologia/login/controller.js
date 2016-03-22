/*global angular, Parse, _, moment*/
angular.module("starter")
.controller("loginCtrl", function($scope, pubNubService, parseService, $state, auth, store, $ionicLoading){

    var isWindowsPhone = ionic.Platform.isWindowsPhone();

    if(!hefesoft.isEmpty(Parse.User.current())){
      $state.go("app.home");
    }

    $scope.loginOAuth0 = function() {
      $ionicLoading.show();

      auth.signin({
        dict: 'es',
        disableSignupAction: true,
        icon: 'img/logos/SmallLogo.scale-180.png',
        //connections: ['facebook', 'google-oauth2'],
        connections: ['facebook', 'google-oauth2'],
        authParams: {
          scope: 'openid offline_access',
          device: 'Mobile device'
        }
      }, function(profile, token, accessToken, state, refreshToken) {
        // Success callback
        store.set('profile', profile);
        store.set('token', token);
        store.set('refreshToken', refreshToken);
        login(profile);
      }, function(e) {
        alert(e);
      });
    }

    function login(item){
      var data = {username: item.email, name: item.name, password: item.user_id, email: item.email, pictureUrl : item.picture };
      parseService.proccessUserOaut0(data).then(function(result){
        var imagenUsuario = Parse.User.current().get("pictureUrl");
        var email = Parse.User.current().get("email");
        pubNubService.initialise(email);
        $state.go("app.home");
        $ionicLoading.hide();
      }, function(err){
        $ionicLoading.hide();
        debugger
        alert(err);
      })
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
