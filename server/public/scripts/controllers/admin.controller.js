myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService', '$window',
        function(UserService, NonprofitService, FeedService, $window){
    const self = this;
    self.UserService = UserService;
    self.user = UserService.user;

    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback = function(response) {
      console.log(response, 'in statusChangeCallback');
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
      UserService.testAPI(self.user)
      } else {
        $location.url("/error");
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      }
    }
    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
     checkLoginState= UserService.checkLoginState;

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

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

    self.checkAdminState = UserService.checkAdminState;
    self.checkAdminState(self.user);

    self.fbLogout = UserService.fbLogout;

    self.newNonprofit = NonprofitService.newNonprofit;
    self.addNonprofit = NonprofitService.addNonprofit;
    self.getAllNonprofit = NonprofitService.getAllNonprofit;
    self.getAllNonprofit();
    self.allNonprofits = NonprofitService.allNonprofits;

    self.newFeedItem = FeedService.newFeedItem;
    self.addFeedItem = FeedService.addFeedItem;
    self.getFeedItems = FeedService.getFeedItems;
    self.getFeedItems();
    self.allFeedItems = FeedService.allFeedItems;

    self.editNonprofit = NonprofitService.editNonprofit;
    self.deleteNonprofit = NonprofitService.deleteNonprofit;
    self.submitEditedNonprofit = NonprofitService.submitEditedNonprofit;
    self.editNonprofitToggle = NonprofitService.editNonprofitToggle
    self.upload = NonprofitService.upload;

    self.updateFeedItem = FeedService.updateFeedItem;
    self.deleteFeedItem = FeedService.deleteFeedItem;
    self.displayFeedItem = FeedService.displayFeedItem;
    self.editFeedToggle = FeedService.editFeedToggle;

    self.userArray = UserService.userArray;
    self.user = UserService.user;
    self.getAllUsers = UserService.getAllUsers;
    self.getAllUsers();
    self.deleteUser = UserService.deleteUser;

}]);
