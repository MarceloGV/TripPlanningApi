const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    name: String ,
    description: String,
    duration: String ,
    cities: [{
        name: String,
        position: {
            lat: String,
            long: String,
        },
        country: String,
        description: String,
        places: [{
            name: String,
            position: {
                lat: String,
                long: String,
            },
            descrition: String
        }]
    }]
});

module.exports = mongoose.model('Trip', tripSchema);