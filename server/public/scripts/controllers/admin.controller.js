myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService', '$window',
        function(UserService, NonprofitService, FeedService, $window){
    const self = this;

    // $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']);

    self.UserService = UserService;
    self.userObject = UserService.userObject;

    self.fbLogout = UserService.fbLogout;

    self.newNonprofit = NonprofitService.newNonprofit;
    self.addNonprofit = NonprofitService.addNonprofit;
    self.getAllNonprofit = NonprofitService.getAllNonprofit;
    self.getAllNonprofit();
    self.allNonprofits = NonprofitService.allNonprofits;

    self.newFeedItem = FeedService.newFeedItem;
    // self.newFeedItem.feed_img = NonprofitService.newFeedItem.feed_img;
    self.addFeedItem = FeedService.addFeedItem;
    self.getFeedItems = FeedService.getFeedItems;
    self.getFeedItems();
    self.allFeedItems = FeedService.allFeedItems;
    self.cancelEditFeed = FeedService.cancelEditFeed;

    self.editNonprofit = NonprofitService.editNonprofit;
    self.deleteNonprofit = NonprofitService.deleteNonprofit;
    self.submitEditedNonprofit = NonprofitService.submitEditedNonprofit;
    self.editNonprofitToggle = NonprofitService.editNonprofitToggle
    self.upload = NonprofitService.upload;
    self.feedImgUpload = NonprofitService.feedImgUpload;

    self.updateFeedItem = FeedService.updateFeedItem;
    self.deleteFeedItem = FeedService.deleteFeedItem;
    self.displayFeedItem = FeedService.displayFeedItem;
    self.editFeedToggle = FeedService.editFeedToggle;

    self.userArray = UserService.userArray;
    self.getAllUsers = UserService.getAllUsers;
    self.getAllUsers();
    self.deleteUser = UserService.deleteUser;

    self.getIframeSrc = function (videoId) {
      return 'https://www.youtube.com/embed/' + videoId;
    };

    self.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
     'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
     'WY').split(' ').map(function(state) {
         return {abbrev: state};
       });


}])
.config(function($sceDelegateProvider, $mdThemingProvider){
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']),
  $mdThemingProvider.theme('docs-dark', 'default')
  .primaryPalette('yellow')
  .dark();
});
