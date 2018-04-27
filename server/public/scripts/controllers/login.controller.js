myApp.controller('LoginController', [ 'UserService', 'FeedService', 'NonprofitService', '$window', '$location', '$route', function(UserService, FeedService, NonprofitService, $window, $location, $route){
  console.log('in login controller');
    const self = this;

    self.UserService = UserService;
    self.userObject = UserService.userObject;

    self.fbLogout = UserService.fbLogout;

}]);
//end controller
