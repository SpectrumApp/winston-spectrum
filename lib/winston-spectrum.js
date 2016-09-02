require('es6-promise').polyfill();
require('isomorphic-fetch');

var uuid = require('node-uuid')

var util = require('util');
var _ = require('lodash');
var winston = require('winston');
var stringifySafe = require('json-stringify-safe');

exports = module.exports = winston.transports.Spectrum = function (options) {

    this.name = options.name || 'SpectrumLogger';

    this.level = options.level || 'info';

    this.url = options.url || 'http://localhost:9000';
};
var Spectrum = winston.transports.Spectrum;

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(Spectrum, winston.Transport);

Spectrum.prototype.safeToString = function(json) {
    try {
        return JSON.stringify(json);
    }
    catch(ex) {
        return stringifySafe(json, null, null, function() { });
    }
};

Spectrum.prototype.log = function (level, msg, meta, callback) {

    if (typeof msg !== 'string' && typeof msg !== 'object') {
        msg = {message: this.safeToString(msg)};
    }
    else if (typeof msg === 'string') {
        msg = {message: msg};
    }

    if (meta instanceof Error) {
        meta = {error: meta.stack || meta.toString()};
    }

    _.assign(msg, {
        level: level,
        meta: meta,
        guid: uuid.v1(),
        timestamp: new Date().toISOString()
    });
    if (meta.sublevel !== undefined) {
        msg.sublevel = meta.sublevel;
    }
    fetch(this.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
    });

    callback(null, true);
};