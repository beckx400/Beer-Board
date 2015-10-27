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

//Customer search function
    vm.findBar = function() {
//Get searched bar information
        console.log('called');
        var searchedBar = vm.searchedBar;
        $http.get('/users/search/' + searchedBar).then(function(response) {
            vm.bar = response.data;
            vm.barLocation = vm.bar.street + " " + vm.bar.city + ", " + vm.bar.state + " " + vm.bar.zipcode;
            vm.beerList = response.data.beerList.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
           vm.$apply();
        });
        vm.showContent = true;
    };

    vm.expandView = function(){

        vm.enlarge = true;
    };

//Submit a rating
    vm.submitRating = function(name, index){

        var newRating = vm.newRating[index];

        var data = {rating: newRating, beerName: name};
        $http.put('/users/rate/' + vm.bar._id, data).then(function(response){
           vm.findBar();
        });
        vm.newRating[index] = 0;
        vm.enlarge[index] = false;
    }
}]);
