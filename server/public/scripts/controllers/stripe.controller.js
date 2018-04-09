myApp.controller('StripeController', ['UserService', function(UserService){
    const self = this;

    self.fbLogout = UserService.fbLogout;
}]);
