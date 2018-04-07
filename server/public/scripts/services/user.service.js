myApp.service('UserService', ['$http', '$location', function($http, $location) {
  let self = this;
  self.user = {};
  self.user.registerToggle = false;

  console.log(self.user, 'user in service');

  self.addUserToDB = function (user){
    console.log('in addUserToDB', user);
    $http({
      method: 'POST',
      url: '/user',
      data: user
    }).then(function(response){
      console.log('success in post', response);
    }).catch(function(error){
      console.log('error in post', error);
    })
  }

  self.checkForRegistration = function(user){
    console.log('in check for registration - service', user);
    $http({
      method: 'GET',
      url: `/user/${user.fbid}`
    }).then(function(response) {
      console.log('success in get', response);
      if(response.data.rows.length == 0){
        console.log('not registered!');
        self.user.registerToggle = true;
        console.log(user);
      }
    }).catch(function(error){
      console.log('error in get', error);
    })
  }
}]); // end service
