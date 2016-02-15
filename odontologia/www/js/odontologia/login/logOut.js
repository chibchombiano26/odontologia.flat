angular.module("starter")
.controller("logOutCtrl", function($scope, $state, auth, store){

	Parse.User.logOut().then(function(result){
		auth.signout();
    store.remove('profile');
    store.remove('token');
		$state.go("index.login");
		localStorage.clear();
	})

	$scope.login = function(){
		$state.go("index.login");
	}
})
