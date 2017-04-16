(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'FlashService'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, FlashService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.Register = Register;

        return service;

        function Login(username, password, successCallback, errorCallback) {

            var authUrl = $rootScope.globals.authUrl;

            $http.post(authUrl + "/login", { username: username, password: password })
               .then(function success(response) {
                   successCallback(response.data);
               }, function error(response) {
                errorCallback(response.data);
               });
        }

        function Register(username, password, successCallback, errorCallback) {
            var authUrl = $rootScope.globals.authUrl;

            $http.post(authUrl + "/signup", { username: username, password: password })
               .then(function success(response) {
                   successCallback(response.data);
               }, function error(response) {
                errorCallback(response.data);
               });
        }

        function SetCredentials(hasuraId, hasuraRoles, authToken) {

            $rootScope.globals.currentUser = {
                hasuraId: hasuraId,
                hasuraRoles: hasuraRoles,
                authToken: authToken
            };

            $cookies.putObject('currentUser', $rootScope.globals.currentUser);

       }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
})();