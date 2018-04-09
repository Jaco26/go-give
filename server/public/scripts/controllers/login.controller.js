myApp.controller('LoginController', [ 'UserService', '$window', function(UserService, $window){
  console.log('in login controller');
    const self = this;

    self.picture = {url:''};
    self.user = UserService.user;
    self.addUserToDB = UserService.addUserToDB;
    self.checkForRegistration = UserService.checkForRegistration;


    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback = function(response) {
      console.log(response, 'in statusChangeCallback');
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
      testAPI(self.user)
      } else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      }
    }
    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
     checkLoginState=function() {
      FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
      });
    }

    $window.fbAsyncInit = function() {
      FB.init({
        appId      : '1959229107724531',
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
      });

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.

      FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
      });

    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
     testAPI=function(user) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
        document.getElementById('pic').innerHTML =
          `<img src=https://graph.facebook.com/${response.id}/picture/>`;
          self.user.url = `https://graph.facebook.com/${response.id}/picture`
          self.user.name = response.name;
          self.user.fbid = response.id;
          console.log(self.user, 'user in controller');
          self.checkForRegistration(self.user);

      });
    }

    testAPIRegister=function(user) {
     console.log('Welcome!  Fetching your information.... ');
     FB.api('/me', function(response) {
       console.log('Successful login for: ' + response.name);
       document.getElementById('status').innerHTML =
         'Thanks for logging in, ' + response.name + '!';
       document.getElementById('pic').innerHTML =
         `<img src=https://graph.facebook.com/${response.id}/picture/>`;
         self.user.url = `https://graph.facebook.com/${response.id}/picture`
         self.user.name = response.name;
         self.user.fbid = response.id;
         console.log(self.user, 'user in controller');
         self.addUserToDB(self.user);

     });
    }


    self.fbLogout = function () {
            FB.logout(function (response) {
                //Do what ever you want here when logged out like reloading the page
                window.location.reload();
            });
        }

    self.register = function(){
      console.log('in register');
      testAPIRegister();
      self.user.registerToggle = false;
    }
}]);
//end controller
