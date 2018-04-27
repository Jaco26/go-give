const myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngSanitize']);

myApp.config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function($routeProvider, $locationProvider, $mdThemingProvider) {
  console.log('myApp -- config');
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange')
    .backgroundPalette('grey');

  $routeProvider
    .when('/', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getInitialLocation();
          }
        }
    })
    .when('/feed', {
      templateUrl: '/views/templates/user.feed.html',
      controller: 'UserStaticController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/user-profile', {
      templateUrl: '/views/templates/user.profile.html',
      controller: 'UserProfileController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/nonprofit-profile/:id', {
      templateUrl: '/views/templates/user.nonprofit.html',
      controller: 'UserNonprofitProfileController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/discover', {
      templateUrl: '/views/templates/user.discover.html',
      controller: 'UserStaticController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/register', {
      templateUrl: '/views/templates/user.register.html',
      controller: 'StripeController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/payment', {
      templateUrl: '/views/templates/user.payment.html',
      controller: 'StripeController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/subscriptions', {
      templateUrl: '/views/templates/user.subscriptions.html',
      controller: 'UserSubscriptionsController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/support', {
      templateUrl: '/views/templates/user.support.html',
      controller: 'UserStaticController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getUser();
          }
        }
    })
    .when('/admin-feed', {
      templateUrl: '/views/templates/admin.feed.html',
      controller: 'AdminController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getAdmin();
          }
        }
    })
    .when('/admin-nonprofits', {
      templateUrl: '/views/templates/admin.nonprofit.html',
      controller: 'AdminController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getAdmin();
          }
        }
    })
    .when('/admin-users', {
      templateUrl: '/views/templates/admin.user.html',
      controller: 'AdminController as vm',
      resolve: {
          getuser : function(UserService){
            return UserService.getAdmin();
          }
        }
    })
    .when('/error', {
      templateUrl: '/views/templates/error.html',
      controller: 'AdminController as vm'
    })
    .otherwise({
      template: '<h1>404</h1>'
    });

}])
