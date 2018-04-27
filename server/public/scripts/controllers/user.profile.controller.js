myApp.controller('UserProfileController', ['UserService', '$window', function(UserService, $window){
    const self = this;
    
    self.UserService = UserService;
    self.checkStripeRegistration = UserService.checkStripeRegistration
    self.fbLogout = UserService.fbLogout;
    
}]);
