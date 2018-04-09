myApp.controller('UserStaticController', ['UserService', function(UserService){
    const self = this;

    self.fbLogout = UserService.fbLogout;
    self.user = UserService.user;
}]);
