myApp.service('UserService', ['$http', '$location', '$window', '$route', '$mdDialog', '$timeout', function($http, $location, $window, $route, $mdDialog, $timeout) {
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
    fromOurDB: {
      donationHistory: [],
      totalGiven: 0,
    }
  };

  self.getInitialLocation = function(){
    console.log('UserService -- getuser', self.userObject);
    $http.get('/auth').then(function(response) {
      console.log(response, 'response in getUser');
        if(response.data.name) {
            if(response.data.role === 1) {
              $location.path("/admin-feed");
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
    self.currentPath = $location.path();
    $window.scrollTo(0, 0);
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

  self.getAdmin = function() {
    console.log('UserService -- getAdmin');
    self.currentPath = $location.path();
    $window.scrollTo(0, 0);
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
          self.getDonationHistoryFromOurDB();
        }
      } else {
        console.log('UserService -- getAdmin -- failure');
        // user in not admin, bounce them back to the login page
        $location.path("/");
      }
    })
  }

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

  self.getUsersCharges = function () {
    $http.get(`/stripe/charges/${self.userObject.fromOurDB.customer_id}`)
        .then(response => {
            self.userObject.stripeCustomerInfo.forReports.chargesByOrg = response.data;
            console.log('AFTER GET USERS CHARGES', self.user);
        }).catch(err => {
            console.log(err);
        });
  }

  self.getUsersInvoices = function () {
      $http.get(`/stripe/invoices/${self.userObject.fromOurDB.customer_id}`)
      .then(response => {
          self.userObject.stripeCustomerInfo.forReports.invoicesByOrg = response.data;
        console.log('AFTER GET USERS INVOICES', self.user);
      }).catch(err => {
          console.log(err);
      });
  }

  self.confirmDeleteUser = function(id, ev){
    let confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete this user?')
        .targetEvent(ev)
        .ok('DELETE')
        .cancel('CANCEL');
    $mdDialog.show(confirm).then(function() {
      self.deleteUser(id);
    }, function() {
      console.log('cancel delete user');
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

  self.confirmLogout = function(ev) {
    let confirm = $mdDialog.confirm()
      .title('Are you sure you want to log out?')
      .targetEvent(ev)
      .ok('LOGOUT')
      .cancel('CANCEL');
    $mdDialog.show(confirm).then(function() {
      self.fbLogout();
    }, function() {
      console.log('cancel logout');
    });
  };

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

  self.requireStripeRegistrationAlert = function(ev){
    let confirm = $mdDialog.confirm()
          .title(`You must enter payment information to donate.`)
          .targetEvent(ev)
          .ok('ENTER INFO')
          .cancel('CANCEL')
          self.oneTimeDonation.amount = '';
    $mdDialog.show(confirm).then(function() {
      $location.path("/register");
    }, function() {
      console.log('cancel payment');
    });
  }

  self.coinOpacity = 1
  self.coinPaddingTop = '0px'
  self.pageOpacity = 1;
  self.logoOpacity = 0;
  self.logoZIndex = -1;

  self.animateCoin = function(){
    self.coinOpacity -= .01;
    self.coinPaddingTop.toString();
    let removedPixelPadding = Number(self.coinPaddingTop.slice(0, self.coinPaddingTop.length - 2)) + 3;
    self.coinPaddingTop = removedPixelPadding.toString() + 'px'
  }

  self.animateScreen = function(){
    $timeout(function (){
      if (self.coinOpacity > 0){
        self.animateCoin();
        self.animateScreen();
      } else {
        self.pageOpacity = 1;
        self.logoOpacity = 0;
        self.logoZIndex = -1;
        self.coinOpacity = 1
        self.coinPaddingTop = '0px'
      }
    }, 10)
  }

  self.animatePage = function(){
    $window.scrollTo(0, 0);
    self.logoZIndex = 1000;
    self.pageOpacity = .4;
    self.logoOpacity = 1;
    self.animateScreen();
  }

  self.confirmSubscribe = function(nonprofit, planId, ev) {
    if(self.userObject.fromOurDB.customer_id){
      if(self.plan.id){
        let confirm = $mdDialog.confirm()
            .title(`Are you sure you want to subscribe to ${nonprofit.name}?`)
            .textContent(`Your card will be charged $${planId}.00 immediately and billed monthly thereafter.`)
            .targetEvent(ev)
            .ok('SUBSCRIBE')
            .cancel('CANCEL');
        $mdDialog.show(confirm).then(function() {
          self.animatePage();
          self.subscribeToThisPlan(nonprofit, planId);
        }, function() {
          console.log('cancel subscribe');
        });
      } else {
        self.requiredAmountAlert();
      }
    } else {
      self.requireStripeRegistrationAlert();
      self.plan.id = '';
    }
  };

  self.plan = {};
  self.subscribeToThisPlan = function (nonprofit, planId) {
    if (planId == 5){
      planId = nonprofit.plan_id_five;
    } else if (planId == 10){
      planId = nonprofit.plan_id_ten;
    } else if (planId == 20){
      planId = nonprofit.plan_id_twenty;
    }
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
              });
          }
      }
      //subscribe customer to new subscription
      let data = { planId: planId, customerId: self.userObject.fromOurDB.customer_id };
      $http.post('/stripe/subscribe_to_plan', data)
          .then(response => {
            self.plan.id = undefined;
            self.getStripeCustomerInfo();
            self.getDonationHistoryFromOurDB();

          }).catch(err => {
              console.log(err);
          });
    }
    else {
      let data = { planId: planId, customerId: self.userObject.fromOurDB.customer_id };
      $http.post('/stripe/subscribe_to_plan', data)
          .then(response => {
            self.plan.id = undefined;
            self.getStripeCustomerInfo();
            self.getDonationHistoryFromOurDB();
          }).catch(err => {
              console.log(err);
          });
    }
  }

  self.confirmOneTimeDonate = function(product, amount, ev) {
    if(self.userObject.fromOurDB.customer_id){
      if(self.oneTimeDonation.amount){
        if(self.oneTimeDonation.amount >= 5){
          let confirm = $mdDialog.confirm()
              .title(`Are you sure you want to donate?`)
              .textContent(`Your card will be charged $${amount}.00 immediately.`)
              .targetEvent(ev)
              .ok('DONATE')
              .cancel('CANCEL');
          $mdDialog.show(confirm).then(function() {
            self.animatePage();
            self.oneTimeDonate(product, amount);
          }, function() {
            console.log('cancel subscribe');
          });
        } else {
          self.requireGreaterThanFiveDollarsAlert();
        }
      } else {
        self.requiredAmountAlert();
      }
    } else {
      self.requireStripeRegistrationAlert();
    }
  };

  self.oneTimeDonation = {};
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
          self.oneTimeDonation.amount = '';
          self.getDonationHistoryFromOurDB();
      }).catch(err => {
          console.log(err);
      })
  }

  self.requiredAmountAlert = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Please enter an amount.')
          .ok('OK')
          .targetEvent(ev)
    );
  }

  self.requireGreaterThanFiveDollarsAlert = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('One-time donations must be at least $5.00.')
          .ok('OK')
          .targetEvent(ev)
    );
  }

  self.getDonationHistoryFromOurDB = function () {
    $http.get(`/user/donation-history/${self.userObject.fromOurDB.id}`)
    .then(response => {
      console.log(' ********** USERS DONATION HISTORY OBJECT:', response.data);
      self.userObject.fromOurDB.donationHistory = response.data;
      console.log('USER OBJECT AFTER getDonationHistoryFromOurDB', self.userObject);
    }).catch(err => {
      console.log(err);
    });
  }

}]); 
