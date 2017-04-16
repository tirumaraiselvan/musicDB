(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        // (function initController() {
        //     // reset login status
        //     AuthenticationService.ClearCredentials();
        // })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function success(response) {
                    AuthenticationService.SetCredentials(response.hasura_id, response.hasura_roles, response.auth_token);
                    $location.path('/');
                },
                function error(response) {
                    vm.dataLoading = false;
                }
            )
        }
    }

})();
