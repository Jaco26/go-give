myApp.service('FeedService', ['$http', '$location', '$route', '$mdDialog', '$window', function($http, $location, $route, $mdDialog, $window) {
  let self = this;

  self.newFeedItem = {};
  self.allFeedItems = {list: []};
  self.editFeedToggle = {show: false };

  self.getFileStackKey = function () {
    let FILESTACK_KEY
    $http.get('/filestack-key')
    .then(response => {
      FILESTACK_KEY = response.data;
      self.client = filestack.init(FILESTACK_KEY);
    })
    .catch(err => {
      console.log(err);
    });
  }

  self.getFileStackKey()

  self.addFeedItem = function(newFeed, newFeedImg){
    if(!newFeed.id){
      self.requireNonprofit();
    } else {
      if(newFeed.feed_video && newFeed.feed_img_url){
        self.requireOnlyPhotoOrVideo();
      } else {
        console.log('added to feed', newFeed, newFeedImg);
        if (newFeed.feed_video){
          let indexToCut = newFeed.feed_video.lastIndexOf('=');
          newFeed.feed_video = newFeed.feed_video.substring(indexToCut+1);
          console.log(newFeed.feed_video, 'truncated video url');
        }
        $http({
            method: 'POST',
            url: '/feed',
            data: {newFeed :newFeed, newFeedImg: newFeedImg}
        }).then(function(response){
            console.log('success in feed item', response);
            self.newFeedItem.name = '';
            self.newFeedItem.title = '';
            self.newFeedItem.feed_text = '';
            self.newFeedItem.feed_video = '';
            self.newFeedItem.feed_img_url = '';
            self.newFeedItem.id = '';
            self.getFeedItems();
            $route.reload();
        }).catch(function(error){
            console.log('error in adding a feed',error)
        })
      }
    }
  }

  self.requireOnlyPhotoOrVideo = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Please upload photo OR video.')
          .ok('OK')
          .targetEvent(ev)
    );
  }

  self.requireNonprofit = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Please select a nonprofit.')
          .ok('OK')
          .targetEvent(ev)
    );
  }

  self.getFeedItems = function (){
    console.log('in get feed items');
    $http({
      method:'GET',
      url: '/feed'
    }).then(function(response){
      self.allFeedItems.list = response.data.rows;
      console.log(self.allFeedItems.list, 'feed items');
    }).catch(function(error){
      console.log('error in getting all feed items', error);
    })
  }

  self.confirmDeleteFeedItem = function(id, ev){
    let confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete this feed item?')
        .targetEvent(ev)
        .ok('DELETE')
        .cancel('CANCEL');
    $mdDialog.show(confirm).then(function() {
      self.deleteFeedItem(id);
    }, function() {
      console.log('cancel delete user');
    });
  }

  self.deleteFeedItem = function(id) {
    console.log('delete item');
    $http({
      method:'DELETE',
      url:`/feed/${id}`
    }).then((response)=>{
      console.log('deleted item');
      self.getFeedItems();
    }).catch((error)=>{
      console.log('error in delete', error);

    })
  }

  self.displayFeedItem = function(id){
    $http({
      method:'GET',
      url:`/feed/${id}`
    }).then(function(response){
     let editableFeedItem = response.data.rows[0];
     console.log('fed resp', editableFeedItem);

        self.editFeedToggle.show = true;
        console.log('self.editFeedToggle', self.editFeedToggle);
        self.newFeedItem.name = editableFeedItem.name;
        self.newFeedItem.feed_img_url = editableFeedItem.feed_img_url;
        self.newFeedItem.feed_text = editableFeedItem.feed_text;
        self.newFeedItem.feed_video = editableFeedItem.feed_video_url;
        self.newFeedItem.title = editableFeedItem.title;
        self.newFeedItem.id = editableFeedItem.id;
        $window.scrollTo(0, 0);
    }).catch((error) => {
      console.log('error in display', error);
    })
  }

  self.updateFeedItem = function(newFeedItem) {
    if(newFeedItem.feed_video && newFeedItem.feed_img_url){
      self.requireOnlyPhotoOrVideo();
    } else {
        console.log('updated feed item');
        $http({
          method:'PUT',
          url:`/feed`,
          data: newFeedItem
        }).then((response)=> {
          console.log('success in update', response);
          self.editFeedToggle.show = false;
          self.newFeedItem = {};
          self.getFeedItems();
          $route.reload();

        }).catch((error) => {
          console.log('error in update', error);
        })
      }
  }

  self.cancelEditFeed = function(){
    console.log('in cancelEditFeed');
    self.newFeedItem = {};
    self.editFeedToggle.show = false;
    $route.reload();
  }

  self.feedPhotoUpload = function(){
    console.log('in upload');
    self.client.pick({
      accept: 'image/*',
      maxFiles: 1
    }).then(function(result){
      console.log(result, 'filestack upload');
      self.newFeedItem.feed_img_url = result.filesUploaded[0].url;
      console.log('self.newFeedItem.feed_img_url', self.newFeedItem.feed_img_url);
      $route.reload();

    })
  }

}]); 
