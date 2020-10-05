var GaiaAPI_process_users = function(_props){
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
	this.roleStatusRights = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns all te rights (view/edit/delete/asign/create/view_all/view_group_cases)
for all the process's statuses the user have access.
		* @param {integer} id_user User id
		* @returns {Promise} 
		*/
    	this.get = function(id_user){
        let objQuery = {};

        let objPath = {};
		objPath["id_user"] = id_user;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"user_processes"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_users/{id_user}/roleStatusRights";
    };
	this.ownerStatusRights = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Return data for all the processes, process's statuses and the rights
that role owner have in each status of processes he has access.
		* @returns {Promise} 
		*/
    	this.get = function(){
        let objQuery = {};

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"user_processes"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_users/ownerStatusRights";
    };
	this.allowedTransitions = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns the allowed transitions of the process for the current user.
		* @param {integer} id_user User id
		* @returns {Promise} 
		*/
    	this.get = function(id_user){
        let objQuery = {};

        let objPath = {};
		objPath["id_user"] = id_user;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"at_user_processes"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_users/{id_user}/allowedTransitions";
    };
	this.processUserRight = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns one specific right
		* @param {integer} id_user User id
		* @param {integer} id_process_case ID of process case
		* @param {string} has_right User's specific role right
		* @returns {Promise} 
		*/
    	this.get = function(id_user,id_process_case,has_right){
        let objQuery = {};
		objQuery["has_right"] = has_right;

        let objPath = {};
		objPath["id_user"] = id_user;
		objPath["id_process_case"] = id_process_case;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"responseObj"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_users/{id_user}/{id_process_case}/processUserRight";
    };
	this.processUserTransition = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Returns one specific allowed transition
		* @param {integer} id_user User id
		* @param {integer} id_process_case ID of process case
		* @returns {Promise} 
		*/
    	this.get = function(id_user,id_process_case){
        let objQuery = {};

        let objPath = {};
		objPath["id_user"] = id_user;
		objPath["id_process_case"] = id_process_case;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"responseObj"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_process_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/process_users/{id_user}/{id_process_case}/processUserTransition";
    };

		this.roleStatusRightsClient = new this.roleStatusRights();
		this.ownerStatusRightsClient = new this.ownerStatusRights();
		this.allowedTransitionsClient = new this.allowedTransitions();
		this.processUserRightClient = new this.processUserRight();
		this.processUserTransitionClient = new this.processUserTransition();

};
Poolable.call(GaiaAPI_process_users);

    /**
	* @property {Number}  can_create               - Can Create
	* @property {Number}  can_assign               - Can Assing
	* @property {Number}  can_delete               - Can Delete
	* @property {Number}  can_edit               - Can Edit
	* @property {Number}  can_view               - Can View
	* @property {Number}  view_all               - Can View All
	* @property {Number}  view_group_cases               - Can View Group Cases

    */
   GaiaAPI_process_users.process_status = function(_props){
        _props = _props || {};
		this.can_create = _props.can_create;
		this.can_assign = _props.can_assign;
		this.can_delete = _props.can_delete;
		this.can_edit = _props.can_edit;
		this.can_view = _props.can_view;
		this.view_all = _props.view_all;
		this.view_group_cases = _props.view_group_cases;

    };



    /**
	* @typedef {Object.<string, process_status>} process_role

    */
   GaiaAPI_process_users.process_role = function(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_process_users.process_status(_props[prop]);
            }
        }
    };



    /**
	* @typedef {Object.<string, process_role>} process

    */
   GaiaAPI_process_users.process = function(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_process_users.process_role(_props[prop]);
            }
        }
    };



    /**
	* @typedef {Object.<string, process>} user_processes

    */
   GaiaAPI_process_users.user_processes = function(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_process_users.process(_props[prop]);
            }
        }
    };

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_process_users.responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  at_user_status_new               - Process Role New Status

    */
   GaiaAPI_process_users.at_status_init = function(_props){
        _props = _props || {};
		this.at_user_status_new = _props.at_user_status_new;

    };



    /**
	* @typedef {Object.<string, at_status_init>} at_process_role

    */
   GaiaAPI_process_users.at_process_role = function(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_process_users.at_status_init(_props[prop]);
            }
        }
    };



    /**
	* @typedef {Object.<string, at_process_role>} at_process

    */
   GaiaAPI_process_users.at_process = function(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_process_users.at_process_role(_props[prop]);
            }
        }
    };



    /**
	* @typedef {Object.<string, at_process>} at_user_processes

    */
   GaiaAPI_process_users.at_user_processes = function(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_process_users.at_process(_props[prop]);
            }
        }
    };

    /**
	* @property {Number}  value               - Name

    */
   GaiaAPI_process_users.responseObj = function(_props){
        _props = _props || {};
		this.value = _props.value;

    };
