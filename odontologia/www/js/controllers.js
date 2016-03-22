angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,store, $ionicPush, $ionicPlatform) {
  
  $ionicPlatform.ready(function() {
    $ionicPush.init({
      "debug": true,
      "onNotification": function(notification) {
        var payload = notification.payload;
        alert(notification, payload);
      },
      "onRegister": function(data) {
        console.log(data.token);
        store.set('pushToken', data.token);
      }
    });

    $ionicPush.register();
  });

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
