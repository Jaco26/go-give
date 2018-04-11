myApp.controller('UserNonprofitProfileController',['UserService', '$routeParams', 'NonprofitService',
                  function(UserService, $routeParams, NonprofitService){
    const self = this;
    self.nonprofitToDisplay = NonprofitService.nonprofitToDisplay;


    self.fbLogout = UserService.fbLogout;
    let userNonprofitAuthResponse = function(){
     return FB.getAuthResponse();
    }
    if(userNonprofitAuthResponse() == null){

      console.log('user must login to view this data');
      $location.path("/login");
      $window.location.reload();
    }

    NonprofitService.displaySoloNonprofit($routeParams.id)




}]);
