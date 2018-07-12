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
            url: '/trip/get'
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


})

describe('Viajes End-To-End test', function(){
    let idViaje;
    let trip = {
        name: 'Unit Test End to end',
        description: 'bodyTrip.description',
        duration: 'bodyTrip.duration',
        cities: []
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
        .get("/get")
        .send({id: idViaje})
        .then(res => {
            res.should.have.status(200);
            done();
        })
    });
});