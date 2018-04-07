const myApp = angular.module('myApp', ['ngRoute']);

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
    redirectTo: '/views/templates/admin.html',
    controller: 'AdminController as vm'
  })
  .when('/feed', {
    redirectTo: '/views/templates/user.feed.html',
    controller: 'UserStaticController as vm'
  })
  .when('/user-profile', {
    redirectTo: '/views/templates/user.profile.html',
    controller: 'UserProfileController as vm'
  })
  .when('/nonprofit-profile', {
    redirectTo: '/views/templates/user.nonprofit.html',
    controller: 'UserNonprofitProfileController as vm'
  })
  .when('/discover', {
    redirectTo: '/views/templates/user.discover.html',
    controller: 'UserStaticController as vm'
  })
  .when('/payment', {
    redirectTo: '/views/templates/user.payment.html',
    controller: 'StripeController as vm'
  })
  .when('/support', {
    redirectTo: '/views/templates/support.html',
    controller: 'UserStaticController as vm'
  })
  .otherwise({
    template: '<h1>404</h1>'
  });
}])
