myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService',/*'AdminService',*/ function(UserService, NonprofitService, FeedService){
    const self = this;

    self.fbLogout = UserService.fbLogout;

    self.newNonprofit = NonprofitService.newNonprofit;
    self.addNonprofit = NonprofitService.addNonprofit;
    self.getAllNonprofit = NonprofitService.getAllNonprofit;



<<<<<<< HEAD
=======
    self.newFeedItem = FeedService.newFeedItem;
    self.addFeedItem = FeedService.addFeedItem;
  
>>>>>>> 9ec48201d8cfb5ee71dc585322c97ca949a12cce
}]);
