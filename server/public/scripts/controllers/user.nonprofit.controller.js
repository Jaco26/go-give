myApp.controller('UserNonprofitProfileController',['UserService', 'StripeService', '$routeParams', 'NonprofitService', '$window', '$mdDialog',
    function(UserService, StripeService, $routeParams, NonprofitService, $window, $mdDialog){
    
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

    self.blabla = "bla bla bla"

    self.showDonationDialog = function ($event) {
        console.log('HEYEYEYEYEYYY');
        
        $mdDialog.show({
         
            parent: angular.element(document.body),
            targetEvent: $event,
            templateUrl: '../views/dialogs/make.donation.dialog.html', 
        })
    }

}]);
