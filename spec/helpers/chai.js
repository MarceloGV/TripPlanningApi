var chai = require('chai');
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

//inicio el server 
//const app = require('../../bin/www');

//En package.json
//test: C:/Program Files/MongoDB/Server/3.2/bin/mongod.exe && ...