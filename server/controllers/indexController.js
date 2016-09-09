var request = require('request');
var typeOf = require('typeof');

var logger = require('../logger.js');
var constants = require ('../constants.js');
var utils = require('../utils.js');

var indexController = function(){
}

indexController.prototype = {
    root: "/",
    routes: ["", "index"]
}

indexController.prototype.index = function(responseObject, parameters){
    responseObject.write('<!DOCTYPE html><html><head>');
    responseObject.write('<meta charset="UTF-8">');
    var offset=0;
    if (typeOf(parameters[constants.FIRST_RECORD_PARAM]) !== "undefined"){
        offset = parseInt(parameters[constants.FIRST_RECORD_PARAM]);
    }
    logger.debug("Index - Offset: " + offset);
    
    var searchURL = utils.getURL(constants.SEARCH_URL_TYPE, {"offset": offset});
    
    logger.debug("Index - Search URL: " + searchURL);
    
    var searchResponse = "";
    
    var reqOptions = {
            url: searchURL,
            timeout: constants.API_REQUEST_TIMEOUT,
            //This didn't work the server responded even with this, if it worked I would have stored the response in a json file, and used the modified date of that file to
            //populate this field.
            /*headers: {
                'If-Modified-Since': 'Mon, 30 Aug 2018 12:00:00 GMT'
            }*/
        };
    
    request(reqOptions, function(error, response, body){
        responseObject.writeHead(200, {'Content-Type': 'text/html'});
        logger.debug("--Index search url results--");
        if (typeOf(response.statusCode) === "undefined") {
            responseObject.write("Error getting information from the api");
            responseObject.end();
            return;
        }
        logger.debug('STATUS: ' + response.statusCode);
        logger.debug('HEADERS: ' + JSON.stringify(response.headers));
        
        var baseResponse = JSON.parse(body);
        var results = baseResponse;
        
        for(var i=0; i<constants.API_SEARCH_RESULT_FIELD.length; i++){
            if (typeOf(results[constants.API_SEARCH_RESULT_FIELD[i]]) === "undefined") {
                responseObject.write("Error getting information from the api");
                responseObject.end();
                return;
            }
            results = results[constants.API_SEARCH_RESULT_FIELD[i]];
        }
        
        for (var i=0; i<results.length; i++) {
            var ele = "<div><a href=\"";
            var href=constants.LOCAL_METAPAGE+"?";
            var urlQueryParamKeys = Object.keys(constants.URL_QUERY_PARAM_FIELDS);
            for (var j=0; j<urlQueryParamKeys.length; j++){
                if (typeOf(results[i][urlQueryParamKeys[j]]) !== "undefined") {
                    href += urlQueryParamKeys[j] + "=" + results[i][urlQueryParamKeys[j]] + "&";
                }
            }
            href = href.substring(0, href.length-1); //this will trim the ? or the & as needed
            
            ele += href + "\">" + ( (typeOf(results[i][constants.URL_TITLE_FIELD]) !== "undefined" ) ? results[i][constants.URL_TITLE_FIELD] : href) + "</a></div>";
            responseObject.write(ele);
        }
        
        var prevRecord = offset - constants.API_SEARCH_DEFAULT_LIMIT;
        if (prevRecord < 0) {
            prevRecord = 0;
        }
        //previous link
        if ((offset > 0) && (prevRecord > 0)) {
            responseObject.write("<a href=\"/?first=" + prevRecord + "\">Previous</a> ");
        }else if ((offset > 0) && (prevRecord == 0)){
            responseObject.write("<a href=\"/\">Previous</a> ");
        }
        
        var totalResults = baseResponse.result.total;
        
        var nextRecord = offset + results.length;
        //next link
        if ( (typeOf(totalResults !== "undefined")) && (nextRecord < totalResults) ){
           responseObject.write("<a href=\"/?"+constants.FIRST_RECORD_PARAM + "=" + nextRecord + "\">Next</a>");
        }
        
        responseObject.write("</body></html>");
        responseObject.end(); 
    });
    
}

module.exports = new indexController();