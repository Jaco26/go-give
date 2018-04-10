myApp.controller('UserStaticController', ['UserService', 'FeedService', 'NonprofitService', function(UserService, FeedService, NonprofitService){
    const self = this;

    self.fbLogout = UserService.fbLogout;
    self.user = UserService.user;

    self.allFeedItems = FeedService.allFeedItems;
    self.allNonprofits = NonprofitService.allNonprofits;
}]);
