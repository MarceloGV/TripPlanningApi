var tripController = require('../controller/tripController')();
var express = require('express');
var router = express.Router();


router.post('/create', function(req, res){
    tripController.createTrip(req, res);
});


module.exports = router;