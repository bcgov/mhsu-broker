$(document).ready(function(e){
    
    var params = getURLVars();
    
    var offset=0;
    if (typeof(params[FIRST_RECORD_PARAM]) !== "undefined"){
        offset = parseInt(params[FIRST_RECORD_PARAM]);
    }
    
    var searchURL = getURL(SEARCH_URL_TYPE, {"offset": offset});
    
    $.getJSON(searchURL, function(response){
        
        var results = response;
        
        for(var i=0; i<API_SEARCH_RESULT_FIELD.length; i++){
            if (typeof(results[API_SEARCH_RESULT_FIELD[i]]) === "undefined") {
                $('body').html("Error getting information from the api");
                return;
            }
            results = results[API_SEARCH_RESULT_FIELD[i]];
        }
        
        for (var i=0; i<results.length; i++) {
            var ele = "<div><a href=\"";
            var href=LOCAL_METAPAGE+"?";
            var urlQueryParamKeys = Object.keys(URL_QUERY_PARAM_FIELDS);
            for (var j=0; j<urlQueryParamKeys.length; j++){
                if (typeof(results[i][urlQueryParamKeys[j]]) !== "undefined") {
                    href += urlQueryParamKeys[j] + "=" + results[i][urlQueryParamKeys[j]] + "&";
                }
            }
            href = href.substring(0, href.length-1); //this will trim the ? or the & as needed
            
            ele += href + "\">" + ( (typeof(results[i][URL_TITLE_FIELD]) !== "undefined" ) ? results[i][URL_TITLE_FIELD] : href) + "</a></div>";
            $('body').append(ele);
        }
        
        var prevRecord = offset - API_SEARCH_DEFAULT_LIMIT;
        if (prevRecord < 0) {
            prevRecord = 0;
        }
        //previous link
        if ((offset > 0) && (prevRecord > 0)) {
            $('body').append("<a href=\"/?first=" + prevRecord + "\">Previous</a> ");
        }else if ((offset > 0) && (prevRecord == 0)){
            $('body').append("<a href=\"/\">Previous</a> ");
        }
        
        var totalResults = response.result.total;
        
        var nextRecord = offset + results.length;
        //next link
        if ( (typeof(totalResults !== "undefined")) && (nextRecord < totalResults) ){
            $('body').append("<a href=\"/?"+FIRST_RECORD_PARAM + "=" + nextRecord + "\">Next</a>");
        }
        
    });
    
});