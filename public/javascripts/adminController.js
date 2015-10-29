/**
 * Created by Dave on 10/21/15.
 */
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
}]);
