/**
	* @property {String}  id               - ID
	* @property {String}  field               - Field
	* @property {String}  type               - Type
	* @property {String}  input               - Input
	* @property {String}  operator               - Operator
	* @property {String}  value               - Value
	* @property {String}  self               - Self
	* @property {String}  input_id               - Input ID

    */
var rule = function (_props) {
    _props = _props || {};
    this.id = _props.id;
    this.field = _props.field;
    this.type = _props.type;
    this.input = _props.input;
    this.operator = _props.operator;
    this.value = _props.value;
    this.self = _props.self;
    this.input_id = _props.input_id;

};


var rules = function () {
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["rule"];
    return r;
}



/**
	* @property {String}  condition               - Condition
	* @property {rules}  rules               - Condition
	* @property {boolean}  valid               - Valid

    */
var advancedSqlFilters = function (_props) {
    _props = _props || {};
    this.condition = _props.condition;
    this.rules = _props.rules;
    this.valid = _props.valid;

};



/**
	* @property {String}  data               - Function
	* @property {String}  name               - Name
	* @property {boolean}  searchable               - Is searchable
	* @property {String}  orderable               - Is orderable

    */
var column = function (_props) {
    _props = _props || {};
    this.data = _props.data;
    this.name = _props.name;
    this.searchable = _props.searchable;
    this.orderable = _props.orderable;

};


var columns = function () {
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["column"];
    return r;
}



/**
	* @property {Number}  column               - Column
	* @property {String}  dir               - Direction

    */
var order = function (_props) {
    _props = _props || {};
    this.column = _props.column;
    this.dir = _props.dir;

};


var orders = function () {
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["order"];
    return r;
}



/**
	* @property {columns}  columns               - Column
	* @property {orders}  orders               - Order
	* @property {Number}  currentRecord               - Current Record
	* @property {Number}  recordsPerPage               - Limit

    */
var tableData = function (_props) {
    _props = _props || {};
    this.columns = _props.columns;
    this.orders = _props.orders;
    this.currentRecord = _props.currentRecord;
    this.recordsPerPage = _props.recordsPerPage;

};



/**
	* @property {advancedSqlFilters}  advancedSqlFilters               - Advanced SQL Filters
	* @property {tableData}  tableData               - Table Data

    */
var dvInput = function (_props) {
    _props = _props || {};
    this.advancedSqlFilters = _props.advancedSqlFilters;
    this.tableData = _props.tableData;

};

/**
	* @property {Number}  process_id               - Process ID
	* @property {String}  process_name               - Process name
	* @property {String}  process_code               - Process code
	* @property {String}  process_description               - Process description
	* @property {Number}  id_process_group               - Process Group ID
	* @property {Number}  author_id_user               - Process Author ID
	* @property {String}  date_created               - Process Creation Date
	* @property {Number}  deleted               - Check if process is deleted

    */
var process = function (_props) {
    _props = _props || {};
    this.process_id = _props.process_id;
    this.process_name = _props.process_name;
    this.process_code = _props.process_code;
    this.process_description = _props.process_description;
    this.id_process_group = _props.id_process_group;
    this.author_id_user = _props.author_id_user;
    this.date_created = _props.date_created;
    this.deleted = _props.deleted;

};


var response = function () {
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["process"];
    return r;
}

/**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
var responseStatus = function (_props) {
    _props = _props || {};
    this.status_code = _props.status_code;
    this.status_description = _props.status_description;

};

var GaiaAPI_FrmsDv_dataview = function () {
    let _server = "https://gaia.oxana.io/api";
    Object.defineProperty(this, "server", {
        get: function server() {
            return _server;
        },
        set: function server(x) {
            if (_server != x) {
                _server = x;
            }
        }
    });
    var dataview_pid_7 = function (apiClient) {
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/

        /**
         *This method returns the list of datasources
         * @param {dvInput} dvInput The request body for post /dataview_pid_7 
         * @returns {Promise} 
         */
        this.post = function (dvInput) {
            let objQuery = {};

            let objPath = {};

            let objBody = dvInput;
            let requestContentType = "json";
            let responses = {
                "200": {
                    "responseType": "JSON",
                    "type": "response"
                },
                "404": {
                    "responseType": "JSON",
                    "type": "responseStatus"
                },
                "500": {
                    "responseType": "JSON",
                    "type": "responseStatus"
                }
            };
            return new Promise((resolve, reject) => {
                this.apiCall(objQuery, objBody, objPath, requestContentType, "post").then(function (resp) {
                    if (responses[resp.status]) {
                        let responseType = responses[resp.status].responseType.toLowerCase();
                        let ret;
                        switch (responseType) {
                            case "json":
                                ret = JSON.parse(resp.response);
                                break;
                        }
                        //TODO: convert to specified type
                        resolve(ret);
                    } else //unspecified http response code returned
                        reject();
                }).catch(function (error) {
                    reject(error);
                });
            });
        };

        OAMethod.call(this, apiClient);
        this.basePath = _server + "/dataview_pid_7";
    };

    this.dataview_pid_7Client = new dataview_pid_7();

}