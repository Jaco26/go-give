myApp.controller('UserProfileController', ['UserService', '$window', function(UserService, $window){
    const self = this;

    self.UserService = UserService;

    self.fbLogout = UserService.fbLogout;

}]);
