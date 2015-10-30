/**
 * Created by Dave on 10/21/15.
 */
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
        }
    }
}]);
