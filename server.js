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

// TODO
// サーバを再起動したとき、クライアントにどうやって通知するか。
// 現状だとサーバを落とす→サーバ再起動→notify_nodeを実行しても接続が変わっている
// から通信できない。エラー検知もできていない。

var connection = null;
server.on('connection', function(ws) {
    connection = ws;
    ws.on('close', function(code) {
        console.log("connecton closed: CODE [" + code + "]");
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
    connection.send(JSON.stringify(data));
    res.send(200);
});
app.listen("9223");