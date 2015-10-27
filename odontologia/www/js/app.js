/*global angular, Parse, _, moment, cordova*/

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'hefesoft.pubnub', 'hefesoft.parse', 'pubnub.angular.service', 'ngCordova', 'ngOpenFB',])

.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    
    ngFB.init({appId: '1665259377039481'});
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  
  moment.locale('es');
  Parse.initialize("kWv0SwtEaz20E7gm5jUNRtzdbLoJktNYvpVWTYpc", "xhg8VzMlpguoJt3TffH62LntLUJj2DFYtYXwJ0Lg");


  window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '1665259377039481', // Facebook App ID
      status     : false,  // check Facebook Login status
      cookie     : true,  // enable cookies to allow Parse to access the session
      xfbml      : true,  // initialize Facebook social plugins on the page
      version    : 'v2.3' // point to the latest Facebook Graph API version
    });
        // Run code after the Facebook SDK is loaded.
   };
   
   (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    //js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.src = "https://connect.facebook.net/en_US/sdk/debug.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
  
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('index', {
    url: '/index',
    abstract: true,
    templateUrl: 'templates/menuLogin.html',
    controller: 'AppCtrl'
  })
  
  .state('index.login',{
    url: '/login',
    views:{
      'menuLogin':{
        templateUrl : 'js/odontologia/login/view.html',
        controller : 'loginCtrl'
      }
    }
  })
    
    .state('app.home',{
      url: '/home',
      views:{
        'menuContent':{
          templateUrl : 'js/odontologia/home/view.html',
          controller : 'homeCtrl'
        }
      }
    })
    
    .state('app.citas',{
      url: '/citas/:id',
      views:{
        'menuContent':{
          templateUrl : 'js/odontologia/citas/view.html',
          controller : 'citasCtrl'
        }
      }
    })
    
    .state('app.listadoCitas',{
      url: '/listadoCitas/:modo',
      views:{
        'menuContent':{
          templateUrl : 'js/odontologia/citas/listado.html',
          controller : 'citasCtrl'
        }
      }
    })
    
    .state('app.success',{
      url: '/success',
      views:{
        'menuContent':{
          templateUrl: 'js/odontologia/success/view.html',
          controller: 'successCtrl'
        }
      }
    })
    
    .state('app.odontologos',{
      url: '/odontologos',
      views:{
        'menuContent':{
          templateUrl : 'js/odontologia/odontologos/view.html',
          controller : 'odontologoCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/index/login');
});
