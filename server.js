//Lets require/import the HTTP module
var http = require('http');
var https = require('https');
var dispatcher = require('httpdispatcher');
var typeOf = require('typeof');

var constants = require('./server/constants.js');
var logger = require('./server/logger.js');
var crawlDispatcher = require('./server/dispatcher.js');



//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStaticDirname('.');
dispatcher.setStatic('resources');

dispatcher.onError(function(request, response){
    logger.error("Unable to match request");
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.write("<h2>404</h2><p>We're sorry we can't find the requested page.</p>");
    response.end();
});

//Lets use our dispatcher
function handleRequest(request, response){
    var successfulDispatch = crawlDispatcher.dispatch(request, response);
    if (successfulDispatch == false){
        logger.debug("sending to default dispatcher");
        dispatcher.dispatch(request, response);
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(constants.SERVER_PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    logger.info("Server listening on: http://localhost:" + constants.SERVER_PORT);
});