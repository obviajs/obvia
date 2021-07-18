var GaiaAPI_process_role_processes = function(_props){
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
	this.process_role_processes = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get the requested Process Role Process
		* @param {integer} id_process_role_process Process Role Process ID
		* @returns {Promise} 
		*/
    	this.get = function(id_process_role_process){
        let objQuery = {};
		objQuery["id_process_role_process"] = id_process_role_process;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"process_role_process"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_role_processes[responses[resp.status].type])(ret);
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
		*Create new role.
		* @param {integer} id_process Process Id
		* @param {arrayProcessRoleProcessPrpUserPrpGroup} data The request body for post /process_role_processes 
		* @returns {Promise} 
		*/
    	this.post = function(id_process,data){
        let objQuery = {};
		objQuery["id_process"] = id_process;

        let objPath = {};

        let objBody = data;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcessRoleProcessPrpUserPrpGroup"},"400":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_role_processes[responses[resp.status].type])(ret);
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
		*Delete a role.
		* @param {integer} id_process_role_process Process Role Process Id
		* @returns {Promise} 
		*/
    	this.delete = function(id_process_role_process){
        let objQuery = {};
		objQuery["id_process_role_process"] = id_process_role_process;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"400":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_role_processes[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_role_processes";
    };

		this.process_role_processesClient = new this.process_role_processes();

};
Poolable.call(GaiaAPI_process_role_processes);

    /**
	* @property {Number}  id_user               - User Id
	* @property {String}  username               - User Full Name
	* @property {Number}  deleted               - Is Deleted

    */
   GaiaAPI_process_role_processes.prp_user = function prp_user(_props){
        _props = _props || {};
		this.id_user = _props.id_user;
		this.username = _props.username;
		this.deleted = _props.deleted;

    };


	GaiaAPI_process_role_processes.arrayPrpUser = function arrayPrpUser()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["prp_user"]; 
	};
	GaiaAPI_process_role_processes.arrayPrpUser.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_process_role_processes.arrayPrpUser.prototype.constructor = GaiaAPI_process_role_processes.arrayPrpUser;



    /**
	* @property {Number}  id_group               - Group Id
	* @property {String}  team_name               - Team Name
	* @property {Number}  deleted               - Is Deleted

    */
   GaiaAPI_process_role_processes.prp_group = function prp_group(_props){
        _props = _props || {};
		this.id_group = _props.id_group;
		this.team_name = _props.team_name;
		this.deleted = _props.deleted;

    };


	GaiaAPI_process_role_processes.arrayPrpGroup = function arrayPrpGroup()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["prp_group"]; 
	};
	GaiaAPI_process_role_processes.arrayPrpGroup.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_process_role_processes.arrayPrpGroup.prototype.constructor = GaiaAPI_process_role_processes.arrayPrpGroup;



    /**
	* @property {Number}  process_role_process_id               - Process Role Process ID
	* @property {Number}  id_process               - Process ID
	* @property {Number}  id_process_role               - Process Role ID
	* @property {users}  users               - Array of Role Users
	* @property {groups}  groups               - Array of Role Groups
	* @property {Number}  deleted               - Deleted

    */
   GaiaAPI_process_role_processes.process_role_process = function process_role_process(_props){
        _props = _props || {};
		this.process_role_process_id = _props.process_role_process_id;
		this.id_process = _props.id_process;
		this.id_process_role = _props.id_process_role;
		this.users = _props.users;
		this.groups = _props.groups;
		this.deleted = _props.deleted;

    };

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_process_role_processes.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };
	GaiaAPI_process_role_processes.arrayProcessRoleProcessPrpUserPrpGroup = function arrayProcessRoleProcessPrpUserPrpGroup()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["process_role_process","prp_user","prp_group"]; 
	};
	GaiaAPI_process_role_processes.arrayProcessRoleProcessPrpUserPrpGroup.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_process_role_processes.arrayProcessRoleProcessPrpUserPrpGroup.prototype.constructor = GaiaAPI_process_role_processes.arrayProcessRoleProcessPrpUserPrpGroup;

    /**
	* @property {Number}  counter               - Number of records affected

    */
   GaiaAPI_process_role_processes.recordsAffected = function recordsAffected(_props){
        _props = _props || {};
		this.counter = _props.counter;

    };
