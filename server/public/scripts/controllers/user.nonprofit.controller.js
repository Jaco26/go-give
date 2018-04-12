myApp.controller('UserNonprofitProfileController', ['UserService', function(UserService){
    const self = this;

    self.UserService = UserService;

    self.fbLogout = UserService.fbLogout;
    let userNonprofitAuthResponse = function(){
     return FB.getAuthResponse();
    }
    if(userNonprofitAuthResponse() == null){

      console.log('user must login to view this data');
      $location.path("/login");
      $window.location.reload();
    }

}]);
