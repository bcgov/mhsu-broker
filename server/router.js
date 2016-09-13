var typeOf = require('typeof');
var logger = require('./logger.js');

var router = function(){
    var metaController = require('./controllers/metaController.js');
    var indexController = require('./controllers/indexController.js');
    var controllers = [metaController, indexController];
    this.routes = {};
    
    for (var i=0; i<controllers.length; i++) {
        var controllerRoot = controllers[i].root;
        var controllerRoutes = controllers[i].routes;
        
        for (var j=0; j<controllerRoutes.length; j++){
            this.routes[controllerRoot+controllerRoutes[j]] = controllers[i];
        }
    }
    
    logger.debug("Supported Routes:");
    logger.debug(this.routes);
};

router.prototype = {
    routes: {},
    controllers: {}
};

router.prototype.getRoute = function(requestUrl){
    var noExt = requestUrl;
    if (noExt.indexOf(".htm") !== -1){
        noExt = noExt.substring(0, noExt.indexOf(".htm"));
    }
    
    logger.debug("Routing for: " + noExt);
    
    if (typeOf(this.routes[noExt]) !== "undefined") {
        var action = noExt.substring(requestUrl.lastIndexOf("/")+1);
        action = (action == "") ? "index" : action;
        
        return {controller: this.routes[noExt], action: action};
        
    }
    
    return false;
    
}

module.exports = new router();