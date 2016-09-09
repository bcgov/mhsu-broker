var typeOf = require('typeof');
var router = require("./router.js");
var logger = require('./logger.js');
var utils = require('./utils.js');
var fs = require ('fs');

var dispatcher = function(){};

dispatcher.prototype = {
    request: {},
    response: {}
};

dispatcher.prototype.dispatch = function(request, response){
    this.request = request;
    this.response = response;
    
    var requestUrl = this.request.url;
    
    if ( (requestUrl.indexOf("css") !== -1) || (requestUrl.indexOf("lib") !== -1) || (requestUrl.indexOf("js") !== -1) || (requestUrl.indexOf("search.html") !== -1) || (requestUrl.indexOf(".txt") !== -1) ){
        var filePath = 'resources' + requestUrl;
        logger.debug("Static file requested: " + filePath);
        fs.readFile(filePath, function(err, content){
            if (err) {
                logger.error("Problem retrieving static file: " + filePath + " \n" + err + "\n returning to control routing");
                return this.handleRequest();
            }else{
                logger.debug("file found + " + filePath);
                response.write(content);
                response.end();
                return true;
            }
        });
    }else{
        return this.handleRequest();
    }
}

dispatcher.prototype.handleRequest = function(){
    
    var requestUrl = this.request.url;
    
    var params = utils.getURLVars(requestUrl);
    requestUrl = (requestUrl.indexOf("?") !== -1) ? requestUrl.substring(0, requestUrl.indexOf("?")) : requestUrl;
    
    logger.debug("Dispatching -- " + requestUrl);
    
    var routeInfo = router.getRoute(requestUrl);

    if ( (typeOf(routeInfo.controller) === "object") && (typeOf(routeInfo.action) === "string") && (typeOf(routeInfo.controller[routeInfo.action]) === "function") ) {
        try{
            routeInfo.controller[routeInfo.action](this.response, params);
            return true;
        }catch(err){
            logger.debug("Dispatcher failed to dispatch, caught error");
            logger.error(err);
            return false;
        }
    }else{
        logger.debug("Dispatcher failed to dispatch, not a controlled route");
        return false;
    }
}

module.exports = new dispatcher();