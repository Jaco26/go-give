myApp.controller('UserNonprofitProfileController', ['UserService', function(UserService){
    const self = this;

    self.fbLogout = UserService.fbLogout;
}]);
