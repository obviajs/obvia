var GaiaAPI_dataview_pid_6 = function(_props){
    let _defaultParams = {
        server: "https://gaia.oxana.io/api"
    };

    _props = extend(false, false, _defaultParams, _props);
    let _server = _props.server, _apiClient = _props.apiClient ? _props.apiClient : new ApiClient(), _self = this;
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

    Object.defineProperty(this, "apiClient", {
        get: function apiClient() {
            return _apiClient;
        },
        set: function apiClient(x) {
            if (_apiClient != x) {
                _apiClient = x;
            }
        }
    });
	this.dataview_pid_6 = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the list of datasources
		* @param {dvInput} dvInput The request body for post /dataview_pid_6 
		* @returns {Promise} 
		*/
    	this.post = function(dvInput){
        let objQuery = {};

        let objPath = {};

        let objBody = dvInput;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcess"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
        return new Promise((resolve, reject) =>
        {
            	this.apiCall(objQuery, objBody, objPath, requestContentType, "post").then(function(resp){
                if(responses[resp.status]){
                    let responseType = responses[resp.status].responseType.toLowerCase();
                    let ret;
                    switch(responseType)
                    {
                        case "json":
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new (GaiaAPI_dataview_pid_6[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/dataview_pid_6";
    };

		this.dataview_pid_6Client = new this.dataview_pid_6();

};
Poolable.call(GaiaAPI_dataview_pid_6);

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
   GaiaAPI_dataview_pid_6.rule = function rule(_props){
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


	GaiaAPI_dataview_pid_6.arrayRule = function arrayRule()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["rule"]; 
	};
	GaiaAPI_dataview_pid_6.arrayRule.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_dataview_pid_6.arrayRule.prototype.constructor = GaiaAPI_dataview_pid_6.arrayRule;



    /**
	* @property {String}  condition               - Condition
	* @property {rules}  rules               - Condition
	* @property {boolean}  valid               - Valid

    */
   GaiaAPI_dataview_pid_6.advancedSqlFilters = function advancedSqlFilters(_props){
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
   GaiaAPI_dataview_pid_6.column = function column(_props){
        _props = _props || {};
		this.data = _props.data;
		this.name = _props.name;
		this.searchable = _props.searchable;
		this.orderable = _props.orderable;

    };


	GaiaAPI_dataview_pid_6.arrayColumn = function arrayColumn()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["column"]; 
	};
	GaiaAPI_dataview_pid_6.arrayColumn.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_dataview_pid_6.arrayColumn.prototype.constructor = GaiaAPI_dataview_pid_6.arrayColumn;



    /**
	* @property {Number}  column               - Column
	* @property {String}  dir               - Direction

    */
   GaiaAPI_dataview_pid_6.order = function order(_props){
        _props = _props || {};
		this.column = _props.column;
		this.dir = _props.dir;

    };


	GaiaAPI_dataview_pid_6.arrayOrder = function arrayOrder()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["order"]; 
	};
	GaiaAPI_dataview_pid_6.arrayOrder.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_dataview_pid_6.arrayOrder.prototype.constructor = GaiaAPI_dataview_pid_6.arrayOrder;



    /**
	* @property {columns}  columns               - Column
	* @property {orders}  orders               - Order
	* @property {Number}  currentRecord               - Current Record
	* @property {Number}  recordsPerPage               - Limit

    */
   GaiaAPI_dataview_pid_6.tableData = function tableData(_props){
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
   GaiaAPI_dataview_pid_6.dvInput = function dvInput(_props){
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
   GaiaAPI_dataview_pid_6.process = function process(_props){
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


	GaiaAPI_dataview_pid_6.arrayProcess = function arrayProcess()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["process"]; 
	};
	GaiaAPI_dataview_pid_6.arrayProcess.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_dataview_pid_6.arrayProcess.prototype.constructor = GaiaAPI_dataview_pid_6.arrayProcess;

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_dataview_pid_6.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };
