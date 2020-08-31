
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
* @property {Number}  id_status_new               - Users Process Role New Status

*/
var at_user_process_role_status_new = function(_props){
    _props = _props || {};
    this.id_status_new = _props.id_status_new;

};


var id_status_init = function()
{
let r = ArrayEx.apply(this, arguments);
r.memberType = ["at_user_process_role_status_new"]; 
return r;
};



/**
* @property {id_status_init}  id_status_init               - Array of User Process Role Statuses

*/
var at_user_process_role_status_init = function(_props){
    _props = _props || {};
    this.id_status_init = _props.id_status_init;

};


var id_process_role = function()
{
let r = ArrayEx.apply(this, arguments);
r.memberType = ["at_user_process_role_status_init","at_user_process_role_status_new"]; 
return r;
};



/**
* @property {id_process_role}  id_process_role               - Array of User Process Roles

*/
var at_user_process_roles = function(_props){
    _props = _props || {};
    this.id_process_role = _props.id_process_role;

};


var id_process = function()
{
let r = ArrayEx.apply(this, arguments);
r.memberType = ["at_user_process_roles","at_user_process_role_status_init","at_user_process_role_status_new"]; 
return r;
};



/**
* @property {id_process}  id_process               - Array of Processes

*/
var user_processes = function(_props){
    _props = _props || {};
    this.id_process = _props.id_process;

};


var process_user_rights = function()
{
let r = ArrayEx.apply(this, arguments);
r.memberType = ["user_processes","at_user_process_roles","at_user_process_role_status_init","at_user_process_role_status_new"]; 
return r;
};



/**
* @property {process_user_rights}  process_user_rights               - Array of Process User Rights

*/
var process_user_rights = function(_props){
    _props = _props || {};
    this.process_user_rights = _props.process_user_rights;

};
var id_process = function()
{
let r = ArrayEx.apply(this, arguments);
r.memberType = ["at_user_process_roles","at_user_process_role_status_init","at_user_process_role_status_new"]; 
return r;
};



/**
* @property {id_process}  id_process               - Array of Processes

*/
var at_user_processes = function(_props){
    _props = _props || {};
    this.id_process = _props.id_process;

};


var allowed_transitions = function()
{
let r = ArrayEx.apply(this, arguments);
r.memberType = ["at_user_processes","at_user_process_roles","at_user_process_role_status_init","at_user_process_role_status_new"]; 
return r;
};



/**
* @property {allowed_transitions}  allowed_transitions               - Array of Allowed Transitions

*/
var allowed_transitions = function(_props){
    _props = _props || {};
    this.allowed_transitions = _props.allowed_transitions;

};

/**
* @property {Number}  value               - Name

*/
var responseObj = function(_props){
    _props = _props || {};
    this.value = _props.value;

};

var GaiaAPI_process_users = function(){
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
var process_users = function(apiClient) { 
    apiClient = apiClient || new ApiClient();
    /*{typeMap}*/
    
    /**
    *Get process_user
    * @param {integer} id_user User id
    * @returns {Promise} 
    */
    this.get = function(id_user){
    let objQuery = {};
    objQuery["id_user"] = id_user;

    let objPath = {};

    let objBody = null;
    let requestContentType = "application/json";
    let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"400":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
    *
    * @param {integer} id_process_role process_role id
    * @param {array} id_users user's id
    * @returns {Promise} 
    */
    this.post = function(id_process_role,id_users){
    let objQuery = {};

    let objPath = {};

    let objBody = {"id_process_role":id_process_role,"id_users":id_users};
    let requestContentType = "application/x-www-form-urlencoded";
    let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"400":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
    
    OAMethod.call(this, apiClient);
    this.basePath = _server + "/process_users";
};
var roleStatusRights = function(apiClient) { 
    apiClient = apiClient || new ApiClient();
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
    let responses = {"200":{"responseType":"JSON","type":"process_user_rights"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
    this.basePath = _server + "/process_users/{id_user}/roleStatusRights";
};
var ownerStatusRights = function(apiClient) { 
    apiClient = apiClient || new ApiClient();
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
    let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
    this.basePath = _server + "/process_users/ownerStatusRights";
};
var allowedTransitions = function(apiClient) { 
    apiClient = apiClient || new ApiClient();
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
    let responses = {"200":{"responseType":"JSON","type":"allowed_transitions"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
    this.basePath = _server + "/process_users/{id_user}/allowedTransitions";
};
var processUserRight = function(apiClient) { 
    apiClient = apiClient || new ApiClient();
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
    this.basePath = _server + "/process_users/{id_user}/{id_process_case}/processUserRight";
};
var processUserTransition = function(apiClient) { 
    apiClient = apiClient || new ApiClient();
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
    this.basePath = _server + "/process_users/{id_user}/{id_process_case}/processUserTransition";
};

 this.process_usersClient = new process_users();
 this.roleStatusRightsClient = new roleStatusRights();
 this.ownerStatusRightsClient = new ownerStatusRights();
 this.allowedTransitionsClient = new allowedTransitions();
 this.processUserRightClient = new processUserRight();
 this.processUserTransitionClient = new processUserTransition();

};
Poolable.call(GaiaAPI_process_users);