/**
 * server.js
 * version: 0.0.1 (2013/07/05)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var WebSocketServer = require('ws').Server,
    httpServer = require('http').createServer();
var server = new WebSocketServer({
    server: httpServer
});

var connections = [];
server.on('connection', function(ws) {
    connections.push(ws); // コネクションプーリング
    ws.on('close', function() {
        // WebSocketの接続が切れたものはプールから除外
        connections = connections.filter(function(conn) {
            return conn === ws ? false : true;
        });
    });

    ws.on('message', function(message) {
        console.log(message);
        ws.send("return");
    });
});

httpServer.listen("9222");