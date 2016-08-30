var constants = {

//SERVER stuff
SERVER_PORT: 8080,

API_REQUEST_TIMEOUT: 20 * 1000, //20 seconds

//LOG Level stuff
LOG_LEVEL_NONE: 0,
LOG_LEVEL_ERROR: 1,
LOG_LEVEL_INFO: 2,
LOG_LEVEL_DEBUG: 3,
LOG_LEVEL: 3,

FIRST_RECORD_PARAM: "first",
LOCAL_METAPAGE: "/meta.html",
CONCORDANCE_MAP_FILE: "/js/concordance.json",
CONCORDANCE_MAP_FIELD: "fieldmap",
CONCORDANCE_MAP_FIELDNAME_FIELD: "fieldName",
CONCORDANCE_MAP_METAFIELDNAME_FIELD: "metaName",
USE_CONCORDANCE_MAP: true, // if it's false it uses the old fieldname matches style

API_QUERY_FIELD: "q",
API_FILTER_FIELD: "filters",

API_SEARCH_ROOT: "https://catalogue.data.gov.bc.ca/api/action/datastore_search",
API_SEARCH_QUERY_PARAMS: {"resource_id": "b12cd4cc-b58b-4079-b630-a20b6df58e8d"},
API_SEARCH_LIMIT_PARAM: "limit",
API_SEARCH_DEFAULT_LIMIT: 100,
API_SEARCH_RESULT_FIELD: ["result", "records"],
API_SEARCH_RESULT_FIELD_DTABLE_SRC: "results",

API_METADATA_ROOT: "https://catalogue.data.gov.bc.ca/api/action/datastore_search",
API_METADATA_QUERY_PARAMS: {"resource_id": "b12cd4cc-b58b-4079-b630-a20b6df58e8d"},
URL_QUERY_PARAM_FIELDS: {"_id": "_id"},
API_METADATA_RESULT_FIELDS_FIELD: ["result", "fields"],
API_METADATA_RESULT_FIELD_VALUES_FIELD: ["result", "records", 0],
URL_TITLE_FIELD: "PROJECT_NAME",
API_FILTER_FIELD: "filters",
RECORD_FIELD_NAME_FIELD: "id",

//NOTE THE FUNCTION TO CHECK IS IN UTILS.JS
FIELD_PREFIX: "PROJECT_",
MULTI_VALUE_SEPARATOR: "|",

//TYPEAHEAD_FIELD_VALUE: "",
TYPEAHEAD_DELAY: 1000, //ms:= 1 second //note this affects query on the database so leave this even if disabling typeahead

ENABLE_TYPEAHEAD: true, //NOTE THAT THIS WILL AFFECT LOAD PERFORMANCE ON SEARCH FOR LARGE DATASETS
TYPEAHEAD_MIN_CHARS: 2, //minimum chars before typeahead kicks in
TYPEAHEAD_COLUMNS: undefined, //YOU CAN DEFINE THIS AS AN ARRAY TO MAKE PERFORMANCE BETTER BY PROCESSING LESS FIELDS IN THE DATA SET. eg: ["PROJECT_DESCRIPTIONS"]
                                        //setting to undefined will cause it to bind to all fields. that are shown in the table.


INTERNAL_COLUMN_SRC: "columns",
SEARCH_ADDITIONAL_TABLE_FIELDS: ["FLNRO_AREA_NAME"],
INTERNAL_SELECT_COLUMNS: {
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
                                }
};

module.exports = constants;