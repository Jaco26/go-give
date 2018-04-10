myApp.service('NonprofitService', ['$http', '$location', '$route', function($http, $location, $route) {

    let self = this;

    self.newNonprofit = {};
    self.allNonprofits = {};
    self.editNonprofitToggle = {show: false};

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
      self.populateEditFields(id);
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

    self.populateEditFields = function(id){
      console.log('in populateEditFields', id);
      $http({
        method: 'GET',
        url: `/nonprofit/${id}`
      }).then(function(response) {
        console.log('success in populate edit', response);
        let editableNonprofit = response.data.rows[0];
        self.editNonprofitToggle.show = true;
        // $route.reload();
        self.newNonprofit.name = editableNonprofit.name;
        self.newNonprofit.description = editableNonprofit.description;
        self.newNonprofit.goal = editableNonprofit.goal_value;
        self.newNonprofit.goal_description = editableNonprofit.goal_description;
        self.newNonprofit.picture_url = editableNonprofit.picture_url;
        self.newNonprofit.logo_url = editableNonprofit.logo_url;
        self.newNonprofit.id = editableNonprofit.id
      }).catch(function(error) {
        console.log('error in populate edit fields', error);
      })
    }
    //end populateEditFields

    self.submitEditedNonprofit = function (editedNonprofit){
      console.log('in submitEditedNonprofit', editedNonprofit);
      $http({
        method: 'PUT',
        url: '/nonprofit',
        data: editedNonprofit
      }).then(function(response){
        console.log('success in edit nonprofit', response);
        self.editNonprofitToggle.show = false;
        self.newNonprofit = {};
        self.getAllNonprofit();
        $route.reload();

      }).catch(function(error) {
        console.log('error in edit nonprofit', error);
      })
    }

}]); // end service
