/**
 * Created by Dave on 10/17/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var beerSchema = new Schema({
    brewery: String,
    name:  String,
    ibu: Number,
    abv:  Number,
    description:  String,
    image: String,
    style:  String,
    srm: Number,
    availablity: String,
    ratingTotal: Number,
    numOfRatings: Number,
    rating: Number
});

var Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;