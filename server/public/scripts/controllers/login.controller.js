myApp.controller('LoginController', [ 'UserService', 'FeedService', 'NonprofitService', '$window', '$location', '$route', function(UserService, FeedService, NonprofitService, $window, $location, $route){
  
  const self = this;

  self.UserService = UserService;
  self.userObject = UserService.userObject;

  self.fbLogout = UserService.fbLogout;
  
}]);

