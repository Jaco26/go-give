myApp.service('UserService', ['$http', '$location', '$window', '$route', function($http, $location, $window, $route) {
  let self = this;
  self.user = {};
  self.userArray = {};
  self.callbackResponse = '';

  console.log(self.user, 'user in service');

  self.redirectAfterLogin = function (user) {
    console.log('in redirect after login', $location.url());

    if($location.url() == '/login'){
      if(self.user.role === 1){
        //redirect to admin page
        self.checkAdminState();
        $location.path("/admin");
      } else if ( self.user.role === 2) {
        //redirect to user feed
        $location.path("/feed");
      }
    } else {
      $route.reload();
    }
  }

  self.getAllUsers = function(){
    console.log('in GetAllUsers');
    $http({
      method:'GET',
      url:'/user',
    }).then(function(response){
      console.log('working in getAllUsers');
      self.userArray.list = response.data.rows
    }).catch(function(error){
      console.log('error in getAllUsers', error);
    })
  }

  self.addUserToDB = function (user){
    console.log('in addUserToDB', user);
    $http({
      method: 'POST',
      url: '/user',
      data: user
    }).then(function(response){
      console.log('success in post', response);
      self.redirectAfterLogin(user);
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
      console.log('success in get check for reg', response);
      if(response.data.rows.length == 0){
        console.log('not registered!');
        self.addUserToDB(user);
      }
      else {
        // self.user = response.data.rows[0];
        self.user.url = `https://graph.facebook.com/${response.id}/picture`
        self.user.first_name = response.data.rows[0].first_name;
        self.user.last_name = response.data.rows[0].last_name;
        self.user.name = response.data.rows[0].name;
        self.user.fbid = response.data.rows[0].id;
        self.user.role = response.data.rows[0].role;
        self.redirectAfterLogin(user);
      }
    }).catch(function(error){
      console.log('error in get', error);
    })
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
   self.testAPI=function(user) {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', {fields: 'last_name, first_name, name, picture'}, function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.first_name + '!';
      document.getElementById('pic').innerHTML =
        `<img src=https://graph.facebook.com/${response.id}/picture/>`;
        self.user.url = `https://graph.facebook.com/${response.id}/picture`
        self.user.first_name = response.first_name;
        self.user.last_name = response.last_name;
        self.user.name = response.name;
        self.user.fbid = response.id;
        self.checkForRegistration(self.user);
    });
  }

  self.fbLogout = function () {
    console.log('in logout');
    $location.path("/login");
          FB.logout(function (response) {
              //Do what ever you want here when logged out like reloading the page
              self.user = {};
              $window.location.reload();
          });
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
      status     : true,  //Determines whether the current login status of the user
                          //is freshly retrieved on every page load. If this is disabled,
                          //that status will have to be manually retrieved using .getLoginStatus()
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

// ========================================= DO NOT TOUCH ABOVE =======================================================

//on load of the admin controller this function checks to see if the current
//user is an admin and redirects the user back to login if they are not listed as an admin
self.checkAdminState = function (){
  console.log(self.user, 'in checkAdminState');
  if (self.user.role === 1){
    // $location.path("/login");
    // $window.location.reload();
  } else {
    $location.path("/login");
  }
}

self.deleteUser = function (id){
  console.log('in Delete user');
  $http({
    method:'DELETE',
    url:`/user/${id}`,
  }).then(function(response){
    console.log('deleted user');
    self.getAllUsers();
  }).catch((error)=>{
    console.log('error in delete', error);

  });
}

}]); // end service
