/**
 * server.js
 * version: 0.0.1 (2013/07/05)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

// Logger
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('dataFile');
logger.setLevel('INFO');

// MongoLab
var mongo = require('./mongolab');
mongo.injector({
    logger: logger
});

// WebSocket
var WebSocketServer = require('ws').Server,
    httpServer = require('http').createServer();
var server = new WebSocketServer({
    server: httpServer
});

var connection = null;
server.on('connection', function(ws) {
    connection = ws;
    ws.on('close', function(code) {
        logger.info("connecton closed: CODE [" + code + "]");
    });
});

httpServer.listen("9222");

// REST API
var express = require('express');
var app = express();

app.get('/rest/position', function(req, res) {
    var data = {
        lat: req.query.lat,
        lng: req.query.lng
    };
    try {
        mongo.add(data);
        connection.send(JSON.stringify(data));
        res.send(200);
    }
    catch (e) {
        logger.error(e.message);
        throw e;
    }
});

app.listen("9223");