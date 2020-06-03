
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
    var rule = function(_props){
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


var rules = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["rule"]; 
    return r;
}



    /**
	* @property {String}  condition               - Condition
	* @property {rules}  rules               - Condition
	* @property {boolean}  valid               - Valid

    */
    var advancedSqlFilters = function(_props){
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
    var column = function(_props){
        _props = _props || {};
		this.data = _props.data;
		this.name = _props.name;
		this.searchable = _props.searchable;
		this.orderable = _props.orderable;

    };


var columns = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["column"]; 
    return r;
}



    /**
	* @property {Number}  column               - Column
	* @property {String}  dir               - Direction

    */
    var order = function(_props){
        _props = _props || {};
		this.column = _props.column;
		this.dir = _props.dir;

    };


var orders = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["order"]; 
    return r;
}



    /**
	* @property {columns}  columns               - Column
	* @property {orders}  orders               - Table Data
	* @property {Number}  currentRecord               - Current Record
	* @property {Number}  recordsPerPage               - Limit

    */
    var tableData = function(_props){
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
    var dvInput = function(_props){
        _props = _props || {};
		this.advancedSqlFilters = _props.advancedSqlFilters;
		this.tableData = _props.tableData;

    };

    /**
	* @property {Number}  form_id               - Form's ID
	* @property {String}  form_name               - Form Name
	* @property {String}  description               - Form's Description
	* @property {Number}  deleted               - Is Deleted
	* @property {Number}  author_id_user               - Form's Author ID
	* @property {String}  form_help_url               - Form's URL
	* @property {String}  date_created               - Form's Creation Date
	* @property {String}  date_modified               - Form's Modified Date
	* @property {Number}  id_form_type               - Form's Type ID
	* @property {String}  form_literal               - Form's Literal
	* @property {String}  form_literal_view               - Form's literal view

    */
    var form = function(_props){
        _props = _props || {};
		this.form_id = _props.form_id;
		this.form_name = _props.form_name;
		this.description = _props.description;
		this.deleted = _props.deleted;
		this.author_id_user = _props.author_id_user;
		this.form_help_url = _props.form_help_url;
		this.date_created = _props.date_created;
		this.date_modified = _props.date_modified;
		this.id_form_type = _props.id_form_type;
		this.form_literal = _props.form_literal;
		this.form_literal_view = _props.form_literal_view;

    };


var response = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["form"]; 
    return r;
}

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
    var responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

var GaiaAPI_DV_forms = function(){
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
	var dataview_pid_1 = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns the list of forms
		* @param {dvInput} dvInput The request body for post /dataview_pid_1 
		* @returns {Promise} 
		*/
    	this.post = function(dvInput){
        let objQuery = {};

        let objPath = {};

        let objBody = dvInput;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"response"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
        return new Promise((resolve, reject) =>
        {
            	this.apiCall(objQuery, objBody, objPath, requestContentType, "post").then(function(resp){
                if(responses[resp.status]){
                    let responseType = responses[resp.status].responseType.toLowerCase();
                    let ret;
                    switch(responseType)
                    {
                        case "json":
                            ret = JSON.parse(resp.response);
                            break;
                    }
                    //TODO: convert to specified type
                    resolve(ret);
                }else//unspecified http response code returned
                    reject();
            }).catch(function(error){
                reject(error);
            });
        });
    	};
        
        OAMethod.call(this, apiClient);
        this.basePath = _server + "/dataview_pid_1";
    };

	 this.dataview_pid_1Client = new dataview_pid_1();

    }