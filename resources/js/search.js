var searchableTableID = "#searchableTable";
var totalRecords = 0;
var typeaheadPossibilities = [];
$(document).ready(function(e){
    var searchURL = getURL(SEARCH_URL_TYPE, {});
    
    $.getJSON( searchURL, function( response ) {
        var fieldNames = response;
        totalRecords = response.result.total;
        var columns = [];
        for(var i=0; i<API_METADATA_RESULT_FIELDS_FIELD.length; i++){
            if (typeof(fieldNames[API_METADATA_RESULT_FIELDS_FIELD[i]]) === "undefined") {
                $('body').html("Error getting information from the api");
                return;
            }
            fieldNames = fieldNames[API_METADATA_RESULT_FIELDS_FIELD[i]];
        }
        for (var i=0; i<fieldNames.length; i++) {
            var fieldName = fieldNames[i][RECORD_FIELD_NAME_FIELD];
            if ((fieldMatch(fieldName)) || (SEARCH_ADDITIONAL_TABLE_FIELDS.indexOf(fieldName) >= 0)) {
                columns.push({data: fieldName});
            }
        }
        
        //typeahead config
        if (ENABLE_TYPEAHEAD){
            var results = response;
            for(var i=0; i<API_SEARCH_RESULT_FIELD.length; i++){
                if (typeof(results[API_SEARCH_RESULT_FIELD[i]]) === "undefined") {
                    break;
                }
                results = results[API_SEARCH_RESULT_FIELD[i]];
            }
            for (var i=0; i<results.length; i++){
                if (typeof(TYPEAHEAD_COLUMNS) === "undefined") {
                    for (var j=0; j<columns.length; j++){
                        typeaheadPossibilities.push(results[i][columns[j].data]);
                    }
                }else{
                    for (var j=0; j<TYPEAHEAD_COLUMNS.length; j++){
                        typeaheadPossibilities.push(results[i][TYPEAHEAD_COLUMNS[j]]);
                    }
                }
            }
        }
        
        initTable(columns);
    });
});

function initTable(columns) {
    var delayedId = {};
    var dTable = $(searchableTableID).DataTable( {
        bSort: false,
        serverSide: true,
        columns: columns,
        ajax: function(data, callback, settings){
            var offset=data.start;
            var query = (typeof(data.search.value) !== "undefined") ? data.search.value : null;
            var url = "";
            
            var urlParams ={offset: offset};
            
            if ( (query !== null) && (query != "") ) {
                urlParams[API_QUERY_FIELD] = query;
            }
            
            
            //note filters take over the query for that column, as they are being more specific
            var filters = {};
            for (var i=0; i<data.columns.length; i++){
                var paramName = data.columns[i].data;
                var value = (typeof(data.columns[i].search.value) !== "undefined") ? data.columns[i].search.value : null;
                if ( (value !== null) && (value != "") ) {
                    filters[paramName] = value;
                }
            }
            
            if (Object.keys(filters).length > 0) {
                urlParams[API_FILTER_FIELD] = JSON.stringify(filters);
            }
            
            var url = getURL(SEARCH_URL_TYPE, urlParams);
            
            $.getJSON(url, function(response){
               var results = response;
        
                for(var i=0; i<API_SEARCH_RESULT_FIELD.length; i++){
                    if (typeof(results[API_SEARCH_RESULT_FIELD[i]]) === "undefined") {
                        return;
                    }
                    results = results[API_SEARCH_RESULT_FIELD[i]];
                }
                
                results = results.slice(0, data.length);
                
                var json = {
                    draw: parseInt(data.draw),
                    data: results,
                    start: offset,
                    recordsFiltered: response.result.total,
                    recordsTotal: totalRecords
                };
                callback(json);
            });
        },
        initComplete: function (settings, json) {
           $(searchableTableID + ' thead tr th').each(function(index, value){
                var columnName = columns[index].data;
                columnName = columnName.replace(/_/g, " ");
                columnArr = columnName.split(" ");
                for (var j=0; j<columnArr.length; j++) {
                    columnArr[j] = columnArr[j].substring(0,1).toUpperCase() + columnArr[j].substring(1).toLowerCase();
                }
                columnName = columnArr.join(" ");
                var ele = "<div>" + columnName + "</div><div>";
                
                if (typeof(INTERNAL_SELECT_COLUMNS[columns[index].data]) !== "undefined") {
                    ele += '<select class="tableFilterSelect ' + index + '"><option value=""></option>';
                        for (var i=0; i<INTERNAL_SELECT_COLUMNS[columns[index].data].length; i++) {
                            ele += '<option value="' + INTERNAL_SELECT_COLUMNS[columns[index].data][i] + '">' + INTERNAL_SELECT_COLUMNS[columns[index].data][i] + '</option>';
                        }
                    ele += '</select>';
                }else{
                  ele += '<input placeholder="' + columns[index].data + '" class="';
                  if (ENABLE_TYPEAHEAD){
                    ele+= "typeahead ";
                  }
                  ele += 'tableFilterText ' + index + '" type="text" />';  
                }
                
                ele += "</div>";
                $(this).html(ele);
           });
           
            $('.tableFilterSelect').on('change', filter);
            $('.tableFilterText').on('keyup', filterDelayed);
            
            if (ENABLE_TYPEAHEAD){
                $('.tableFilterText').bind('typeahead:selected', filterClick);
                var typeaheadBlood = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.whitespace,
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: typeaheadPossibilities
                    });
                $('.tableFilterText').typeahead(
                    {
                        hint: true,
                        highlight: true,
                        minLength: TYPEAHEAD_MIN_CHARS
                    },
                    {
                        source: typeaheadBlood
                    });
                
                $('input[type="search"][aria-controls="'+searchableTableID.substring(1)+'"]').typeahead(
                    {
                        hint: true,
                        highlight: true,
                        minLength: TYPEAHEAD_MIN_CHARS
                    },
                    {
                        source: typeaheadBlood
                    });
                
                $('input[type="search"][aria-controls="'+searchableTableID.substring(1)+'"]').bind('typeahead:selected', queryClick);
            }
        }
    } );
    
    function filterClick(e) {
        filter.bind(this, e);
    }
    
    function filterDelayed(e) {
        var val = $(this).val();
        var className = $(this).attr('class');
        var index = parseInt(className.substring(className.lastIndexOf(" ")+1));
        
        if (typeof(delayedId[index]) !== "undefined") {
            clearTimeout(delayedId[index]);
        }
        
        delayedId[index] = setTimeout(filter.bind(this, e), TYPEAHEAD_DELAY);
        return true;
    }
     
    function filter(e) {
        var val = $(this).val();
        var className = $(this).attr('class');
        var index = className.match(/\d+/)[0];
        dTable.columns(index).search(val).draw();
    }
    
    function queryClick(e) {
        var val = $(this).val();
        dTable.search(val).draw();
    }
}



/*
            for (var i=0; i<columns.length; i++){
               
                
                $(searchableTableID + ' thead tr').append('<th>' + columnName + '</th>');
            }
            */