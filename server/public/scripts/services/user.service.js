myApp.service('UserService', ['$http', '$location', '$window', function($http, $location, $window) {
  let self = this;
  self.FB = '';
  self.user = {};
  self.user.registerToggle = false;

  console.log(self.user, 'user in service');

  self.addUserToDB = function (user){
    console.log('in addUserToDB', user);
    $http({
      method: 'POST',
      url: '/user',
      data: user
    }).then(function(response){
      console.log('success in post', response);
      self.checkForRegistration(user);
    }).catch(function(error){
      console.log('error in post', error);
    })
  }

  self.checkForRegistration = function(user){
    console.log('in check for registration - service', user);
    $http({
      method: 'GET',
      url: `/user/${user.fbid}`
    }).then(function(response) {
      console.log('success in get', response);
      if(response.data.rows.length == 0){
        console.log('not registered!');
        self.user.registerToggle = true;
      } else {
        self.user = response.data.rows[0];
        console.log(self.user, 'user in get - check for register');
        if(self.user.role === 1){
          //redirect to admin page
          $location.path("/admin");
        } else if ( self.user.role === 2) {
          //redirect to user feed
          $location.path("/feed");
        }
      }
    }).catch(function(error){
      console.log('error in get', error);
    })
  }





  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
   self.testAPI=function(user) {
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
        console.log(self.user, 'user in service');
        self.checkForRegistration(self.user);

    });
  }

  self.testAPIRegister=function(user) {
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
    console.log('in logout');
    $location.path("/login");

          FB.logout(function (response) {
            console.log('in logout2');
              //Do what ever you want here when logged out like reloading the page
              self.user = {};
              $location.path("/login");
              window.location.reload();
          });
      }

  self.register = function(){
    console.log('in register');
    self.testAPIRegister();
    self.user.registerToggle = false;
  }

  self.checkLoginState = function() {
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






}]); // end service
