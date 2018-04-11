myApp.controller('StripeController', ['UserService', function(UserService){
    const self = this;

    self.fbLogout = UserService.fbLogout;

    let stripeAuthResponse = function(){
     return FB.getAuthResponse();
    }
    if(stripeAuthResponse() == null){

      console.log('user must login to view this data');
      $location.path("/login");
      $window.location.reload();
    }}]);
