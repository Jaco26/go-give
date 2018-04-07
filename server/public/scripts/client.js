const myApp = angular.module('myApp', ['ngRoute']);

//Routes//
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
console.log('myApp -- config');
  $routeProvider
  .when('/', {
    redirectTo: 'login'
  })


}])
