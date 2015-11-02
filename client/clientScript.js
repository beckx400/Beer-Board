/**
 * Created by Dave on 10/17/15.
 */
var app = angular.module('beerBoardApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'xeditable', 'ngAnimate']);

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
        })
        .when('/credits', {
            templateUrl: "/credits"
        })
        .when('/admin', {
            templateUrl: "/admin",
            controller: "AdminController"
        })
        .when('/register', {
            templateUrl: "/register",
            controller: "RegisterController"
        })

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


app.controller('HomeController', ['$scope', '$http', function($scope, $http, $apply){
    var vm = this;
    vm.showContent = false;
    vm.barLocation;
    vm.bar;
    vm.newRating = 0;
    vm.beerList = [];

    $http.get("/users/names").then(function(response){
        vm.choices = [];
        for(var i = 0; i < response.data.length; i++) {
            vm.choices.push(response.data[i].barName);
        }
    });

//Customer search function
    vm.findBar = function() {
//Get searched bar information
        var searchedBar = vm.searchedBar;
        $http.get('/users/search/' + searchedBar).then(function(response) {
            vm.bar = response.data;
            if(vm.bar.street && vm.bar.city && vm.bar.state && vm.bar.zipcode) {
                vm.barLocation = vm.bar.street + " " + vm.bar.city + ", " + vm.bar.state + " " + vm.bar.zipcode;
            }else{
                vm.barLocation = "";
            }
            //Sort beer list to keep indicies consistent
            vm.beerList = response.data.beerList.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
        });
        vm.showContent = true;
    };

//Clear current search and go to home
    vm.newSearch = function(){
        vm.showContent = false;
        vm.searchedBar = '';
    };
//Submit a rating
    vm.submitRating = function(name, index) {
        var newRating = vm.newRating[index];
        if (newRating == undefined) {
            return newRating;
        } else {
            var data = {rating: newRating, beerName: name};
            $http.put('/users/rate/' + vm.bar._id, data).then(function (response) {
                vm.findBar();
            });
            vm.enlarge[index] = false;
            vm.newRating[index] = 0;
        }
    }
}]);

app.controller('AdminController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

    var vm = this;

    vm.updateInfo = false;
    vm.customShow = false;
    vm.addCustom = false;
    vm.beerName;
    vm.beerChoice = [];
    vm.beerList = [];
    vm.barName;
    vm.bar;

//Get bar information and current beer list
    $http.get('/users').then(function(response){
        vm.bar = response.data;
        vm.beerList = response.data.beerList;
        vm.barName = response.data.barName.toUpperCase();
    });

//**Functions for updating the Users beerList
//Get beer search information and push to a list of choices
    vm.getBeer = function(){
        var beer = vm.addBeer;
        vm.addCustom = true;
        $http.get("/beer/search/" + beer).then(function(response){
            vm.beerChoice = [];

            if(response.data.length < 6){
                for(var i = 0; i < response.data.length; i++){
                    vm.beerChoice.push(response.data[i]);
                }
            } else {
                for(var i = 0; i < 6; i++) {
                    vm.beerChoice.push(response.data[i]);
                }
            }
            vm.addBeer = '';
        });
    };

//Add a new beer to the current list and update the database
    vm.addNewBeer = function(beer){
        vm.beerChoice = [];
        vm.addCustom = false;
        var newBeer = {
            brewery: beer.breweries[0].name.toUpperCase(),
            name:  beer.name.toUpperCase(),
            ibu: beer.ibu,
            abv:  beer.abv,
            description:  beer.description,
            image:  undefined,
            style:  beer.style.shortName,
            srm: undefined,
            availability: undefined,
            rating: 0,
            ratingTotal: 0,
            numOfRatings: 0
        };
        if(typeof beer.srm != 'undefined'){
            newBeer.srm = beer.srm.id;
        }
        if(typeof beer.available != 'undefined'){
            newBeer.availability = beer.available.name;
        }
        if(typeof beer.labels != 'undefined'){
            newBeer.image = beer.labels.large;
        }
        vm.beerList.push(newBeer);
        updateBeerList();
    };

//Display Custom beer input form and hide bar info.
    vm.revealCustom = function(){
        vm.customShow = true;
    };

    vm.customCancel = function(){
        vm.customShow = false;
        vm.beerChoice = [];
    }
//Add a custom beer from form
    vm.submitCustomBeer = function(){
        vm.customShow = false;
        vm.addCustom = false;
        var newBeer = {
            brewery: vm.cusBrewery.toUpperCase(),
            name:  vm.cusName.toUpperCase(),
            ibu: vm.cusIbu,
            abv:  vm.cusAbv,
            description:  vm.cusDesc,
            image:  vm.cusImg,
            style:  vm.cusStyle,
            srm: vm.cusSrm,
            availability: vm.cusAvail,
            rating: 0,
            ratingTotal: 0,
            numOfRatings: 0
        };
        vm.beerList.push(newBeer);
        vm.beerChoice = [];
        updateBeerList();
    };
//Remove a beer from the current list and update the database
    vm.deleteBeer = function(index){
        vm.beerList.splice(index, 1);
        updateBeerList();
    };

//Passed here to update the database
    function updateBeerList(){
        var newList = {beerList: vm.beerList};
        $http.put('/users/addBeer/' + vm.bar._id, newList);
    }

//Update User's info
    vm.submitUserChanges = function(){
        vm.updateInfo = false;
        $http.put('/users/update/' + vm.bar._id, vm.bar).then(function(response){
            vm.successShow = true;
            $timeout(function() {

                // Loadind done here - Show message for 3 more seconds.
                $timeout(function() {
                    vm.successShow = false;
                }, 3000);

            }, 2000);
        });
    };

//Delete the Users account
    vm.deleteUser = function(){
        if(confirm('Are you sure you want to delete your account?')){
            $http.delete('/users/delete/' + vm.bar._id).then(function(response){
                if(response){
                    alert('Your account has been deleted');
                }
            });
        }
    }

    vm.showTooltip = false;
    $scope.$watch(function(val) {
        if (val && val.length ) {
            vm.showTooltip = true;
        }
    })

}]);
