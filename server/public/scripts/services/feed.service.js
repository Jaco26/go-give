myApp.service('FeedService', ['$http', '$location', '$route', function($http, $location, $route) {

    let self = this;

    self.newFeedItem = {};
    self.allFeedItems = {};

    self.addFeedItem = function( newFeedItem){
        console.log('added to feed', newFeedItem);
        $http({
            method: 'POST',
            url: '/feed',
            data: newFeedItem
        }).then(function(response){
            console.log('success in feed item', response);
            self.newFeedItem = {}
            $route.reload();
            self.getFeedItems();
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
      console.log('success in feed item get', response);
      self.allFeedItems.list = response.data.rows;
    }).catch(function(error){
      console.log('error in getting all feed items', error);
    })
  }


}]); // end service
