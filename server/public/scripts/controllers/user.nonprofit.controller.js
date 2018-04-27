myApp.controller('UserNonprofitProfileController',['UserService', 'StripeService', '$routeParams', 'NonprofitService', '$window', '$mdDialog', '$scope',
    function(UserService, StripeService, $routeParams, NonprofitService, $window, $mdDialog, $scope){

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

    NonprofitService.getAllNonprofit();

    self.showDonationDialog = function ($event) {
        $mdDialog.show({
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            targetEvent: $event,
            templateUrl: '../views/dialogs/make.donation.dialog.html',
            controller: DonationController,
        });
    }

    function DonationController ($scope, UserService, NonprofitService) {
        $scope.UserService = UserService;
        $scope.plan = UserService.plan;
        $scope.oneTimeDonation = UserService.oneTimeDonation;

        $scope.nonprofitToDisplay = NonprofitService.nonprofitToDisplay;
        $scope.closeDialog = function() {
            $mdDialog.hide();
        }
    }

}]);
