var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');

//Bringing in models for Beer and for newUser
var Beer = require('../models/beerModel');
var User = require('../models/userModel');

//Get stored information from database for one user
router.get('/', function(req, res, next) {
  var username = req.user.username;
    User.findOne({username: username}, function (err, User) {
      res.json(req.user);
    });
});

//Get all bar names
router.get('/names', function(req,res,next){
  User.find({}, {barName: 1, _id:0}, function(err, User){
    res.send(User);
  });
});

//Get information for searched User
router.get('/search/:barName?', function(req, res, next) {
  var barName = req.params.barName;

    User.findOne({barName: barName}, function(err, User){
      res.json(User);
    });
});

//Update the current beer list
router.put('/addBeer/:id?', function(req, res, next) {

  var id = req.params.id;
  var beerList = req.body.beerList;

  User.findOne({_id: id}, function(err, User){
    if(err) throw err;

    User.beerList = beerList;

    User.save(function(err){
      if(err) throw err;
      res.send(200);
    })
  });
});


//Submit a rating for a certain beer and get current avg. rating
router.put('/rate/:id?', function(req, res, next) {
  var id = req.params.id;
  var newRating = req.body.rating;
  var beerName = req.body.beerName;

  User.findOne({_id: id}, function(err, User){
    if(err) throw err;
    var currentList = User.beerList;
    var currentBeer = getCurrentBeer();
  //Loop through beer list to find matching beer name
    function getCurrentBeer() {
      for (var i = 0; i < currentList.length; i++) {
        if (currentList[i].name === beerName) {
          currentBeer = currentList[i];
          User.beerList.splice(i, 1);
          return currentBeer;
        }
      }
    }
    currentBeer.ratingTotal += newRating;
    currentBeer.numOfRatings++;
    var rating = getNewRating(currentBeer.ratingTotal, currentBeer.numOfRatings);

    //Get new rating function
    function getNewRating(ratingTotal, numRatings){
      return (ratingTotal/numRatings).toFixed(2);
    }

    currentBeer.rating = rating;

    User.beerList.push(currentBeer);

    User.save(function(err){
      if(err) throw err;
      res.send(200);
    })
  });
});

//Update the User information
router.put('/update/:id?', function(req, res, next) {
  var id = req.params.id;
  var bar = req.body;
  User.findOne({_id: id}, function(err, User){
    if(err) throw err;

    User.barName = bar.barName;
    User.email = bar.email;
    User.phoneNumber = bar.phoneNumber;
    User.street = bar.street;
    User.city = bar.city;
    User.state = bar.state;
    User.zipcode = bar.zipcode;
    User.description = bar.description;

    User.save(function(err){
      if(err)
        throw err;
      res.send(200);
    })
  });
});

//Drop a bar from the database
router.delete('/delete/:id?', function(req, res, next) {
  var id = req.params.id;

  User.remove({_id: id}, function(err, User){
    if(err) throw err;
    res.send(200);
  });
});

//route to logout the current user
router.get('/logout', function(req, res, next){
  req.logout();
  res.send(200);
});


module.exports = router;