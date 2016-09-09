var typeOf = require('typeof');
var fs = require('fs');

var env = function(){
    
    process.env.NODE_ENV = (typeOf(process.env.NODE_ENV) !== "undefined") ? process.env.NODE_ENV : ( (typeOf(process.argv[2]) === "string") ? process.argv[2] : 'local' );
    //have to use logs as we don't want to force constant initialization
    console.log("Initializing env: " + process.env.NODE_ENV);
    var filePath = '../config/' + process.env.NODE_ENV + ".json";
    try{
        var config = require(filePath);
        for (var key in config){
            if (config.hasOwnProperty(key)) {
                process.env[key] = config[key];
            }
        }
    }catch(ex){
        console.log("Failed to load config, default values will be used");
        console.log("Exception was: ", ex);
    }
    var constants = require('./constants.js');
    var logger = require('./logger.js');
    logger.debug("Environment--");
    logger.debug(process.env);
};

module.exports = new env();