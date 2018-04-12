myApp.controller('UserProfileController', ['UserService', function(UserService){
    const self = this;

    self.UserService = UserService;

    self.fbLogout = UserService.fbLogout;
    let userProfileAuthResponse = function(){
     return FB.getAuthResponse();
    }
    if(userProfileAuthResponse() == null){

      console.log('user must login to view this data');
      $location.path("/login");
      $window.location.reload();
    }
}]);
