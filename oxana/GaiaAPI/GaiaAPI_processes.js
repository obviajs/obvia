
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


var response = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["process"]; 
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

    /**
	* @property {Number}  counter               - Number of records affected

    */
    var recordsAffected = function(_props){
        _props = _props || {};
		this.counter = _props.counter;

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
	* @property {Number}  status_id               - Status ID
	* @property {String}  status_name               - Status name
	* @property {Number}  num_cases               - Number of cases with this status

    */
    var statusArray = function(_props){
        _props = _props || {};
		this.status_id = _props.status_id;
		this.status_name = _props.status_name;
		this.num_cases = _props.num_cases;

    };


var response = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = ["statusArray"]; 
    return r;
}
var response = function()
{
    let r = ArrayEx.apply(this, arguments);
    r.memberType = []; 
    return r;
}

    /**
	* @property {String}  team_members               - Team names

    */
    var user_team_members = function(_props){
        _props = _props || {};
		this.team_members = _props.team_members;

    };

var GaiaAPI_processes = function(){
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
	var processes = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns the required process or all the processes
		* @param {integer} id_process Process id
		* @returns {Promise} 
		*/
    	this.get = function(id_process){
        let objQuery = {};
		objQuery["id_process"] = id_process;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"response"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
		*This method creates a process
		* @param {process} process The request body for post /processes 
		* @returns {Promise} 
		*/
    	this.post = function(process){
        let objQuery = {};

        let objPath = {};

        let objBody = process;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"process"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
		*This method deletes a process
		* @param {integer} id_process Proces ID
		* @returns {Promise} 
		*/
    	this.delete = function(id_process){
        let objQuery = {};
		objQuery["id_process"] = id_process;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/processes";
    };
	var getForms = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns the forms of the process
		* @param {integer} id_process Proces ID
		* @returns {Promise} 
		*/
    	this.get = function(id_process){
        let objQuery = {};

        let objPath = {};
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"response"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/processes/{id_process}/getForms";
    };
	var loadStatuses = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns all the statuses of the process that the current
user can see
		* @param {integer} id_process Proces ID
		* @returns {Promise} 
		*/
    	this.get = function(id_process){
        let objQuery = {};

        let objPath = {};
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"response"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/processes/{id_process}/loadStatuses";
    };
	var getCurrentUserProcesses = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns the processes of the current user
		* @returns {Promise} 
		*/
    	this.get = function(){
        let objQuery = {};

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"response"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/processes/getCurrentUserProcesses";
    };
	var get_team_members = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns the members of the team
		* @param {integer} id_process Proces ID
		* @param {integer} user_id User ID
		* @returns {Promise} 
		*/
    	this.get = function(id_process,user_id){
        let objQuery = {};
		objQuery["user_id"] = user_id;

        let objPath = {};
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"user_team_members"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/processes/{id_process}/get_team_members";
    };

	 this.processesClient = new processes();
	 this.getFormsClient = new getForms();
	 this.loadStatusesClient = new loadStatuses();
	 this.getCurrentUserProcessesClient = new getCurrentUserProcesses();
	 this.get_team_membersClient = new get_team_members();

    }