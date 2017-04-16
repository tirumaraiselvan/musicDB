(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['AuthenticationService', '$location', 'FlashService'];
    function RegisterController(AuthenticationService, $location, FlashService) {
        var vm = this;

        vm.register = register;

        function register() {
            if (vm.user.password != vm.user.confirmPassword) {
                FlashService.Error("Passwords don't match");
                return;
            }

            vm.dataLoading = true;
            AuthenticationService.Register(vm.user.username, vm.user.password, function success(response) {
                    FlashService.Success('Registration successful', true);
                    $location.path('/login');
                },
                function error(response) {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            );
        }
    }

})();
