const myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

//Routes//
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  console.log('myApp -- config');
  $routeProvider
  .when('/', {
    redirectTo: 'login'
  })
  .when('/login', {
    templateUrl: '/views/templates/login.html',
    controller: 'LoginController as vm'
  })
  .when('/admin', {
    templateUrl: '/views/templates/admin.html',
    controller: 'AdminController as vm'
  })
  .when('/feed', {
    templateUrl: '/views/templates/user.feed.html',
    controller: 'UserStaticController as vm'
  })
  .when('/user-profile', {
    templateUrl: '/views/templates/user.profile.html',
    controller: 'UserProfileController as vm'
  })
  .when('/nonprofit-profile/:id', {
    templateUrl: '/views/templates/user.nonprofit.html',
    controller: 'UserNonprofitProfileController as vm'
  })
  .when('/discover', {
    templateUrl: '/views/templates/user.discover.html',
    controller: 'UserStaticController as vm'
  })
  .when('/payment', {
    templateUrl: '/views/templates/user.payment.html',
    controller: 'StripeController as vm'
  })
  .when('/support', {
    templateUrl: '/views/templates/support.html',
    controller: 'UserStaticController as vm'
  })
  .when('/admin-csv', {
    templateUrl: '/views/templates/admin.csv.html',
    controller: 'AdminController as vm'
  })
  .when('/admin-feed', {
    templateUrl: '/views/templates/admin.feed.html',
    controller: 'AdminController as vm'
  })
  .when('/admin-nonprofits', {
    templateUrl: '/views/templates/admin.nonprofit.html',
    controller: 'AdminController as vm'
  })
  .when('/admin-users', {
    templateUrl: '/views/templates/admin.user.html',
    controller: 'AdminController as vm'
  })
  .when('/error', {
    templateUrl: '/views/templates/error.html',
    controller: 'AdminController as vm'
  })
  .otherwise({
    template: '<h1>404</h1>'
  });
}])
