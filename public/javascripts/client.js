/**
 * Created by Dave on 10/17/15.
 */
var app = angular.module('beerBoardApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'xeditable']);

//Sets specific html view to load and sets an Angular controller to each page
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: "/home",
            controllerAs: 'home',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: "/about"
            //controller: "AboutController"
        })
        .when('/credits', {
            templateUrl: "/credits"
            //controller: "CreditsController"
        })
        .when('/admin', {
            templateUrl: "/admin",
            controllerAs: 'admin',
            controller: "AdminController"
        })
        .when('/register', {
            templateUrl: "/register",
            controllerAs: 'register',
            controller: "RegisterController"
        })
        .when('/success', {
            templateUrl: "/success"
            //controllerAs: 'success',
            //controller: "SuccessController"
        });

    $locationProvider.html5Mode(true);
}]);


app.controller('MainController', ['$scope', '$http', function($scope, $http){
    var vm = this;

    vm.loginOrOut = false;

    //User Logout
    vm.logout = function(){
        vm.loginOrOut = false;
        $http.get('/users/logout');
    };

    //User Login path
    vm.login = function(){

        var myUsername = vm.username;
        var myPassword = vm.password;
        $http.post('/login',{username:myUsername,password:myPassword}).then(function(response){
            //if the login attempt succeeded
            if(response.data.success){
                vm.loginOrOut = true;
            }
            //Otherwise, if the attempt failed
            else {
                alert("Username or password incorrect");
            }
        });
    };

    //Angular Material dropdown menu control
    var originatorEv;
    this.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

}]);

app.controller('RegisterController', ['$scope', function($scope){
    var vm = this;

    this.successMessage = function() {

        if(vm.username && vm.password){
            alert("You have successfully registered, now please login!");
        } else {
            alert("Please fill out the required fields!")
        }
    }

}]);
