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
            trip.save()
            .then( trip => {
                res.status(201).jsonp(trip);
            })
            .catch(err =>{
                return res.status(500).send(err.message);
            });
        }
        catch(err) {
            res.status(500).send('Error al crear viaje');
        };
    }

    controller.getTrip = function(req, res){
        Trip.findById(req.params.id)
        .then(trip => {
            res.status(200).jsonp(trip);
        })
        .catch(err => {
            return res.status(500).send('Error al intentar obetener viaje');
        })
    }

    return controller;

};

module.exports = TripController;