var GaiaAPI_process_roles = function(_props){
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
	this.process_roles = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Create new role.
		* @param {string} role_name process_role name
		* @param {string} role_description user's description
		* @returns {Promise} 
		*/
    	this.post = function(role_name,role_description){
        let objQuery = {};

        let objPath = {};

        let objBody = {"role_name":role_name,"role_description":role_description};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"process_role"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
		* @param {integer} id_process_role process_role id
		* @returns {Promise} 
		*/
    	this.delete = function(id_process_role){
        let objQuery = {};
		objQuery["id_process_role"] = id_process_role;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles";
    };
	this.addProcessRole = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Add a role for the process
		* @param {integer} id_process_role process_role id
		* @param {integer} id_process process id
		* @returns {Promise} 
		*/
    	this.post = function(id_process_role,id_process){
        let objQuery = {};

        let objPath = {};

        let objBody = {"id_process_role":id_process_role,"id_process":id_process};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"process_role"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/addProcessRole";
    };
	this.removeProcessRole = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Remove a role form the process.
		* @param {integer} id_process_role process_role id
		* @param {integer} id_process process id
		* @returns {Promise} 
		*/
    	this.get = function(id_process_role,id_process){
        let objQuery = {};

        let objPath = {};
		objPath["id_process_role"] = id_process_role;
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/{id_process_role}/{id_process}/removeProcessRole";
    };
	this.addGroup = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Add a new group for the role specified.
		* @param {process_add_group} process_add_group The request body for post /process_roles/addGroup 
		* @returns {Promise} 
		*/
    	this.post = function(process_add_group){
        let objQuery = {};

        let objPath = {};

        let objBody = process_add_group;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"process_role_group"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/addGroup";
    };
	this.removeGroup = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Remove group for the role specified.
		* @param {integer} id_process_role process_role id
		* @param {integer} teams Team id
		* @returns {Promise} 
		*/
    	this.get = function(id_process_role,teams){
        let objQuery = {};

        let objPath = {};
		objPath["id_process_role"] = id_process_role;
		objPath["teams"] = teams;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/{id_process_role}/{teams}/removeGroup";
    };
	this.assignMembers = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Assign new members for the role.
		* @param {add_role_user} add_role_user The request body for post /process_roles/assignMembers 
		* @returns {Promise} 
		*/
    	this.post = function(add_role_user){
        let objQuery = {};

        let objPath = {};

        let objBody = add_role_user;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"process_role_user"},"400":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/assignMembers";
    };
	this.removeMembers = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Remove members form the role.
		* @param {rmv_role_user} rmv_role_user The request body for post /process_roles/removeMembers 
		* @returns {Promise} 
		*/
    	this.post = function(rmv_role_user){
        let objQuery = {};

        let objPath = {};

        let objBody = rmv_role_user;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/removeMembers";
    };
	this.processUserRoles = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns user roles
		* @param {integer} id_user User id
		* @param {integer} id_process ID of process
		* @returns {Promise} 
		*/
    	this.get = function(id_user,id_process){
        let objQuery = {};

        let objPath = {};
		objPath["id_user"] = id_user;
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcessRole"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/{id_user}/{id_process}/processUserRoles";
    };
	this.processUserGroups = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns user roles
		* @param {integer} id_user User id
		* @param {integer} id_process ID of process
		* @returns {Promise} 
		*/
    	this.get = function(id_user,id_process){
        let objQuery = {};

        let objPath = {};
		objPath["id_user"] = id_user;
		objPath["id_process"] = id_process;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayProcessRoleGroup"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_roles[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_roles/{id_user}/{id_process}/processUserGroups";
    };

		this.process_rolesClient = new this.process_roles();
		this.addProcessRoleClient = new this.addProcessRole();
		this.removeProcessRoleClient = new this.removeProcessRole();
		this.addGroupClient = new this.addGroup();
		this.removeGroupClient = new this.removeGroup();
		this.assignMembersClient = new this.assignMembers();
		this.removeMembersClient = new this.removeMembers();
		this.processUserRolesClient = new this.processUserRoles();
		this.processUserGroupsClient = new this.processUserGroups();

};
Poolable.call(GaiaAPI_process_roles);

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
   GaiaAPI_process_roles.process_role = function(_props){
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

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_process_roles.responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  counter               - Number of records affected

    */
   GaiaAPI_process_roles.recordsAffected = function(_props){
        _props = _props || {};
		this.counter = _props.counter;

    };
	GaiaAPI_process_roles.arrayNumber = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["Number"]; 
		return r;
	};
	GaiaAPI_process_roles.arrayNumber.prototype = Object.create(ArrayEx.prototype);



    /**
	* @property {Number}  id_process_role               - Process Role Id
	* @property {team}  team               - Team Ids Array

    */
   GaiaAPI_process_roles.process_add_group = function(_props){
        _props = _props || {};
		this.id_process_role = _props.id_process_role;
		this.team = _props.team;

    };

    /**
	* @property {Number}  process_role_group_id               - Process Role Group Id
	* @property {Number}  id_process_role               - Process Role Id
	* @property {Number}  id_team               - Team Id
	* @property {Number}  deleted               - Is Deleted

    */
   GaiaAPI_process_roles.process_role_group = function(_props){
        _props = _props || {};
		this.process_role_group_id = _props.process_role_group_id;
		this.id_process_role = _props.id_process_role;
		this.id_team = _props.id_team;
		this.deleted = _props.deleted;

    };

    /**
	* @property {Number}  id_process_role               - Process Role Id
	* @property {users}  users               - User Ids Array

    */
   GaiaAPI_process_roles.add_role_user = function(_props){
        _props = _props || {};
		this.id_process_role = _props.id_process_role;
		this.users = _props.users;

    };

    /**
	* @property {Number}  process_role_user_id               - Process Role User Id
	* @property {Number}  id_user               - User Id
	* @property {Number}  id_process_role               - Process Role Id
	* @property {Number}  deleted               - Is Deleted

    */
   GaiaAPI_process_roles.process_role_user = function(_props){
        _props = _props || {};
		this.process_role_user_id = _props.process_role_user_id;
		this.id_user = _props.id_user;
		this.id_process_role = _props.id_process_role;
		this.deleted = _props.deleted;

    };

    /**
	* @property {Number}  id_process_role               - Process Role Id
	* @property {users}  users               - User Ids Array

    */
   GaiaAPI_process_roles.rmv_role_user = function(_props){
        _props = _props || {};
		this.id_process_role = _props.id_process_role;
		this.users = _props.users;

    };
	GaiaAPI_process_roles.arrayProcessRole = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["process_role"]; 
		return r;
	};
	GaiaAPI_process_roles.arrayProcessRole.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_process_roles.arrayProcessRoleGroup = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["process_role_group"]; 
		return r;
	};
	GaiaAPI_process_roles.arrayProcessRoleGroup.prototype = Object.create(ArrayEx.prototype);
