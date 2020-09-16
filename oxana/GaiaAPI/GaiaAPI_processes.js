var GaiaAPI_processes = function(_props){
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
	this.processes = function(apiClient) { 
        apiClient = apiClient || _apiClient;
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
        let responses = {"200":{"responseType":"JSON","type":"arrayProcess"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
	this.getForms = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the forms of the process
		* @param {integer} id_process Proces ID
		* @param {integer} id_role Role ID
		* @param {integer} id_status Status ID
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
        let responses = {"200":{"responseType":"JSON","type":"arrayPrsForm"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
	this.getProcessRoles = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the roles of the process
		* @param {integer} id_process Proces ID
		* @returns {Promise} 
		*/
    	this.get = function(id_process){
        let objQuery = {};

        let objPath = {};
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcessRole"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/processes/{id_process}/getProcessRoles";
    };
	this.loadStatuses = function(apiClient) { 
        apiClient = apiClient || _apiClient;
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
        let responses = {"200":{"responseType":"JSON","type":"arrayStatusCaseCount"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
	this.getCurrentUserProcesses = function(apiClient) { 
        apiClient = apiClient || _apiClient;
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
        let responses = {"200":{"responseType":"JSON","type":"arrayProcess"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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
	this.get_team_members = function(apiClient) { 
        apiClient = apiClient || _apiClient;
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
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new (GaiaAPI_processes[responses[resp.status].type])(ret);
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

		this.processesClient = new this.processes();
		this.getFormsClient = new this.getForms();
		this.getProcessRolesClient = new this.getProcessRoles();
		this.loadStatusesClient = new this.loadStatuses();
		this.getCurrentUserProcessesClient = new this.getCurrentUserProcesses();
		this.get_team_membersClient = new this.get_team_members();

};
Poolable.call(GaiaAPI_processes);

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
   GaiaAPI_processes.process = function(_props){
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


	GaiaAPI_processes.arrayProcess = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["process"]; 
		return r;
	};
	GaiaAPI_processes.arrayProcess.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_processes.responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  counter               - Number of records affected

    */
   GaiaAPI_processes.recordsAffected = function(_props){
        _props = _props || {};
		this.counter = _props.counter;

    };

    /**
	* @property {Number}  process_role_status_form_id               - Process Role Status Form Id
	* @property {String}  process_role_status_form_guid               - Process Role Status Form Guid
	* @property {Number}  id_process               - Process ID
	* @property {String}  guid_form               - Form Guid
	* @property {String}  form_name               - Form name
	* @property {Number}  id_role               - Role ID
	* @property {Number}  id_status               - Status ID
	* @property {Number}  deleted               - Is Deleted
	* @property {Number}  order               - Order

    */
   GaiaAPI_processes.prs_form = function(_props){
        _props = _props || {};
		this.process_role_status_form_id = _props.process_role_status_form_id;
		this.process_role_status_form_guid = _props.process_role_status_form_guid;
		this.id_process = _props.id_process;
		this.guid_form = _props.guid_form;
		this.form_name = _props.form_name;
		this.id_role = _props.id_role;
		this.id_status = _props.id_status;
		this.deleted = _props.deleted;
		this.order = _props.order;

    };


	GaiaAPI_processes.arrayPrsForm = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["prs_form"]; 
		return r;
	};
	GaiaAPI_processes.arrayPrsForm.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {Number}  process_role_id               - Process Role Id
	* @property {String}  process_role_name               - Process Role name
	* @property {String}  process_role_description               - Process Role Description
	* @property {Number}  deleted               - Is Deleted
	* @property {Number}  process_role_type               - Process Role Type
	* @property {Number}  id_user_created               - Id User Created
	* @property {String}  time_created               - Time Created
	* @property {Number}  id_user_modified               - Process name
	* @property {String}  time_modified               - Time Modified

    */
   GaiaAPI_processes.process_role = function(_props){
        _props = _props || {};
		this.process_role_id = _props.process_role_id;
		this.process_role_name = _props.process_role_name;
		this.process_role_description = _props.process_role_description;
		this.deleted = _props.deleted;
		this.process_role_type = _props.process_role_type;
		this.id_user_created = _props.id_user_created;
		this.time_created = _props.time_created;
		this.id_user_modified = _props.id_user_modified;
		this.time_modified = _props.time_modified;

    };


	GaiaAPI_processes.arrayProcessRole = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["process_role"]; 
		return r;
	};
	GaiaAPI_processes.arrayProcessRole.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {Number}  status_id               - Status ID
	* @property {String}  status_name               - Status name
	* @property {Number}  num_cases               - Number of cases with this status

    */
   GaiaAPI_processes.status_case_count = function(_props){
        _props = _props || {};
		this.status_id = _props.status_id;
		this.status_name = _props.status_name;
		this.num_cases = _props.num_cases;

    };


	GaiaAPI_processes.arrayStatusCaseCount = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["status_case_count"]; 
		return r;
	};
	GaiaAPI_processes.arrayStatusCaseCount.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {String}  team_members               - Team names

    */
   GaiaAPI_processes.user_team_members = function(_props){
        _props = _props || {};
		this.team_members = _props.team_members;

    };
