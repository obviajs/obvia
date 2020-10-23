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
		*Create new role.
		* @param {integer} id_process Process Id
		* @param {arrayProcessRoleProcessUsersGroups} data The request body for post /process_role_processes 
		* @returns {Promise} 
		*/
    	this.post = function(id_process,data){
        let objQuery = {};
		objQuery["id_process"] = id_process;

        let objPath = {};

        let objBody = data;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcessRoleProcessUsersGroups"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
        
        OAMethod.call(this, apiClient);
        this.basePath = _server + "/process_role_processes";
    };

		this.process_role_processesClient = new this.process_role_processes();

};
Poolable.call(GaiaAPI_process_role_processes);

    /**
	* @property {Number}  id_user               - User Id

    */
   GaiaAPI_process_role_processes.users = function(_props){
        _props = _props || {};
		this.id_user = _props.id_user;

    };



    /**
	* @property {Number}  id_group               - Group Id

    */
   GaiaAPI_process_role_processes.groups = function(_props){
        _props = _props || {};
		this.id_group = _props.id_group;

    };



    /**
	* @property {Number}  process_role_process_id               - Process Role Process ID
	* @property {Number}  id_process               - Process ID
	* @property {Number}  id_process_role               - Process Role ID
	* @property {users}  users               - Array of User Ids
	* @property {groups}  groups               - Array of Group Ids
	* @property {Number}  deleted               - Deleted

    */
   GaiaAPI_process_role_processes.process_role_process = function(_props){
        _props = _props || {};
		this.process_role_process_id = _props.process_role_process_id;
		this.id_process = _props.id_process;
		this.id_process_role = _props.id_process_role;
		this.users = _props.users;
		this.groups = _props.groups;
		this.deleted = _props.deleted;

    };


	GaiaAPI_process_role_processes.arrayProcessRoleProcessUsersGroups = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["process_role_process","users","groups"]; 
		return r;
	};
	GaiaAPI_process_role_processes.arrayProcessRoleProcessUsersGroups.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_process_role_processes.responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };
