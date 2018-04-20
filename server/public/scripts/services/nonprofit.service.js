myApp.service('NonprofitService', ['$http', '$location', '$route', function($http, $location, $route) {

    let self = this;

    self.newNonprofit = {};
    self.allNonprofits = {
      list: [],
      receivedDonations: {},
    };
    self.editNonprofitToggle = {show: false};
    self.soloNonprofit = {};
    self.nonprofitToDisplay = {};
    self.client = filestack.init("AK86VsSwcSeSUJAN5iXmTz");

    self.addNonprofit = function (newNonprofit){
        console.log('add non profit', newNonprofit);
        $http({
            method:'POST',
            url:'/nonprofit',
            data: newNonprofit
        }).then(function(response){
            self.newNonprofit = {}
            $route.reload();
        }).catch(function(error){
            console.log('error in post', error);
        })
    }

    // GET ALL NONPROFIT INFO
    self.getAllNonprofit = function (){
      console.log('in get all nonprofits -- service');
      $http({
        method: 'GET',
        url: '/nonprofit'
      }).then(function(response){
        self.allNonprofits.list = response.data.rows;
        self.getReceivedDonationsForNonprofits()
        self.getTopDonors();
      }).catch(function(error){
        console.log('error in get all', error);
      })
    }
    //end get allNonprofits

    // GET TOTALS RECEIVED FOR EACH NONPROFIT
    self.getReceivedDonationsForNonprofits = function () {
      let nonprofitIds = self.allNonprofits.list.map(item => item.id);
      $http.get(`/nonprofit/donation-history/${nonprofitIds}`)
          .then(response => {
            self.allNonprofits.receivedDonations = response.data;
            console.log('',self.allNonprofits);
          })
          .catch(err => {
            console.log(err);
          });
    }

    // GET TOP DONORS
    self.getTopDonors = function () {
      $http.get('/nonprofit/top-donors')
      .then(response => {
        console.log('TOP DONORS RESPONSE ******', response.data);

      })
      .catch(err => {
        console.log(err);
      });
    }

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
      }
      $route.reload();
      })
    }


}]); // end service
