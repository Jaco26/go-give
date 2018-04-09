myApp.controller('AdminController', ['UserService',/*'AdminService',*/ function(UserService){
    const self = this;

    self.fbLogout = UserService.fbLogout;

}]);
