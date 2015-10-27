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
    longStyle:  String,
    shortStyle:  String,
    srm: {
        id: Number,
        hex: Number
    },
    availablity: String,
    rating: Number,
});

var Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;