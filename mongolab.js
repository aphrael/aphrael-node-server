/**
 * mongolab.js
 * (feature branch only)
 * version: 0.0.1 (2013/07/09)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */


var MongoLab = function() {
   this.init.call(this);
};

MongoLab.prototype.init = function() {
    this.connect();
};

MongoLab.prototype.injector = function(container) {
    this.logger = container.logger;
};

MongoLab.prototype.connect = function() {
    var fs = require('fs');
    var config = fs.readFileSync(__dirname + '/mongolab.json');
    var data = JSON.parse(config);
    this.http = require('https');
    this.options = {
        host: 'api.mongolab.com',
        port: 443,
        path: '/api/1/databases/' + data.database + '/collections/' + data.collection + "?apiKey=" + data.apikey
    };
};

MongoLab.prototype.add = function(sendData) {
    var self = this;

    this.options.headers = {
        'Content-Type': "application/json"
    };
    this.options.method = 'POST';
    sendData.datetime = new Date();

    var request = this.http.request(this.options, function(response) {
        response.on('data', function(chunk) {
            self.logger.debug(JSON.parse(chunk));
        }).on('error', function(e) {
            self.logger.error(e.stack);
        });
    });

    request.on('timeout', function(e) {
        self.logger.error(e.message);
        request.abort();
        self.connect();
    });

    request.write(JSON.stringify(sendData));
    request.end();
};

MongoLab.prototype.remove = function(cond) {
    // 未実装予定
};

MongoLab.prototype.search = function(cond) {

};

MongoLab.prototype.limit = function(n) {
    return this;
};


module.exports = new MongoLab();