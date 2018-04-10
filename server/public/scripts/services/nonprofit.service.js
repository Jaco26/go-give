myApp.service('NonprofitService', ['$http', '$location', '$route', function($http, $location, $route) {

    let self = this;

    self.newNonprofit = {};
    self.allNonprofits = {};

    self.addNonprofit = function (newNonprofit){
        console.log('add non profit', newNonprofit);
        $http({
            method:'POST',
            url:'/nonprofit',
            data: newNonprofit
        }).then(function(response){
            console.log('success in post', response);
            self.newNonprofit = {}
            $route.reload();
        }).catch(function(error){
            console.log('error in post', error);
        })
    }

    self.getAllNonprofit = function (){
      console.log('in get all nonprofits -- service');
      $http({
        method: 'GET',
        url: '/nonprofit'
      }).then(function(response){
        console.log('success in get all', response);
        self.allNonprofits.list = response.data.rows
        console.log(self.allNonprofits.list, 'list of all nonprofits');
      }).catch(function(error){
        console.log('error in get all', error);
      })
    }
    //end get allNonprofits

    self.editNonprofit = function(id){
      console.log('in edit nonprofit', id);
    }

    self.deleteNonprofit = function(id){
      console.log('in delete nonprofit', id);
      $http({
        method: 'DELETE',
        url: `/nonprofit/${id}`
      }).then(function(response) {
        console.log('success in delete nonprofit', response);
        self.getAllNonprofit();
      }).catch(function(error) {
        console.log('error in delete nonprofit', error);
      })
    }
    //end delete nonprofit 

}]); // end service
