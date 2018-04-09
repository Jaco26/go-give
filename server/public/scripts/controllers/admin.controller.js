myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService',/*'AdminService',*/ function(UserService, NonprofitService, FeedService){
    const self = this;

    self.fbLogout = UserService.fbLogout;

    self.newNonprofit = NonprofitService.newNonprofit;
    self.addNonprofit = NonprofitService.addNonprofit;
    self.getAllNonprofit = NonprofitService.getAllNonprofit;
    self.newFeedItem = FeedService.newFeedItem;
    self.addFeedItem = FeedService.addFeedItem;

}]);
