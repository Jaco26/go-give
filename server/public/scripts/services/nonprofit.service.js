myApp.service('NonprofitService', ['$http', '$location', '$route', '$mdDialog', '$window', function($http, $location, $route, $mdDialog, $window) {

  let self = this;
  
  self.newNonprofit = {};
  self.allNonprofits = {
    list: [],
    receivedDonations: {},
  };
  self.editNonprofitToggle = {show: false};
  self.soloNonprofit = {};
  self.nonprofitToDisplay = {
    solo: {},
    topDonors: {}
  };
  
  self.getFileStackKey = function () {
    let FILESTACK_KEY;
    $http.get('/filestack-key')
      .then(response => {
        FILESTACK_KEY = response.data;
        self.client = filestack.init(FILESTACK_KEY);
      })
      .catch(err => {
        console.log(err);
      });
  }

  self.getFileStackKey();
  

  self.addNonprofit = function (newNonprofit){
    if(!self.newNonprofit.name || !self.newNonprofit.description || !self.newNonprofit.picture_url || !self.newNonprofit.logo_url || !self.newNonprofit.state || !self.newNonprofit.city){
      self.requireNonprofitInputs();
    } else {
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
  }

  self.requireNonprofitInputs = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Please fill out all inputs.')
          .ok('OK')
          .targetEvent(ev)
    );
  }

  self.getAllNonprofit = function (){
    console.log('in get all nonprofits -- service');
    $http({
      method: 'GET',
      url: '/nonprofit'
    }).then(function(response){
      self.allNonprofits.list = response.data.rows;
      self.getReceivedDonationsForNonprofits()
      console.log(self.allNonprofits.list, 'ALL NONPROFITS!!!');
    }).catch(function(error){
      console.log('error in get all', error);
    })
  }
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

  // GET TOP DONORS BY NONPROFIT
  self.getTopDonors = function (nonprofitId) {
    $http.get(`/nonprofit/top-donors/${nonprofitId}`)
    .then(response => {
      console.log('TOP DONORS RESPONSE ******', response.data);
      self.nonprofitToDisplay.topDonors = response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  self.editNonprofit = function(id){
    console.log('in edit nonprofit', id);
    self.populateEditFields(id);
    $window.scrollTo(0, 0);
  }

  self.confirmDeleteNonprofit = function(id, ev){
    let confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete this nonprofit?')
        .targetEvent(ev)
        .ok('DELETE')
        .cancel('CANCEL');
    $mdDialog.show(confirm).then(function() {
      self.deleteNonprofit(id);
    }, function() {
      console.log('cancel delete nonprofit');
    });    
  }

  self.deleteNonprofit = function(id){
    console.log('in delete nonprofit', id);
    $http({
      method: 'DELETE',
      url: `/nonprofit/${id}`
    }).then(function(response) {
      self.getAllNonprofit();
    }).catch(function(error) {
      console.log('error in delete nonprofit', error);
    })
  }

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

  self.submitEditedNonprofit = function (editedNonprofit){
    if(!editedNonprofit.name || !editedNonprofit.description || !editedNonprofit.picture_url || !editedNonprofit.logo_url || !editedNonprofit.state || !editedNonprofit.city){
      self.requireNonprofitInputs();
    } else {
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
  }

  self.cancelEditNonprofit = function(){
    console.log('in cancelEditNonprofit');
    self.newNonprofit = {};
    self.editNonprofitToggle.show = false;
    $route.reload();
  }

  self.displaySoloNonprofit = function(id){
    console.log('in displaySoloNonprofit', id);
    self.getTopDonors(id);
    self.getSoloNonprofit(id)
      .then(function(){
        console.log(self.soloNonprofit, 'soloNonprofit in displaySoloNonprofit');
        self.nonprofitToDisplay.solo = self.soloNonprofit;
        console.log('self.nonprofitToDisplay##@@@###@@@###', self.nonprofitToDisplay);
      })
  }

  self.getSoloNonprofit = function(id) {
    console.log('in sologet ', id);
      return $http({
      method: 'GET',
      url: `/nonprofit/${id}`
    }).then(function(response) {
      self.soloNonprofit = response.data.rows[0];
    }).catch(function(error) {
      console.log('error in populate edit fields', error);
    })
  }
  
  self.cropAlert = function(type, ev){
    let confirm = $mdDialog.confirm()
        .title('Please crop logo to either square or circle.')
        .targetEvent(ev)
        .ok('OK')
    $mdDialog.show(confirm).then(function() {
      self.upload(type);
    }, function() {
      console.log('cancel delete nonprofit');
    });    
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

}]); 
