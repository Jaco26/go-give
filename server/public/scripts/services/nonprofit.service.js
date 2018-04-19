myApp.service('NonprofitService', ['$http', '$location', '$route', function($http, $location, $route) {

    let self = this;

    self.newNonprofit = {};
    self.allNonprofits = {};
    self.editNonprofitToggle = {show: false};
    self.soloNonprofit = {};
    self.nonprofitToDisplay = {};
    self.client = filestack.init("AK86VsSwcSeSUJAN5iXmTz");
    self.newFeedItem = {};


    self.addNonprofit = function (newNonprofit){
        console.log('add non profit', newNonprofit);
        $http({
            method:'POST',
            url:'/nonprofit',
            data: newNonprofit
        }).then(function(response){
            // console.log('success in post', response);
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
        // console.log('success in get all', response);
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
        // console.log('success in delete nonprofit', response);
        self.getAllNonprofit();
      }).catch(function(error) {
        console.log('error in delete nonprofit', error);
      })
    }
    //end delete nonprofit

    self.populateEditFields = function(id){
      console.log('in populateEditFields', id);
      self.getSoloNonprofit(id)
      .then(function() {
        console.log('response in populate nonprofit after then', self.soloNonprofit);
        self.editNonprofitToggle.show = true;
        self.newNonprofit.name = self.soloNonprofit.name;
        self.newNonprofit.description = self.soloNonprofit.description;
        self.newNonprofit.goal_value = self.soloNonprofit.goal_value;
        self.newNonprofit.goal_description = self.soloNonprofit.goal_description;
        self.newNonprofit.picture_url = self.soloNonprofit.picture_url;
        self.newNonprofit.logo_url = self.soloNonprofit.logo_url;
        self.newNonprofit.id = self.soloNonprofit.id;
        self.newNonprofit.state = self.soloNonprofit.state;
        self.newNonprofit.city = self.soloNonprofit.city;
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

    self.displaySoloNonprofit = function(id){
      console.log('in displaySoloNonprofit', id);
      self.getSoloNonprofit(id)
        .then(function(){
          // console.log(self.soloNonprofit, 'soloNonprofit in displaySoloNonprofit');
          self.nonprofitToDisplay.solo = self.soloNonprofit;
        })
    }


    self.getSoloNonprofit = function(id) {
      console.log('in sologet ', id);
       return $http({
        method: 'GET',
        url: `/nonprofit/${id}`
      }).then(function(response) {
        // console.log('success in get solo nonprofit', response);
        self.soloNonprofit = response.data.rows[0];
      }).catch(function(error) {
        console.log('error in populate edit fields', error);
      })
    }

    self.upload = function(type){
      console.log('in upload');
      self.client.pick({
        accept: 'image/*',
        maxFiles: 1
      }).then(function(result){
        console.log(result, 'filestack upload');


        if (type == 'photo') {
        self.newNonprofit.picture_url = result.filesUploaded[0].url;
        console.log('self.newNonprofit.picture_url', self.newNonprofit.picture_url);
      } else if(type == 'logo') {
        self.newNonprofit.logo_url = result.filesUploaded[0].url;
        console.log('self.newNonprofit.logo_url', self.newNonprofit.logo_url);
      } else if (type == 'feedPhoto') {
        self.newFeedItem.feed_img = result.filesUploaded[0].url;
        console.log('self.newFeedItem.feed_img', self.newFeedItem.feed_img);
      }
      // $route.reload();

      })
    }


}]); // end service
