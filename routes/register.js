/**
 * Created by Dave on 10/19/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../models/userModel');

router.get('/', function(req,res,next){
    res.render(path.join(__dirname, '../views/register'));
});

router.post('/', function(req, res, next){
    User.create(req.body, function(err,post){
        if(err) next(err);
        else
            res.redirect('/');
    })
});

module.exports = router;