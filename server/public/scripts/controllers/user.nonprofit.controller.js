myApp.controller('UserNonprofitProfileController',['UserService', 'StripeService', '$routeParams', 'NonprofitService', '$window',
                  function(UserService, StripeService, $routeParams, NonprofitService, $window){
    const self = this;

    self.UserService = UserService;
    self.NonprofitService = NonprofitService;
    self.nonprofitToDisplay = NonprofitService.nonprofitToDisplay;
    self.checkStripeRegistration = UserService.checkStripeRegistration

    self.fbLogout = UserService.fbLogout;

    NonprofitService.displaySoloNonprofit($routeParams.id)

    self.plan = UserService.plan;
    self.subscribeToThisPlan = UserService.subscribeToThisPlan;

    self.oneTimeDonation = UserService.oneTimeDonation;
    self.oneTimeDonate = UserService.oneTimeDonate;
    self.oneTimeDonation = UserService.oneTimeDonation;

    NonprofitService.getAllNonprofit();

}]);
