/**
 * Created by Dave on 10/17/15.
 */
var express = require('express');
var router = express.Router();
var Beer = require('../models/beerModel');
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('06f89ce688a765970d48b89517def36c');

router.get('/search/:beerName?', function(req, res, next) {
    var beer = req.params.beerName;
    brewdb.search.beers({ q: beer, withBreweries: "Y" }, function(err, beer){
        if(err) throw err;
        res.send(beer);
    });
});

module.exports = router;
