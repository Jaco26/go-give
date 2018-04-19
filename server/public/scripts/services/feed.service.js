myApp.service('FeedService', ['$http', '$location', '$route', function($http, $location, $route) {

    let self = this;

    self.newFeedItem = {};
    self.allFeedItems = {};
    self.editFeedToggle = {show: false };
    self.client = filestack.init("AK86VsSwcSeSUJAN5iXmTz");


    self.addFeedItem = function(newFeed, newFeedImg){
        console.log('added to feed', newFeed, newFeedImg);
        if (newFeed.feed_video){
          let indexToCut = newFeed.feed_video.lastIndexOf('=');
          newFeed.feed_video = newFeed.feed_video.substring(indexToCut+1);
          console.log(newFeed.feed_video, 'truncated video url');
        }
        $http({
            method: 'POST',
            url: '/feed',
            data: {newFeed :newFeed,
                   newFeedImg: newFeedImg}
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
//end addFeedItem

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
// end getFeedItem

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
// end deleteFeedItem

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
    }).catch((error) => {
      console.log('error in display', error);
    })
    }


  self.updateFeedItem = function(newFeedItem) {
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
  // end updateFeedItem

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
    })
    $route.reload();
  }



}]); // end service
