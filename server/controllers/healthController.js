var request = require('request');
var typeOf = require('typeof');

var logger = require('../logger.js');
var constants = require ('../constants.js');
var utils = require('../utils.js');

var healthController = function(){
}

healthController.prototype = {
    root: "/",
    routes: ["health"]
}

healthController.prototype.health = function(responseObject, parameters){

    logger.debug("Health - alive");
    responseObject.writeHead(200, {'Content-Type': 'text/html'});
    responseObject.write('<!DOCTYPE html><html><head>');
    responseObject.write('<body><h1>ok</h1></body>');
    responseObject.end();
}

module.exports = new healthController();
