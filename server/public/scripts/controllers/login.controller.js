myApp.controller('LoginController', [ 'UserService', '$window', '$location', '$route', function(UserService, $window, $location, $route){
  console.log('in login controller');
    const self = this;

    self.picture = {url:''};
    self.user = UserService.user;
    self.addUserToDB = UserService.addUserToDB;
    self.checkForRegistration = UserService.checkForRegistration;
    self.fbLogout = UserService.fbLogout;
    self.testAPI = UserService.testAPI;
    self.register = UserService.register;



    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback = function(response) {
      console.log(response, 'in statusChangeCallback');
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
      self.testAPI(self.user)
      } else {
        $location.path("/login");
        // $route.reload();

        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      }
    }


    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
     checkLoginState= UserService.checkLoginState;


}]);
//end controller
