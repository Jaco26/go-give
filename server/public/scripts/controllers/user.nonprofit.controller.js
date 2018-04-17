myApp.controller('UserNonprofitProfileController',['UserService', 'StripeService', '$routeParams', 'NonprofitService', '$window',
                  function(UserService, StripeService, $routeParams, NonprofitService, $window){
    const self = this;

    self.UserService = UserService;
    self.nonprofitToDisplay = NonprofitService.nonprofitToDisplay;

    self.fbLogout = UserService.fbLogout;

    NonprofitService.displaySoloNonprofit($routeParams.id)

    self.plan = UserService.plan;
    self.subscribeToThisPlan = UserService.subscribeToThisPlan;

    self.oneTimeAmount = UserService.oneTimeAmount;
    self.oneTimeDonate = UserService.oneTimeDonate;

}]);
