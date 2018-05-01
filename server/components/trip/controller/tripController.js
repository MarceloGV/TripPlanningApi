var mongoose = require('mongoose');
const TripModel = require('../model/trip');
var Trip  = mongoose.model('Trip');

const TripController = function(){
    let controller = {};

    controller.createTrip = function(req, res){
        try{
            let bodyTrip = JSON.parse(req.body.trip);
            let trip = new Trip({
                name: bodyTrip.name,
                description: bodyTrip.description,
                duration: bodyTrip.duration,
                cities: []
            });
            trip.save(function(err, trip) {
                if(err) return res.status(500).send(err.message);
                res.status(201).jsonp(trip);
            });
        }
        catch(err) {
            res.status(500).send('Error al crear viaje');
            //throw err;
        };
    }

    return controller;

};

module.exports = TripController;