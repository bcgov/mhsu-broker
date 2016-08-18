$(document).ready(function(e){
    
    var params = getURLVars();
    
    var ids = URL_QUERY_PARAM_FIELDS;
    var id_keys = Object.keys(ids);
    
    var title = "";
    
    for (var i=0; i<id_keys.length; i++){
        ids[id_keys[i]] = (typeof(params[id_keys[i]]) !== "undefined") ? params[id_keys[i]] : null;
    }
    
    title = ids[id_keys[0]];
    
    $('title').html(title);
    
    var filters = {};
    filters[API_FILTER_FIELD] = JSON.stringify(ids);
    
    var metaURL = getURL(META_URL_TYPE, filters);
    
    $.getJSON(metaURL, function(response){
        var fieldNames = response;
        var fieldValues = response;
        
        for(var i=0; i<API_METADATA_RESULT_FIELDS_FIELD.length; i++){
            if (typeof(fieldNames[API_METADATA_RESULT_FIELDS_FIELD[i]]) === "undefined") {
                $('body').html("Error getting information from the api");
                return;
            }
            fieldNames = fieldNames[API_METADATA_RESULT_FIELDS_FIELD[i]];
        }
        
        for(var i=0; i<API_METADATA_RESULT_FIELD_VALUES_FIELD.length; i++){
            if (typeof(fieldValues[API_METADATA_RESULT_FIELD_VALUES_FIELD[i]]) === "undefined") {
                $('body').html("Error getting information from the api");
                return;
            }
            fieldValues = fieldValues[API_METADATA_RESULT_FIELD_VALUES_FIELD[i]];
        }
        
        for (var i=0; i<fieldNames.length; i++) {
            var fieldName = fieldNames[i][RECORD_FIELD_NAME_FIELD];
            if (fieldMatch(fieldName)) {
                var fieldValue = fieldValues[fieldName];
                var values = getFieldValues(fieldValue);
                
                for (var j=0; j<values.length; j++){
                    var headEle = "<meta name=\"" + fieldName + "\" value=\"" + values[j] + "\">";
                    $('head').append(headEle);
                }
                
                var bodyEle = "<div>" + fieldName + ": " + fieldValue + "</div>";
                $('body').append(bodyEle);
            }
        }
        
    });
    
});