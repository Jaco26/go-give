myApp.controller('UserStaticController', ['UserService', 'FeedService', 'NonprofitService', '$location', '$window', function(UserService, FeedService, NonprofitService, $location, $window){
  const self = this;

  self.UserService = UserService;

  self.fbLogout = UserService.fbLogout;
  self.userObject = UserService.userObject;
  self.checkStripeRegistration = UserService.checkStripeRegistration;

  self.fbLogout = UserService.fbLogout;

  self.allFeedItems = FeedService.allFeedItems;
  self.allNonprofits = NonprofitService.allNonprofits;

  self.getAllNonprofit = NonprofitService.getAllNonprofit;
  self.getAllNonprofit();

  self.getFeedItems = FeedService.getFeedItems;
  self.getFeedItems();

  self.getIframeSrc = function (videoId) {
    return 'https://www.youtube.com/embed/' + videoId;
  };

}])

.config(function($sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']);
});
