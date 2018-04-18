myApp.service('UserService', ['$http', '$location', '$window', '$route', function($http, $location, $window, $route) {
  let self = this;

  self.userArray = {};
  self.callbackResponse = '';
  self.userObject = {
    stripeCustomerInfo: {
      customerObject: {},
      forReports: {
        invoicesByOrg: [], // for subscriptions
        chargesByOrg: [], // for onetime donations
      }
    },
    fromOurDB: {}
  };

  console.log(self.userObject, 'user in service');

  self.getInitialLocation = function(){
    console.log('UserService -- getuser', self.userObject);

    $http.get('/auth').then(function(response) {
      console.log(response, 'response in getUser');
        if(response.data.name) {
            if(response.data.role === 1) {
              $location.path("/admin");
            } else {
              $location.path("/feed");
            }
        } else {
            console.log('UserService -- getuser -- failure');
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
    });
  }

  self.getUser = function(){
    console.log('UserService -- getuser');
    console.log(self.userObject, 'userobj in get user');

    $http.get('/auth').then(function(response) {
      console.log(response, 'response in getUser');
        if(response.data.name) {
            // user has a curret session on the server
            self.userObject.fromOurDB.name = response.data.name;
            self.userObject.fromOurDB.fb_id = response.data.fb_id;
            self.userObject.fromOurDB.role = response.data.role;
            self.userObject.fromOurDB.first_name = response.data.first_name;
            self.userObject.fromOurDB.last_name = response.data.last_name;
            self.userObject.fromOurDB.id = response.data.id;
            self.userObject.fromOurDB.customer_id = response.data.customer_id;
            console.log('UserService -- getuser -- User Data: ', self.userObject);
            if(self.userObject.fromOurDB.customer_id){
              self.getStripeCustomerInfo();
              // self.getUsersCharges();
              // self.getUsersInvoices();
              self.getUsersOneTimeDonationsFromDB(self.userObject.fromOurDB.id);
              // JACOB TEST Init for getDonationHistoryFromOurDB
              self.getDonationHistoryFromOurDB();
            }
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/");
    });
  }
  //end getUser check for auth

  self.getAdmin = function() {
    console.log('UserService -- getAdmin');

    $http.get('/auth').then(function(response) {
      console.log(response, 'response in getAdmin');
      if(response.data.role == 1) {
        console.log('admin is logged in', response.data.role);
        self.userObject.fromOurDB.name = response.data.name;
        self.userObject.fromOurDB.fb_id = response.data.fb_id;
        self.userObject.fromOurDB.role = response.data.role;
        self.userObject.fromOurDB.first_name = response.data.first_name;
        self.userObject.fromOurDB.last_name = response.data.last_name;
        self.userObject.fromOurDB.id = response.data.id;
        self.userObject.fromOurDB.customer_id = response.data.customer_id;
        if(self.userObject.fromOurDB.customer_id){
          self.getStripeCustomerInfo();
          // self.getUsersCharges();
          // self.getUsersInvoices();
          self.getUsersOneTimeDonationsFromDB(self.userObject.fromOurDB.id);
          // JACOB TEST Init for getDonationHistoryFromOurDB
          self.getDonationHistoryFromOurDB();
        }
      } else {
        console.log('UserService -- getAdmin -- failure');
        // user in not admin, bounce them back to the login page
        $location.path("/");
      }
    })
  }
  //end getAdmin check for auth

  self.getAllUsers = function(){
    console.log('in GetAllUsers');
    $http({
      method:'GET',
      url:'/user',
    }).then(function(response){
      console.log('working in getAllUsers');
      self.userArray.list = response.data.rows
    }).catch(function(error){
      console.log('error in getAllUsers', error);
    })
  }

  var originatorEv;

  self.menuHref = "http://www.google.com/design/spec/components/menus.html#menus-specs";

  self.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };

  self.getStripeCustomerInfo = function () {
    console.log(self.userObject.fromOurDB.customer_id, 'customer_id in getstripecustinfo');
    $http.get(`/stripe/customer/${self.userObject.fromOurDB.customer_id}`)
    .then(response => {
      self.userObject.stripeCustomerInfo.customerObject = response.data;
      console.log('CUSTOMER:', self.userObject.stripeCustomerInfo);
    }).catch(err => {
        console.log(err);
    });
  }

  self.checkStripeRegistration = function() {
    console.log(self.userObject.fromOurDB.customer_id, 'customer_id in check stripe registration');
    if (self.userObject.fromOurDB.customer_id){
      $location.path("/payment");
    } else {
      $location.path("/register");
    }
  }

    // get a list of all stripe charges
  self.getUsersCharges = function () {
    $http.get(`/stripe/charges/${self.userObject.fromOurDB.customer_id}`)
        .then(response => {
            // console.log('USER\'S CHARGES:', response.data);
            self.userObject.stripeCustomerInfo.forReports.chargesByOrg = response.data;
            console.log('AFTER GET USERS CHARGES', self.user);

        }).catch(err => {
            console.log(err);
        });
  }

  // get a list of all invoices
  self.getUsersInvoices = function () {
      $http.get(`/stripe/invoices/${self.userObject.fromOurDB.customer_id}`)
      .then(response => {
          // console.log('USER\'S INVOICES:', response.data);
          self.userObject.stripeCustomerInfo.forReports.invoicesByOrg = response.data;
        console.log('AFTER GET USERS INVOICES', self.user);
      }).catch(err => {
          console.log(err);
      });
  }

self.deleteUser = function (id){
  console.log('in Delete user');
  $http({
    method:'DELETE',
    url:`/user/${id}`
  }).then(function(response){
    console.log('deleted user');
    self.getAllUsers();
  }).catch((error)=>{
    console.log('error in delete', error);
  });
}

self.fbLogout = function () {
  console.log('in logout');
  $http({
    method: 'GET',
    url: '/auth/logout',
  }).then(function(response){
    console.log('success inlogout', response);
    $location.path("/");
  })
}
//end logout

///// WE BROUGHT THIS IN FROM THE STRIPE.SERVICE

self.plan;
self.subscribeToThisPlan = function (nonprofit, planId) {
  if (planId == 5){
    planId = nonprofit.plan_id_five;
  } else if (planId == 10){
    planId = nonprofit.plan_id_ten;
  } else if (planId == 20){
    planId = nonprofit.plan_id_twenty;
  }

  if(self.userObject.stripeCustomerInfo){
    if (self.userObject.stripeCustomerInfo.customerObject.subscriptions.data.length > 0){
      for (subscription of self.userObject.stripeCustomerInfo.customerObject.subscriptions.data){
          if (nonprofit.product_id == subscription.plan.product){
              console.log('already subscribed to this nonprofit');
              //unsubscribe customer to old subscription
              $http({
                  method: 'POST',
                  url: '/stripe/unsubscribe',
                  data: {id: subscription.id}
              }).then(response => {
                  self.getStripeCustomerInfo();
              }).catch(err => {
                  console.log(err);
              })
          }
      }
      //subscribe customer to new subscription
      let data = { planId: planId, customerId: self.userObject.fromOurDB.customer_id };
      $http.post('/stripe/subscribe_to_plan', data)
          .then(response => {
              self.plan = ''
              self.getStripeCustomerInfo();
          }).catch(err => {
              console.log(err);
          });
  }
  else {
      let data = { planId: planId, customerId: self.userObject.fromOurDB.customer_id };
      $http.post('/stripe/subscribe_to_plan', data)
          .then(response => {
              self.plan = ''
              self.getStripeCustomerInfo();
          }).catch(err => {
              console.log(err);
          });
  }
  } else {
    alert('Please register for Stripe');
  }

}

self.oneTimeAmount;
self.oneTimeDonate = function(product, amount) {
  let donation = {}
  donation.customer = self.userObject.fromOurDB.customer_id;
  donation.product = product;
  donation.amount = amount;
    $http({
        method: 'POST',
        url: '/stripe/oneTimeDonate',
        data: donation
    })
    .then(response => {
        console.log(response);
        self.oneTimeAmount = '';
        alert('thanks for donating', amount)
    }).catch(err => {
        console.log(err);
    })
}

self.currentPath = $location.path();

self.oneTimeDonations = [];
self.getUsersOneTimeDonationsFromDB = function(id){
  $http({
    method: 'GET',
    url:`/user/donations/${id}`
  })
  .then(response => {
    self.oneTimeDonations = response.data;
  }).catch(err => {
    console.log(err);
  })
}

self.getDonationHistoryFromOurDB = function () {
  $http.get(`/user/donation-history/${self.userObject.fromOurDB.id}`)
  .then(response => {
    console.log(' ********** USERS DONATION HISTORY OBJECT:', response);
    
  }).catch(err => {
    console.log(err);
    
  });
}

// // JACOB TEST Init for getDonationHistoryFromOurDB
// self.getDonationHistoryFromOurDB();




}]); // end service
