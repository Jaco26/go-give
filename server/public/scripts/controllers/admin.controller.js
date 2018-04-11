myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService', function(UserService, NonprofitService, FeedService){
    const self = this;

    self.checkLoginState = UserService.checkLoginState;
    self.checkAdminState = UserService.checkAdminState;
    self.checkAdminState();

    // let adminAuthResponse = function(){
    //  return FB.getAuthResponse();
    // }
    //
    // if(adminAuthResponse() == null){
    //
    //   $window.location.reload();
    // }

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

    self.updateFeedItem = FeedService.updateFeedItem;
    self.deleteFeedItem = FeedService.deleteFeedItem;
    self.displayFeedItem = FeedService.displayFeedItem;
    self.editFeedToggle = FeedService.editFeedToggle;

    self.userArray = UserService.userArray;
    self.getAllUsers = UserService.getAllUsers;
    self.getAllUsers();
    self.deleteUser = UserService.deleteUser;


}]);
