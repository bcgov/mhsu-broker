var FIRST_RECORD_PARAM = "first";
var LOCAL_METAPAGE = "/meta.html";
var CONCORDANCE_MAP_FILE = "/js/concordance.json";
var CONCORDANCE_MAP_FIELD = "fieldmap";
var CONCORDANCE_MAP_FIELDNAME_FIELD = "fieldName";
var CONCORDANCE_MAP_METAFIELDNAME_FIELD = "metaName";
var USE_CONCORDANCE_MAP = true; // note that EVEN if this is false concordance.json MUST exist AND be valid JSON, if it's false it uses the old fieldname matches style

var API_QUERY_FIELD = "q";
var API_FILTER_FIELD = "filters";

var API_SEARCH_ROOT = "https://cat.data.gov.bc.ca/api/action/datastore_search";
var API_SEARCH_QUERY_PARAMS = {"resource_id": "3edf2c73-9ed0-42c4-81b0-24871aab08e3"};
var API_SEARCH_LIMIT_PARAM = "limit";
var API_SEARCH_DEFAULT_LIMIT = 100;
var API_SEARCH_RESULT_FIELD = ["result", "records"];
var API_SEARCH_RESULT_FIELD_DTABLE_SRC = "results";

var API_METADATA_ROOT = "https://cat.data.gov.bc.ca/api/action/datastore_search";
var API_METADATA_QUERY_PARAMS = {"resource_id": "3edf2c73-9ed0-42c4-81b0-24871aab08e3"};
var URL_QUERY_PARAM_FIELDS = {"_id": "_id"};
var API_METADATA_RESULT_FIELDS_FIELD = ["result", "fields"];
var API_METADATA_RESULT_FIELD_VALUES_FIELD = ["result", "records", 0];
var URL_TITLE_FIELD = "RG_NAME";
var API_FILTER_FIELD = "filters";
var RECORD_FIELD_NAME_FIELD = "id";

//NOTE THE FUNCTION TO CHECK IS IN UTILS.JS
var FIELD_PREFIX = "PROJECT_";
var MULTI_VALUE_SEPARATOR = "| ";

//var TYPEAHEAD_FIELD_VALUE = "";
var TYPEAHEAD_DELAY = 1000; //ms == 1 second //note this affects query on the database so leave this even if disabling typeahead

var ENABLE_TYPEAHEAD = true; //NOTE THAT THIS WILL AFFECT LOAD PERFORMANCE ON SEARCH FOR LARGE DATASETS
var TYPEAHEAD_MIN_CHARS = 2; //minimum chars before typeahead kicks in
var TYPEAHEAD_COLUMNS = undefined; //YOU CAN DEFINE THIS AS AN ARRAY TO MAKE PERFORMANCE BETTER BY PROCESSING LESS FIELDS IN THE DATA SET. eg: ["PROJECT_DESCRIPTIONS"]
                                        //setting to undefined will cause it to bind to all fields. that are shown in the table.


var INTERNAL_COLUMN_SRC = "columns";
var SEARCH_ADDITIONAL_TABLE_FIELDS = ["FLNRO_AREA_NAME"];
var INTERNAL_SELECT_COLUMNS = {
                                "FLNRO_AREA_NAME": [
                                                    "South",
                                                    "North",
                                                    "Coast"
                                                    ],
                                "PROJECT_TYPE": [
                                                 "Clean Energy",
                                                 "Major Mines",
                                                 "Pipelines & Facilities",
                                                 "Resort Development",
                                                 "Utilities",
                                                 "Other"
                                                 ]
                                };