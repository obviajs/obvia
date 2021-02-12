var GaiaAPI_forms = function(_props){
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
	this.forms = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get all forms or the requested form
		* @param {string} form_guid Form Guid
		* @returns {Promise} 
		*/
    	this.get = function(form_guid){
        let objQuery = {};
		objQuery["form_guid"] = form_guid;

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
                            ret = new (GaiaAPI_forms[responses[resp.status].type])(ret);
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
		*Create or edit a form
		* @param {form} form The request body for post /forms 
		* @returns {Promise} 
		*/
    	this.post = function(form){
        let objQuery = {};

        let objPath = {};

        let objBody = form;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"form"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_forms[responses[resp.status].type])(ret);
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
		*Delete the requested form
		* @param {string} form_guid Form Guid
		* @returns {Promise} 
		*/
    	this.delete = function(form_guid){
        let objQuery = {};
		objQuery["form_guid"] = form_guid;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"404":{"responseType":"JSON","type":"responseStatus"}};
        return new Promise((resolve, reject) =>
        {
            	this.apiCall(objQuery, objBody, objPath, requestContentType, "delete").then(function(resp){
                if(responses[resp.status]){
                    let responseType = responses[resp.status].responseType.toLowerCase();
                    let ret;
                    switch(responseType)
                    {
                        case "json":
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new (GaiaAPI_forms[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/forms";
    };
	this.processes = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns the processes where the form is used
		* @param {string} id_form Form Guid
		* @returns {Promise} 
		*/
    	this.get = function(id_form){
        let objQuery = {};

        let objPath = {};
		objPath["id_form"] = id_form;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcess"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_forms[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/forms/{id_form}/processes";
    };
	this.getFormFields = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get all form fields for the requested form
		* @param {string} form_guid Form Guid
		* @returns {Promise} 
		*/
    	this.get = function(form_guid){
        let objQuery = {};

        let objPath = {};
		objPath["form_guid"] = form_guid;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayFormField"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_forms[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/forms/{form_guid}/getFormFields";
    };

		this.formsClient = new this.forms();
		this.processesClient = new this.processes();
		this.getFormFieldsClient = new this.getFormFields();

};
Poolable.call(GaiaAPI_forms);

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
   GaiaAPI_forms.form = function form(_props){
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


	GaiaAPI_forms.arrayForm = function arrayForm()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["form"]; 
	};
	GaiaAPI_forms.arrayForm.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_forms.arrayForm.prototype.constructor = GaiaAPI_forms.arrayForm;

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_forms.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  counter               - Number of records affected

    */
   GaiaAPI_forms.recordsAffected = function recordsAffected(_props){
        _props = _props || {};
		this.counter = _props.counter;

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
   GaiaAPI_forms.process = function process(_props){
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


	GaiaAPI_forms.arrayProcess = function arrayProcess()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["process"]; 
	};
	GaiaAPI_forms.arrayProcess.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_forms.arrayProcess.prototype.constructor = GaiaAPI_forms.arrayProcess;

    /**
	* @property {Number}  form_field_id               - Form Field ID
	* @property {Number}  id_form_field_type               - Form Field Type ID
	* @property {Number}  id_form               - Form ID
	* @property {String}  label               - Form Field Label
	* @property {String}  field_name               - Form Field Name
	* @property {Number}  required               - is Required
	* @property {String}  field_tip               - Form Field Tip
	* @property {String}  field_help_url               - Form Field Url
	* @property {String}  extradata1               - Form Field Extradata 1
	* @property {String}  extradata2               - Form Field Extradata 2
	* @property {String}  extradata3               - Form Field Extradata 3
	* @property {String}  extradata4               - Form Field Extradata 4
	* @property {Number}  deleted               - is Deleted
	* @property {Number}  visible               - is Visible
	* @property {Number}  enabled               - is Enabled
	* @property {String}  form_field_guid               - Form Field Guid
	* @property {String}  form_guid               - Form Guid
	* @property {String}  tooltip               - Tooltip

    */
   GaiaAPI_forms.form_field = function form_field(_props){
        _props = _props || {};
		this.form_field_id = _props.form_field_id;
		this.id_form_field_type = _props.id_form_field_type;
		this.id_form = _props.id_form;
		this.label = _props.label;
		this.field_name = _props.field_name;
		this.required = _props.required;
		this.field_tip = _props.field_tip;
		this.field_help_url = _props.field_help_url;
		this.extradata1 = _props.extradata1;
		this.extradata2 = _props.extradata2;
		this.extradata3 = _props.extradata3;
		this.extradata4 = _props.extradata4;
		this.deleted = _props.deleted;
		this.visible = _props.visible;
		this.enabled = _props.enabled;
		this.form_field_guid = _props.form_field_guid;
		this.form_guid = _props.form_guid;
		this.tooltip = _props.tooltip;

    };


	GaiaAPI_forms.arrayFormField = function arrayFormField()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["form_field"]; 
	};
	GaiaAPI_forms.arrayFormField.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_forms.arrayFormField.prototype.constructor = GaiaAPI_forms.arrayFormField;
