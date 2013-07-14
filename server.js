/**
 * server.js
 * version: 0.0.2 (2013/07/12)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var REST_PORT = process.env.PORT || 9225;

var WebSocketServer = require('ws').Server
    , log4js = require('log4js')
    , http = require('http')
    , express = require('express')
    , app = express();
var server = http.createServer(app);

// Logger
log4js.configure('./log4js.json');
var logger = log4js.getLogger('dataFile');
logger.setLevel('INFO');

// WebSocket
var wss = new WebSocketServer({server:server});

var connection = null;
wss.on('connection', function(ws) {
    connection = ws;
    ws.on('close', function(code) {
        logger.info("connecton closed: CODE [" + code + "]");
    });
});

// REST API
app.get('/rest/position', function(req, res) {
    var data = {
        lat: req.query.lat,
        lng: req.query.lng
    };
    try {
        connection.send(JSON.stringify(data));
        res.send(200);
    }
    catch (e) {
        // Chromeからのコネクションがない場合
        if (/Cannot call method 'send'/.test(e.message)) {
            logger.info("WebSocket connection is required from Chrome.");
            res.send(404);
        }
        else {
            logger.error(e.stack);
            throw e;
        }
    }
});
server.listen(REST_PORT);