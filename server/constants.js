var constants = function(){};

//SERVER stuff
constants.prototype.SERVER_PORT = (process.env.SERVER_PORT) ? process.env.SERVER_PORT : 8080;

constants.prototype.API_REQUEST_TIMEOUT = (process.env.API_REQUEST_TIMEOUT) ? process.env.API_REQUEST_TIMEOUT : 20 * 1000; //20 seconds

//LOG Level stuff
constants.prototype.LOG_LEVEL_NONE =  0;
constants.prototype.LOG_LEVEL_ERROR = 1;
constants.prototype.LOG_LEVEL_INFO = 2;
constants.prototype.LOG_LEVEL_DEBUG = 3;
constants.prototype.LOG_LEVEL = (process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : constants.prototype.LOG_LEVEL_DEBUG;

constants.prototype.FIRST_RECORD_PARAM = (process.env.FIRST_RECORD_PARAM) ? process.env.FIRST_RECORD_PARAM : "first";
constants.prototype.LOCAL_METAPAGE = (process.env.LOCAL_METAPAGE) ? process.env.LOCAL_METAPAGE : "/meta.html";
constants.prototype.CONCORDANCE_MAP_FILE = (process.env.CONCORDANCE_MAP_FILE) ? process.env.CONCORDANCE_MAP_FILE : "/js/concordance.json";
constants.prototype.CONCORDANCE_MAP_FIELD = (process.env.CONCORDANCE_MAP_FIELD) ? process.env.CONCORDANCE_MAP_FIELD : "fieldmap";
constants.prototype.CONCORDANCE_MAP_FIELDNAME_FIELD = (process.env.CONCORDANCE_MAP_FIELDNAME_FIELD) ? process.env.CONCORDANCE_MAP_FIELDNAME_FIELD : "fieldName";
constants.prototype.CONCORDANCE_MAP_METAFIELDNAME_FIELD = (process.env.CONCORDANCE_MAP_METAFIELDNAME_FIELD) ? process.env.CONCORDANCE_MAP_METAFIELDNAME_FIELD : "metaName";
constants.prototype.USE_CONCORDANCE_MAP = (process.env.USE_CONCORDANCE_MAP) ? process.env.USE_CONCORDANCE_MAP : true; // if it's false it uses the old fieldname matches style

constants.prototype.API_QUERY_FIELD = (process.env.API_QUERY_FIELD) ? process.env.API_QUERY_FIELD : "q";
constants.prototype.API_FILTER_FIELD = (process.env.API_FILTER_FIELD) ? process.env.API_FILTER_FIELD : "filters";

constants.prototype.INDEX_TITLE = (process.env.INDEX_TITLE) ? process.env.INDEX_TITLE : "BCDC Data Broker";
constants.prototype.API_SEARCH_ROOT = (process.env.API_SEARCH_ROOT) ? process.env.API_SEARCH_ROOT : "https://catalogue.data.gov.bc.ca/api/action/datastore_search";
constants.prototype.API_SEARCH_QUERY_PARAMS = (process.env.API_SEARCH_QUERY_PARAMS) ? process.env.API_SEARCH_QUERY_PARAMS : {"resource_id": "9922eb53-cda2-45ee-96c1-95aa49eb824a"};
constants.prototype.API_SEARCH_LIMIT_PARAM = (process.env.API_SEARCH_LIMIT_PARAM) ? process.env.API_SEARCH_LIMIT_PARAM : "limit";
constants.prototype.API_SEARCH_DEFAULT_LIMIT = (process.env.API_SEARCH_DEFAULT_LIMIT) ? process.env.API_SEARCH_DEFAULT_LIMIT : 100;
constants.prototype.API_SEARCH_RESULT_FIELD = (process.env.API_SEARCH_RESULT_FIELD) ? process.env.API_SEARCH_RESULT_FIELD : ["result", "records"];
constants.prototype.API_SEARCH_RESULT_FIELD_DTABLE_SRC = (process.env.API_SEARCH_RESULT_FIELD_DTABLE_SRC) ? process.env.API_SEARCH_RESULT_FIELD_DTABLE_SRC : "results";

constants.prototype.API_METADATA_ROOT = (process.env.API_METADATA_ROOT) ? process.env.API_METADATA_ROOT : "https://catalogue.data.gov.bc.ca/api/action/datastore_search";
constants.prototype.API_METADATA_QUERY_PARAMS = (process.env.API_METADATA_QUERY_PARAMS) ? process.env.API_METADATA_QUERY_PARAMS : {"resource_id": "9922eb53-cda2-45ee-96c1-95aa49eb824a"};
constants.prototype.URL_QUERY_PARAM_FIELDS = (process.env.URL_QUERY_PARAM_FIELDS) ? process.env.URL_QUERY_PARAM_FIELDS : {"_id": "_id"};
constants.prototype.API_METADATA_RESULT_FIELDS_FIELD = (process.env.API_METADATA_RESULT_FIELDS_FIELD) ? process.env.API_METADATA_RESULT_FIELDS_FIELD : ["result", "fields"];
constants.prototype.API_METADATA_RESULT_FIELD_VALUES_FIELD = (process.env.API_METADATA_RESULT_FIELD_VALUES_FIELD) ? process.env.API_METADATA_RESULT_FIELD_VALUES_FIELD : ["result", "records", 0];
constants.prototype.URL_TITLE_FIELD = (process.env.URL_TITLE_FIELD) ? process.env.URL_TITLE_FIELD : "SV_NAME";
constants.prototype.METADATA_TITLE_FIELD_OR_CONSTANT = (process.env.METADATA_TITLE_FIELD_OR_CONSTANT) ? process.env.METADATA_TITLE_FIELD_OR_CONSTANT : "SV_NAME";
constants.prototype.API_FILTER_FIELD = (process.env.API_FILTER_FIELD) ? process.env.API_FILTER_FIELD : "filters";
constants.prototype.RECORD_FIELD_NAME_FIELD = (process.env.RECORD_FIELD_NAME_FIELD) ? process.env.RECORD_FIELD_NAME_FIELD : "id";

//NOTE THE FUNCTION TO CHECK IS IN UTILS.JS
constants.prototype.FIELD_PREFIX = (process.env.FIELD_PREFIX) ? process.env.FIELD_PREFIX : "SV_";
constants.prototype.MULTI_VALUE_SEPARATOR = (process.env.MULTI_VALUE_SEPARATOR) ? process.env.MULTI_VALUE_SEPARATOR : "|";

//TYPEAHEAD_FIELD_VALUE = (process.env.) ? process.env. : "",
constants.prototype.TYPEAHEAD_DELAY = (process.env.TYPEAHEAD_DELAY) ? process.env.TYPEAHEAD_DELAY : 1000; //ms:= 1 second //note this affects query on the database so leave this even if disabling typeahead

constants.prototype.ENABLE_TYPEAHEAD = (process.env.ENABLE_TYPEAHEAD) ? process.env.ENABLE_TYPEAHEAD : true; //NOTE THAT THIS WILL AFFECT LOAD PERFORMANCE ON SEARCH FOR LARGE DATASETS
constants.prototype.TYPEAHEAD_MIN_CHARS = (process.env.TYPEAHEAD_MIN_CHARS) ? process.env.TYPEAHEAD_MIN_CHARS : 2; //minimum chars before typeahead kicks in
constants.prototype.TYPEAHEAD_COLUMNS = (process.env.TYPEAHEAD_COLUMNS) ? process.env.TYPEAHEAD_COLUMNS : undefined; //YOU CAN DEFINE THIS AS AN ARRAY TO MAKE PERFORMANCE BETTER BY PROCESSING LESS FIELDS IN THE DATA SET. eg = (process.env.) ? process.env. : ["PROJECT_DESCRIPTIONS"]
                                        //setting to undefined will cause it to bind to all fields. that are shown in the table.


constants.prototype.INTERNAL_COLUMN_SRC = (process.env.INTERNAL_COLUMN_SRC) ? process.env.INTERNAL_COLUMN_SRC : "columns";
constants.prototype.SEARCH_ADDITIONAL_TABLE_FIELDS = (process.env.SEARCH_ADDITIONAL_TABLE_FIELDS) ? process.env.SEARCH_ADDITIONAL_TABLE_FIELDS : ["FLNRO_AREA_NAME"];
constants.prototype.INTERNAL_SELECT_COLUMNS = (process.env.INTERNAL_SELECT_COLUMNS) ? process.env.INTERNAL_SELECT_COLUMNS : {
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

module.exports = new constants();