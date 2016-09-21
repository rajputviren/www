require('angular');
require('jQuery');
require('angular-ui-router');
require('./services/loadData.js');
require('../../node_modules/ng-autocomplete/src/ngAutocomplete');

var app = angular.module('myWWW', ['ui.router', 'services', 'ngAutocomplete']);

var controller = require('./components/home/homeController');

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/components/home/home.html',
            controller: controller
        });
});