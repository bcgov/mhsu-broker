var constants = require('./constants.js');

var logger = function(){
};

logger.prototype = {
    month : [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ]
};


logger.prototype.error = function(varValue){
    if (constants.LOG_LEVEL >= constants.LOG_LEVEL_ERROR) {
        var date = new Date();
        var dateString = this.month[(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(dateString, "ERROR:", varValue);
    }
}

logger.prototype.info = function(varValue){
    if (constants.LOG_LEVEL >= constants.LOG_LEVEL_INFO) {
        var date = new Date();
        var dateString = this.month[(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(dateString, "INFO:", varValue);
    }
}

logger.prototype.debug = function(varValue){
    if (constants.LOG_LEVEL >= constants.LOG_LEVEL_DEBUG) {
        var date = new Date();
        var dateString = this.month[(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(dateString, "DEBUG:", varValue);
    }
}

module.exports = new logger();