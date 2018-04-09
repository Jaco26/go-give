myApp.controller('AdminController', ['UserService', 'NonprofitService',/*'AdminService',*/ function(UserService, NonprofitService){
    const self = this;

    self.fbLogout = UserService.fbLogout;

    self.newNonprofit = NonprofitService.newNonprofit;
    self.addNonprofit = NonprofitService.addNonprofit;
    self.getAllNonprofit = NonprofitService.getAllNonprofit;

}]);
