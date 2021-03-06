var tripController = require('../controller/tripController')();
var express = require('express');
var router = express.Router();


router.post('/create', function(req, res){
    tripController.createTrip(req, res);
});

router.get('/get/:id', function(req, res){
    tripController.getTrip(req, res);
});

router.delete('/delete/:id', function(req, res){
    tripController.deleteTrip(req, res);
});



module.exports = router;