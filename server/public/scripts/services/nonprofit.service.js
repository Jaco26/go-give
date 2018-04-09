myApp.service('NonprofitService', ['$http', '$location', function($http, $location) {

    let self = this;

    self.newNonprofit = {};


    self.addNonprofit = function (newNonprofit){
        console.log('add non profit', newNonprofit);
        $http({
            method:'POST',
            url:'/nonprofit',
            data: newNonprofit
        }).then(function(response){
            console.log('success in post', response);
            self.newNonprofit = {}
        }).catch(function(error){
            console.log('error in post', error);
        })
        
    }
    
}]); // end service