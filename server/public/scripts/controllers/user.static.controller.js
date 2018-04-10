myApp.controller('UserStaticController', ['UserService', 'FeedService', function(UserService, FeedService){
    const self = this;

    self.fbLogout = UserService.fbLogout;
    self.user = UserService.user;

    self.allFeedItems = FeedService.allFeedItems
}]);
