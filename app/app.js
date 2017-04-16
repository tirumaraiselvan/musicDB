(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'angular-clipboard'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        $rootScope.globals = {};
        $rootScope.globals.currentUser = $cookies.getObject('currentUser');
        var host = $location.host();
        var baseDomain = host.split('.')[1];
        baseDomain = "carve65";
        $rootScope.globals.authUrl = "https://auth." + baseDomain + ".hasura-app.io";
        $rootScope.globals.dataUrl = "https://data." + baseDomain + ".hasura-app.io/v1/query";


        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();