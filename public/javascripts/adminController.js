/**
 * Created by Dave on 10/21/15.
 */
app.controller('AdminController', ['$scope', '$http', function($scope, $http, $mdDialog){
    
    var vm = this;
    
    vm.updateInfo = false;
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
        $http.get("/beer/search/" + beer).then(function(response){
            vm.beerChoice = [];

            if(response.data.length < 10){
                for(var i = 0; i < response.data.length; i++){
                    vm.beerChoice.push(response.data[i]);
                }
            } else {
                for(var i = 0; i < 10; i++) {
                    vm.beerChoice.push(response.data[i]);
                }
            }
            console.log(vm.beerChoice);
        vm.addBeer = '';
        });
    };

//Add a new beer to the current list and update the database
    vm.addNewBeer = function(beer){
        vm.beerChoice = [];

        var newBeer = {
            brewery: beer.breweries[0].name,
            name:  beer.name,
            ibu: beer.ibu,
            abv:  beer.abv,
            description:  beer.description,
            image:  undefined,
            longStyle:  beer.style.name,
            shortStyle:  beer.style.shortName,
            srm: {
                id: undefined,
                hex: undefined
            },
            availability: undefined,
            rating: 0
        };
        if(typeof beer.srm != 'undefined'){
            newBeer.srm.id = beer.srm.id;
        }
        if(typeof beer.srm != 'undefined'){
            newBeer.srm.hex = beer.srm.hex;
        }
        if(typeof beer.available != 'undefined'){
            newBeer.availability = beer.available.name;
        }
        if(typeof beer.labels != 'undefined'){
            newBeer.image = beer.labels.large;
        }
        console.log(newBeer);
        vm.beerList.push(newBeer);
        updateBeerList();
    }

//Remove a beer from the current list and update the database
    vm.deleteBeer = function(index){
        vm.beerList.splice(index, 1);
        updateBeerList();
    }

//Passed here to update the database
    function updateBeerList(){
        var newList = {beerList: vm.beerList};
        $http.put('/users/addBeer/' + vm.bar._id, newList);
    }

//Update User's info
    vm.updateUserInfo = function(){
        vm.updateInfo = !vm.updateInfo;
    }

    vm.submitUserChanges = function(){
        vm.updateInfo = false;
        $http.put('/users/update/' + vm.bar._id, vm.bar).then(function(response){
            console.log(response);
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
