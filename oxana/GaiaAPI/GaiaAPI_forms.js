
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


var formArray = function()
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
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  counter               - Number of records affected

    */
    var recordsAffected = function(_props){
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
    var process = function(_props){
		this.process_id = _props.process_id;
		this.process_name = _props.process_name;
		this.process_code = _props.process_code;
		this.process_description = _props.process_description;
		this.id_process_group = _props.id_process_group;
		this.author_id_user = _props.author_id_user;
		this.date_created = _props.date_created;
		this.deleted = _props.deleted;

    };


var response = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["process"]; 
    return r;
}

var GaiaAPI_forms = function(){
        let _server = "http://flower-gaia/api";
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
	var forms = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*Get all forms or the requested form
		* @param {integer} id_form Form id
		* @returns {Promise} 
		*/
    	this.get = function(id_form){
        let objQuery = {};
		objQuery["id_form"] = id_form;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"formArray"},"404":{"responseType":"JSON","type":"responseStatus"}};
        return new Promise((resolve, reject) =>
        {
            	this.apiCall(objQuery, objBody, objPath, requestContentType, "get").then(function(resp){
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
    	/**
		*Create or edit a form
		* @param {form} form The request body for post /forms 
		* @returns {Promise} 
		*/
    	this.post = function(form){
        let objQuery = {};

        let objPath = {};

        let objBody = {"form":form};
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
    	/**
		*Delete the requested form
		* @param {integer} id_form Form id
		* @returns {Promise} 
		*/
    	this.delete = function(id_form){
        let objQuery = {};

        let objPath = {};
		objPath["id_form"] = id_form;

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
        this.basePath = _server + "/forms";
    };
	var processes = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*Returns the processes where the form is used
		* @param {integer} id_form Form id
		* @returns {Promise} 
		*/
    	this.get = function(id_form){
        let objQuery = {};

        let objPath = {};
		objPath["id_form"] = id_form;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"response"},"404":{"responseType":"JSON","type":"responseStatus"}};
        return new Promise((resolve, reject) =>
        {
            	this.apiCall(objQuery, objBody, objPath, requestContentType, "get").then(function(resp){
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
        this.basePath = _server + "/forms/{id_form}/processes";
    };

	 this.formsClient = new forms();
	 this.processesClient = new processes();

    }