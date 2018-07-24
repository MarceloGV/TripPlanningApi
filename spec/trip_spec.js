const tripController = require('../server/components/trip').TripController();
const chai = require('chai');
const chaiHttp = require("chai-http");
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const http_mocks = require('node-mocks-http');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert; 
const mongoose = require('mongoose');
const TripModel = require('../server/components/trip/model/trip');
const Trip  = mongoose.model('Trip');
const base_url = 'http://localhost:3000/trip';
chai.use(chaiHttp);

describe('Trip UT', function(){
    this.timeout(2000);
    function buildResponse() {
        return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter });
    }
    it('Create ok', function(done){
        let tripObj = {
            name: 'Unit Test',
            description: 'bodyTrip.description',
            duration: 'bodyTrip.duration',
            cities: []
        }
        let tripSave = sinon.stub(Trip.prototype, 'save').resolves({id: 'ok'});
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'POST',
            url: 'api/trip/create',
            body: {trip: JSON.stringify(tripObj)}
        }); 

        response.on('end', function() {            
            Trip.prototype.save.calledOnce.should.be.eql(true);
            response.statusCode.should.be.eql(201);
            tripSave.restore();
            done();
        });

        tripController.createTrip(request, response);
    });

    it('Create response error', function(done){
        let tripObj = {
            name: 'Unit Test',
            description: 'bodyTrip.description',
            duration: 'bodyTrip.duration',
            cities: []
        }
        let tripSave = sinon.stub(Trip.prototype, 'save').rejects('error');
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'POST',
            url: 'api/trip/create',
            body: {trip: JSON.stringify(tripObj)}
        }); 

        response.on('end', function() {            
            Trip.prototype.save.calledOnce.should.be.eql(true);
            response.statusCode.should.be.eql(500);
            tripSave.restore();
            done();
        });

        tripController.createTrip(request, response);
    });

    it('Create catch error', function(done){
        let tripObj = {
            name: 'Unit Test',
            description: 'bodyTrip.description',
            duration: 'bodyTrip.duration',
            cities: []
        }
        let tripSave = sinon.stub(Trip.prototype, 'save').rejects('error');
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'POST',
            url: '/trip/create',
            body: {trip: JSON.stringify(tripObj)}
        }); 

        response.on('end', function() {            
            Trip.prototype.save.calledOnce.should.be.eql(true);
            response.statusCode.should.be.eql(500);
            tripSave.restore();
            done();
        });

        tripController.createTrip(request, response);
    });

    it('Obtener viaje Error', function(done){
        //let tripGet = sinon.stub(Trip.prototype, 'findById').yields(null, {id: 'asdf'});
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'GET',
            params: {id: '5ae8e6d5af9fdf1ad05a3eaf'},
            url: '/trip/get'
        });
        var TripMock = sinon.mock(Trip);
        TripMock
        .expects('findById')
        .withArgs('5ae8e6d5af9fdf1ad05a3eaf')
        .chain('exec')
        .rejects('error');
        
        
        response.on('end', function(){
            TripMock.restore();
            response.statusCode.should.be.eql(500);
            done();
        });

        tripController.getTrip(request, response);
    });

    it('Obtener viaje', function(done){
        //let tripGet = sinon.stub(Trip.prototype, 'findById').yields(null, {id: 'asdf'});
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'GET',
            params: {id: '5ae8e6d5af9fdf1ad05a3eaf'},
            url: '/trip/get/:id'
        });
        var TripMock = sinon.mock(Trip);
        TripMock
        .expects('findById')
        .withArgs('5ae8e6d5af9fdf1ad05a3eaf')
        .chain('exec')
        .resolves({id: '5ae8e6d5af9fdf1ad05a3eaf'});

        response.on('end', function(){
            TripMock.restore();
            response.statusCode.should.be.eql(200);
            //assert.equal(response, {id: '5ae8e6d5af9fdf1ad05a3eaf'});
            done();
        });

        tripController.getTrip(request, response);
    });

    it('Eliminar Viaje', function(done){
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'DELETE',
            params: {id: '5ae8e6d5af9fdf1ad05a3eaf'},
            url: '/trip/delete/5ae8e6d5af9fdf1ad05a3eaf'
        });
        var TripMock = sinon.mock(Trip);
        TripMock
        .expects('deleteOne')
        .withArgs({_id :'5ae8e6d5af9fdf1ad05a3eaf'})
        .chain('exec')
        .resolves('Ok');

        response.on('end', function(){
            TripMock.restore();
            response.statusCode.should.be.eql(200);
            done();
        });

        tripController.deleteTrip(request, response);
    });

    it('Eliminar Viaje(Error)', function(done){
        let response = buildResponse();
        let request = http_mocks.createRequest({
            method: 'DELETE',
            params: {id: '5ae8e6d5af9fdf1ad05a3eaf'},
            url: '/trip/delete/5ae8e6d5af9fdf1ad05a3eaf'
        });
        var TripMock = sinon.mock(Trip);
        TripMock
        .expects('deleteOne')
        .withArgs({_id :'5ae8e6d5af9fdf1ad05a3eaf'})
        .chain('exec')
        .rejects('Fail');

        response.on('end', function(){
            TripMock.restore();
            response.statusCode.should.be.eql(500);
            done();
        });

        tripController.deleteTrip(request, response);
    });
})

describe('Viajes End-To-End test', function(){
    let idViaje;
    let trip = {
        name: "Codigo Rutero" ,
        description: "Viaje a lo largo de la argentina",
        duration: "6 meses" ,
        cities: [{
            name: "Sierra de la Ventana",
            position: {
                lat: "-38.256831238",
                long: "-54.578165666",
            },
            country: "Argentina",
            description: "Sierra de la Ventana, Buenos Aires",
            places: [{
                name: "Cerro Bahía Blanca",
                position: {
                    lat: "-38.256831238",
                long: "-54.578165666"
                },
                descrition: "Cerro de 500 m de altura."
            }]
        }]
    }
    it('Crear viaje(válido)', function(done){
        chai.request(base_url)
        .post("/create")
        .send({trip: JSON.stringify(trip)})
        .then(res =>{   
            idViaje = res.body._id;                  
            res.should.have.status(201);
            done();
        })
    });

    it('Obtener viaje creado', function(done){
        chai.request(base_url)
        .get("/get/" + idViaje)
        .send({id: idViaje})
        .then(res => {
            res.body.cities.length.should.be.above(0);
            res.body.cities[0].places.length.should.be.equal(1);
            res.should.have.status(200);
            done();
        })
    });

     it('Eliminar trip', function(done){
        chai.request(base_url)
        .delete("/delete/" + idViaje)
        .then(res => {
            res.should.have.status(200);
            done();
        });
    });
});