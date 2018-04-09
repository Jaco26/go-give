myApp.controller('UserProfileController', ['UserService', function(UserService){
    const self = this;

    self.fbLogout = UserService.fbLogout;
}]);
