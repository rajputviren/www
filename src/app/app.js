require('angular');
require('angular-ui-router');
require('./components/home/homeController.js');
require('./services/loadData.js');
require('jQuery');
var app = angular.module('myWWW',['ui.router','myWWW.home','services']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider 
    	.state('home', {
    		url:'/',
    		views : {
			"" : {
				templateUrl:"app/components/home/home.html"
				}
			}
        });
});