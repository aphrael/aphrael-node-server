/**
 * server.js
 * version: 0.0.1 (2013/07/05)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

// WebSocket
var WebSocketServer = require('ws').Server,
    httpServer = require('http').createServer();
var server = new WebSocketServer({
    server: httpServer
});

var connections = [];
server.on('connection', function(ws) {
    connections.push(ws); // コネクションプーリング
    ws.on('close', function(code) {
        console.log("connecton closed: CODE [" + code + "]");
        // WebSocketの接続が切れたものはプールから除外
        connections = connections.filter(function(conn) {
            return conn === ws ? false : true;
        });
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
    connections.forEach(function(conn) {
        conn.send(JSON.stringify(data));
    });

    res.send(200);
});
app.listen("9223");