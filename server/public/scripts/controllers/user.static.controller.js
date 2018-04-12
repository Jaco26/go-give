myApp.controller('UserStaticController', ['UserService', 'FeedService', 'NonprofitService', '$location', '$window', function(UserService, FeedService, NonprofitService, $location, $window){
    const self = this;

    self.UserService = UserService;

    self.fbLogout = UserService.fbLogout;
    self.user = UserService.user;


    let userStaticAuthResponse = function(){
     return FB.getAuthResponse();
    }

    if(userStaticAuthResponse() == null){

      console.log('user must login to view this data');
      $location.path("/login");
      $window.location.reload();
    }

    self.allFeedItems = FeedService.allFeedItems;
    self.allNonprofits = NonprofitService.allNonprofits;
}]);
