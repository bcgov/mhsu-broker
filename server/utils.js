var constants = require('./constants.js');
var utils = function() {
}

//used on meta page to break multivalued fields based on a delimiter to make multiple meta tags;
//fieldValue is assumed string
utils.prototype.getFieldValues = function(fieldValue) {
    return fieldValue.split(constants.MULTI_VALUE_SEPARATOR);
}

//used on meta page to see if the field matches the required prefix to be shown/added to meta
//fieldName is assumed string (or array);
utils.prototype.fieldMatch = function(fieldName){
    return (fieldName.indexOf(constants.FIELD_PREFIX) == 0);
}

//this is used with the concordance map functionality to build headers.
utils.prototype.getMetaPairs = function(fieldName, fieldValue, concordanceMap) {
    var metaPairs = [];
    
    for (var i=0; i<concordanceMap.length; i++){
        
        if (concordanceMap[i][constants.CONCORDANCE_MAP_FIELDNAME_FIELD] == fieldName) {
            var values = this.getFieldValues(fieldValue);
            for (var j=0; j<values.length; j++) {
                var metaObj = {name: concordanceMap[i][constants.CONCORDANCE_MAP_METAFIELDNAME_FIELD], value: values[j]};
                metaPairs.push(metaObj);   
            }
        }
        
    }
    
    return metaPairs;
}

// Read a page's GET URL variables and return them as an associative array.
utils.prototype.getURLVars = function(requestURL){
    var vars = [], hash;
    var hashes = requestURL.slice(requestURL.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//get the various urls used in the page built with params.
//URL_TYPE must be one of the constants in this file (see top)
//params is assumed object of key/value pairs
utils.prototype.getURL = function(URL_TYPE, params) {
    if (typeof(params) === "undefined") {
        params = {};
    }
    
    var url = constants.API_SEARCH_ROOT;
    var constantPARAMS = {};
    
    //get url based on param, defaulted to search;
    if (URL_TYPE == constants.SEARCH_URL_TYPE){
        url = constants.API_SEARCH_ROOT;
        constantPARAMS = constants.API_SEARCH_QUERY_PARAMS;
    }else if (URL_TYPE == constants.META_URL_TYPE) {
        url = constants.API_METADATA_ROOT;
        constantPARAMS = constants.API_METADATA_QUERY_PARAMS;
    }
    
    if (url == "") {
        throw "getURL requires a valid URL type, got: " + typeof(URL_TYPE) + ((typeof(URL_TYPE) === "string") ? " - URL_TYPE" : ""); 
    }
    
    url += "?";
    
    var queryParamKeys = Object.keys(constantPARAMS);
    for (var i=0; i<queryParamKeys.length; i++){
        url += queryParamKeys[i] + "=" + constantPARAMS[queryParamKeys[i]] + "&";
    }
    
    var paramKeys = Object.keys(params);
    for (var i=0; i<paramKeys.length; i++){
        url += paramKeys[i] + "=" + params[paramKeys[i]] + "&";
    }
    
    if (URL_TYPE == constants.SEARCH_URL_TYPE){
        url += constants.API_SEARCH_LIMIT_PARAM + "=" + constants.API_SEARCH_DEFAULT_LIMIT;
    }else{
        url = url.substring(0, url.length-1); //trunc trailing & or ?
    }
    
    return url;
}

module.exports = new utils();