myApp.controller('AdminController', ['UserService', 'NonprofitService','FeedService', '$window', '$mdDialog', '$scope',
        function(UserService, NonprofitService, FeedService, $window, $mdDialog, $scope){
    let self = this;
    
    // This is the Id of the feed item to be edited upon calling self.showEditDialog
    self.feedItemToBeUpdated;

    self.UserService = UserService;
    self.userObject = UserService.userObject;

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
    self.cancelEditFeed = FeedService.cancelEditFeed;
    self.feedPhotoUpload = FeedService.feedPhotoUpload;

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


    self.showEditDialog = function ($event, feedItemId) {
      self.idOfFeedItemToBeUpdated = feedItemId;
      $mdDialog.show({
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        targetEvent: $event,
        templateUrl: '../views/dialogs/edit.feed.item.html',
        controller: feedEditController,
      });
     
    }


    function feedEditController($scope, FeedService) {
      $scope.feedItemToBeUpdated = FeedService.allFeedItems.list.filter(item => item.id == self.idOfFeedItemToBeUpdated)[0];
      $scope.feedItem = {
        feed_date_posted: $scope.feedItemToBeUpdated.feed_date_posted,
        feed_img_url: $scope.feedItemToBeUpdated.feed_img_url,
        feed_text: $scope.feedItemToBeUpdated.feed_text,
        feed_video_url: $scope.feedItemToBeUpdated.feed_video_url,
        id: $scope.feedItemToBeUpdated.id,
        logo_url: $scope.feedItemToBeUpdated.logo_url,
        name: $scope.feedItemToBeUpdated.name,
        nonprofit_id: $scope.feedItemToBeUpdated.nonprofit_id,
      };

    }
  

}])
.config(function($sceDelegateProvider, $mdThemingProvider){
  let backgroundColor = $mdThemingProvider.extendPalette('grey', {
    '400': '#b7b7b7',
    'contrastDefaultColor': 'dark'
  });
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']),
  $mdThemingProvider.definePalette('red', backgroundColor)
  $mdThemingProvider.theme('docs-dark', 'default')
  .primaryPalette('blue')
  .backgroundPalette('grey', {
    'default': '400'
  })
  .accentPalette('grey');


});








// // mdDialogController for showEditDialog from above
// myApp.controller('feedEditController', ['$scope', 'FeedService', 'feedItemId', function($scope, FeedService, feedItemId){
//   let self = this;
//   console.log(feedItemId);
  
// }]);