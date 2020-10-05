var GaiaAPI_process_role_status_forms = function(_props){
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
	this.process_role_status_forms = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get the requested form based on the relation guid
		* @param {string} process_role_status_form_guid Proces Role Status Form Guid
		* @returns {Promise} 
		*/
    	this.get = function(process_role_status_form_guid){
        let objQuery = {};
		objQuery["process_role_status_form_guid"] = process_role_status_form_guid;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayPrsForm"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_role_status_forms[responses[resp.status].type])(ret);
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
		*Create or edit a process role status form
		* @param {integer} id_process Process Id
		* @param {array} data Process Role Status Form Object
		* @returns {Promise} 
		*/
    	this.post = function(id_process,data){
        let objQuery = {};
		objQuery["id_process"] = id_process;

        let objPath = {};

        let objBody = {"data":data};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"arrayPrsForm"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_role_status_forms[responses[resp.status].type])(ret);
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
		*Delete the requested relation
		* @param {string} process_role_status_form_guid Process Role Status Form Guid
		* @returns {Promise} 
		*/
    	this.delete = function(process_role_status_form_guid){
        let objQuery = {};
		objQuery["process_role_status_form_guid"] = process_role_status_form_guid;

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
                            ret = new (GaiaAPI_process_role_status_forms[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_role_status_forms";
    };
	this.getProcessForms = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get the requested form based on the relation guid
		* @param {integer} id_process Proces Id
		* @param {integer} id_role Role Id
		* @param {integer} id_status Status Id
		* @returns {Promise} 
		*/
    	this.get = function(id_process,id_role,id_status){
        let objQuery = {};
		objQuery["id_role"] = id_role;
		objQuery["id_status"] = id_status;

        let objPath = {};
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayPrsForm"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_role_status_forms[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_role_status_forms/{id_process}/getProcessForms";
    };

		this.process_role_status_formsClient = new this.process_role_status_forms();
		this.getProcessFormsClient = new this.getProcessForms();

};
Poolable.call(GaiaAPI_process_role_status_forms);

    /**
	* @property {Number}  process_role_status_form_id               - Process Role Status Form Id
	* @property {String}  process_role_status_form_guid               - Process Role Status Form Guid
	* @property {String}  form_guid               - Form Guid
	* @property {String}  form_name               - Form name
	* @property {String}  form_literal_view               - Form Literal View
	* @property {Number}  id_role               - Role ID
	* @property {Number}  id_status               - Status ID
	* @property {Number}  deleted               - Is Deleted
	* @property {Number}  order               - Order

    */
   GaiaAPI_process_role_status_forms.prs_form = function(_props){
        _props = _props || {};
		this.process_role_status_form_id = _props.process_role_status_form_id;
		this.process_role_status_form_guid = _props.process_role_status_form_guid;
		this.form_guid = _props.form_guid;
		this.form_name = _props.form_name;
		this.form_literal_view = _props.form_literal_view;
		this.id_role = _props.id_role;
		this.id_status = _props.id_status;
		this.deleted = _props.deleted;
		this.order = _props.order;

    };


	GaiaAPI_process_role_status_forms.arrayPrsForm = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["prs_form"]; 
		return r;
	};
	GaiaAPI_process_role_status_forms.arrayPrsForm.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_process_role_status_forms.responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  counter               - Number of records affected

    */
   GaiaAPI_process_role_status_forms.recordsAffected = function(_props){
        _props = _props || {};
		this.counter = _props.counter;

    };
