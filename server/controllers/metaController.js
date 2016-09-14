var request = require('request');
var typeOf = require('typeof');

var logger = require('../logger.js');
var utils = require('../utils.js');
var constants = require('../constants.js');
var metaController = function(){  
};

metaController.prototype = {
    root: "/",
    routes: ["meta"]
}

metaController.prototype.meta = function(responseObject, parameters){
    var ids = constants.URL_QUERY_PARAM_FIELDS;
    var id_keys = Object.keys(ids);
    
    var headObj = {};
    
    var title = "";
    
    var concordanceMap = null;
    var concordance = null;
    
    for (var i=0; i<id_keys.length; i++){
        ids[id_keys[i]] = (typeOf(parameters[id_keys[i]]) !== "undefined") ? parameters[id_keys[i]] : null;
    }
    
    if (constants.USE_CONCORDANCE_MAP == true){
        concordance = require('../../resources/js/concordance.json');
        if ((typeOf(concordance[constants.CONCORDANCE_MAP_FIELD]) === "undefined")) {
            responseObject.write("Error getting concordance map");
            responseObject.end();
            return;
        }
    }
    
    if (constants.USE_CONCORDANCE_MAP == true) {
        concordanceMap = concordance[constants.CONCORDANCE_MAP_FIELD];
    }
    
    var filters = {};
    filters[constants.API_FILTER_FIELD] = JSON.stringify(ids);
    
    var metaURL = utils.getURL(constants.META_URL_TYPE, filters);
    
    var reqOptions = {
            url: metaURL,
            timeout: constants.API_REQUEST_TIMEOUT,
            //This didn't work the server responded even with this, if it worked I would have stored the response in a json file, and used the modified date of that file to
            //populate this field.
            /*headers: {
                'If-Modified-Since': 'Mon, 30 Aug 2018 12:00:00 GMT'
            }*/
        };
    
    request(reqOptions, function(error, response, body){
        responseObject.writeHead(200, {'Content-Type': 'text/html'});
        var fieldNames = JSON.parse(body);
        var fieldValues = fieldNames;
        
        if (typeOf(response.statusCode) === "undefined") {
            responseObject.write("Error getting information from the api");
            responseObject.end();
            return;
        }
        
        for(var i=0; i<constants.API_METADATA_RESULT_FIELDS_FIELD.length; i++){
            if (typeOf(fieldNames[constants.API_METADATA_RESULT_FIELDS_FIELD[i]]) === "undefined") {
                responseObject.write("Error getting information from the api");
                responseObject.end();
                return;
            }
            fieldNames = fieldNames[constants.API_METADATA_RESULT_FIELDS_FIELD[i]];
        }
        
        for(var i=0; i<constants.API_METADATA_RESULT_FIELD_VALUES_FIELD.length; i++){
            if (typeOf(fieldValues[constants.API_METADATA_RESULT_FIELD_VALUES_FIELD[i]]) === "undefined") {
                responseObject.write("Error getting information from the api");
                responseObject.end();
                return;
            }
            fieldValues = fieldValues[constants.API_METADATA_RESULT_FIELD_VALUES_FIELD[i]];
        }
        
        responseObject.writeHead(200, {"Content-Type" : "text/html"});
        var html = "<!DOCTYPE html><html>";
        var title = constants.METADATA_TITLE_FIELD_OR_CONSTANT;
        var headTag = "";
        var bodyTag = "<body>";
        for (var i=0; i<fieldNames.length; i++){
            var fieldName = fieldNames[i][constants.RECORD_FIELD_NAME_FIELD];
            var fieldValue = fieldValues[fieldName];
            
            if (fieldName == constants.METADATA_TITLE_FIELD_OR_CONSTANT) {
                title = fieldValue;
            }
            
            if (constants.USE_CONCORDANCE_MAP == true) {
                var metaPairs = utils.getMetaPairs(fieldName, fieldValue, concordanceMap);
                
                for (var j=0; j<metaPairs.length; j++){
                    headTag += "<meta name=\"" + metaPairs[j]["name"] + "\" content=\"" + metaPairs[j]["value"] + "\" />";
                }
                
                if (metaPairs.length > 0){    
                    bodyTag += "<div>" + fieldName + ": " + fieldValue + "</div>";
                }
                
                
            }else{//use partial fieldMatch
                if (utils.fieldMatch(fieldName)) {
                    var values = utils.getFieldValues(fieldValue);
                    for (var j=0; j<values.length; j++){
                        headTag += "<meta name=\"" + fieldName + "\" content=\"" + values[j] + "\" />";
                    }
                    
                    bodyTag += "<div>" + fieldName + ": " + fieldValue + "</div>";
                }
            }
        }
        bodyTag += "</body>";
        headTag = "<head><title>" + title + "</title><meta charset=\"UTF-8\" />" + headTag + "</head>";
        html += headTag + bodyTag + "</html>";
        responseObject.write(html);
        responseObject.end();
        
    });
}

module.exports = new metaController();