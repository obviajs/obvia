var GaiaAPI_process_forms = function(_props){
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
	this.process_forms = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get all forms of the process
		* @param {integer} id_form Form id
		* @returns {Promise} 
		*/
    	this.get = function(id_form){
        let objQuery = {};
		objQuery["id_form"] = id_form;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayForm"},"404":{"responseType":"JSON","type":"responseStatus"}};
        return new Promise((resolve, reject) =>
        {
            	this.apiCall(objQuery, objBody, objPath, requestContentType, "get").then(function(resp){
                if(responses[resp.status]){
                    let responseType = responses[resp.status].responseType.toLowerCase();
                    let ret;
                    switch(responseType)
                    {
                        case "json":
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new (GaiaAPI_process_forms[responses[resp.status].type])(ret);
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
    	/**
		*Create or edit a process form
		* @param {arrayProcessForm} data The request body for post /process_forms 
		* @returns {Promise} 
		*/
    	this.post = function(data){
        let objQuery = {};

        let objPath = {};

        let objBody = data;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcessForm"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_forms[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_forms";
    };

		this.process_formsClient = new this.process_forms();

};
Poolable.call(GaiaAPI_process_forms);

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
	* @property {String}  form_guid               - Form's guid

    */
   GaiaAPI_process_forms.form = function form(_props){
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
		this.form_guid = _props.form_guid;

    };


	GaiaAPI_process_forms.arrayForm = function arrayForm()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["form"]; 
	};
	GaiaAPI_process_forms.arrayForm.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_process_forms.arrayForm.prototype.constructor = GaiaAPI_process_forms.arrayForm;

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_process_forms.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  process_form_id               - Process Form Id
	* @property {String}  process_form_guid               - Process Form Guid
	* @property {String}  process_guid               - Process Guid
	* @property {String}  form_guid               - Form Guid
	* @property {Number}  order               - Order
	* @property {Number}  deleted               - Is Deleted

    */
   GaiaAPI_process_forms.process_form = function process_form(_props){
        _props = _props || {};
		this.process_form_id = _props.process_form_id;
		this.process_form_guid = _props.process_form_guid;
		this.process_guid = _props.process_guid;
		this.form_guid = _props.form_guid;
		this.order = _props.order;
		this.deleted = _props.deleted;

    };


	GaiaAPI_process_forms.arrayProcessForm = function arrayProcessForm()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["process_form"]; 
	};
	GaiaAPI_process_forms.arrayProcessForm.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_process_forms.arrayProcessForm.prototype.constructor = GaiaAPI_process_forms.arrayProcessForm;
