myApp.controller('UserSubscriptionsController', ['UserService', 'NonprofitService', '$mdDialog', '$http', function(UserService, NonprofitService, $mdDialog, $http){
    const self = this;

    self.UserService = UserService;
    self.NonprofitService = NonprofitService;

    self.checkStripeRegistration = UserService.checkStripeRegistration;
    self.fbLogout = UserService.fbLogout;
    self.userObject = UserService.userObject;

    self.getAllNonprofit = NonprofitService.getAllNonprofit;
    self.getAllNonprofit();

    self.confirmUnsubscribe = function(id, ev) {
        let confirm = $mdDialog.confirm()
            .title('Are you sure you want to unsubscribe?')
            .targetEvent(ev)
            .ok('UNSUBSCRIBE')
            .cancel('CANCEL');
        $mdDialog.show(confirm).then(function() {
            self.unsubscribe(id);
        }, function() {
            console.log('cancel unsubscribe');
        });
    };

    self.unsubscribe = function(id){
        $http({
            method: 'POST',
            url: '/stripe/unsubscribe',
            data: {id: id}
        }).then(response => {
            console.log('CONFIRMATION OBJECT FROM STRIPE FOR UNSUBSCRIBE****', response);
            self.UserService.getStripeCustomerInfo();
        }).catch(err => {
            console.log(err);
        })
    }

}]);