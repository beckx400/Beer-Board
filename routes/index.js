var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

  ////////////////////////////////////
 ///      Render ng-views         ///
////////////////////////////////////
/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Beer Board' });
});
//get home view
router.get('/home', function(req,res,next){
  res.render('home');
});
//get credits view
router.get('/credits', function(req,res,next){
  res.render('credits');
});
//get about view
router.get('/about', function(req,res,next){
  res.render('about');
});
//get admin view if authenticated user
router.get('/admin', function(req,res,next){
    if (req.user)
        res.render('admin');
    else
        res.send(401, 'Unauthorized');
});

  ///////////////////////////////////////////////
 ///Login and authenticate user unless !user////
///////////////////////////////////////////////
router.post('/login',function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (! user) {
            return res.send({ success : false, message : 'authentication failed' });
        }
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.send({ success : true, message : 'authentication succeeded' });
        });
    })(req, res, next);
});



module.exports = router;
