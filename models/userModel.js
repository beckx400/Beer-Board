/**
 * Created by Dave on 10/19/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 12;

var UserSchema = new Schema({
    username: {type: String, required: true, index:{unique: true}},
    password: {type: String, require: true},
    barName: String,
    email: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    zipcode: Number,
    description: String,
    beerList: Array
});

//Create Salts
UserSchema.pre('save', function(next){
   var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});

//Method to compare passwords
UserSchema.methods.comparePassword = function(candidatePassword, callBack){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return callBack(err);
        callBack(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;