var fetchMock = require('fetch-mock');
var sinon  = require('sinon');
var assert = require('assert');
var winston = require('winston');
var winstonSpectrum = require('../lib/winston-spectrum');

describe('winston-spectrum', function() {

    var URL = 'http://localhost:9500';

    describe('send string as log message', function () {
        var logSpy = sinon.spy();

        before(function(done){
            fetchMock.post(URL, 201);
            winston.add(winston.transports.Spectrum, {
                level: 'debug',
                name: 'logger1',
                url: URL
            });

            done();
        });

        after(function(done) {
            winston.remove('logger1');
            fetchMock.restore();
            done();
        });


        it('builds the log object properly', function (done) {
            var logMessage = 'Just a test message';
            var errorMessage = 'Big problem';
            winston.log('warn', logMessage, new Error(errorMessage));

            assert(fetchMock.called(URL) === true);
            var loggedObject = JSON.parse(fetchMock.lastOptions(URL).body);
            assert(loggedObject.message === logMessage);
            assert(loggedObject.level === 'warn');
            assert(typeof loggedObject.meta === 'object');
            assert(typeof loggedObject.meta.error === 'string');
            assert(loggedObject.meta.error.indexOf(errorMessage) >= 0);

            done();
        });

        it('send the sublevel', function (done) {
            var logMessage = 'Just a test message';
            var errorMessage = 'Big problem';
            winston.log('warn', logMessage, {sublevel: 'my sublevel'});

            assert(fetchMock.called(URL) === true);

            var loggedObject = JSON.parse(fetchMock.lastOptions(URL).body);
            assert(loggedObject.message === logMessage);
            assert(loggedObject.level === 'warn');
            assert(loggedObject.sublevel === 'my sublevel');
            assert(typeof loggedObject.meta === 'object');

            done();
        });
    });

});