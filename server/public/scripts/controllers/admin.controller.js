myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService',/*'AdminService',*/ function(UserService, NonprofitService, FeedService){
    const self = this;

    self.fbLogout = UserService.fbLogout;

    self.newNonprofit = NonprofitService.newNonprofit;
    self.addNonprofit = NonprofitService.addNonprofit;

    self.newFeeditem = FeedService.newFeeditem;
    self.addFeeditem = FeedService.addFeeditem;
  
}]);
