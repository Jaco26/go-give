myApp.service('FeedService', ['$http', '$location', function($http, $location) {

    let self = this;

    self.newFeedItem = {};

    self.addFeedItem = function( newFeedItem){
        console.log('added to feed', newFeedItem);
        $http({
            method: 'POST',
            url: '/feed',
            data: newFeedItem
        }).then(function(response){
            console.log('success in feed item', response);
            self.newFeedItem = {}            
        }).catch(function(error){
            console.log('error in adding a feed',error)
        })
        
    }



}]); // end service

