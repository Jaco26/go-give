myApp.service('FeedService', ['$http', '$location', function($http, $location) {

    let self = this;

    self.newFeeditem = {};

    self.addFeeditem = function( newFeeditem){
        console.log('added to feed', newFeeditem);
        $http({
            method: 'POST',
            url: '/feed',
            data: newFeeditem
        }).then(function(response){
            console.log('success in feed item', response);
            self.newFeeditem = {}            
        }).catch(function(error){
            console.log('error in adding a feed',error)
        })
        
    }

}]); // end service

