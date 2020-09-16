var GaiaAPI_users = function(_props){
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
	this.users = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Function that get the user with id specified.
		* @param {integer} id_user User id
		* @returns {Promise} 
		*/
    	this.get = function(id_user){
        let objQuery = {};
		objQuery["id_user"] = id_user;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayUser"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
		*Create new user to access the system.
		* @param {user} user The request body for post /users 
		* @returns {Promise} 
		*/
    	this.post = function(user){
        let objQuery = {};

        let objPath = {};

        let objBody = user;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"userObj"},"201":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
		*Function that delete the user.
		* @param {integer} id_user User id
		* @returns {Promise} 
		*/
    	this.delete = function(id_user){
        let objQuery = {};
		objQuery["id_user"] = id_user;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"201":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/users";
    };
	this.block = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Function that block the user.
		* @param {integer} id_user User id
		* @returns {Promise} 
		*/
    	this.post = function(id_user){
        let objQuery = {};

        let objPath = {};

        let objBody = {"id_user":id_user};
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"204":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/users/block";
    };
	this.login = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Function that logs user into the system.
		* @param {string} username User username
		* @param {string} password User password
		* @returns {Promise} 
		*/
    	this.post = function(username,password){
        let objQuery = {};

        let objPath = {};

        let objBody = {"username":username,"password":password};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"userObj"},"400":{"responseType":"JSON","type":"responseStatus"},"403":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/users/login";
    };
	this.confirm = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Function that allow the user to access the system.
		* @param {integer} id_user user id
		* @param {integer} id_role user role
		* @returns {Promise} 
		*/
    	this.post = function(id_user,id_role){
        let objQuery = {};

        let objPath = {};

        let objBody = {"id_user":id_user,"id_role":id_role};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"recordsAffected"},"204":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/users/confirm";
    };
	this.forgot_password = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Sends an email with the new password for the user when he has forgotten
his password.
		* @param {string} data User username/email
		* @returns {Promise} 
		*/
    	this.post = function(data){
        let objQuery = {};

        let objPath = {};

        let objBody = {"data":data};
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"responsePostObject"},"404":{"responseType":"JSON","type":"responseStatus"},"409":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_users[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/users/forgot_password";
    };

		this.usersClient = new this.users();
		this.blockClient = new this.block();
		this.loginClient = new this.login();
		this.confirmClient = new this.confirm();
		this.forgot_passwordClient = new this.forgot_password();

};
Poolable.call(GaiaAPI_users);

    /**
	* @property {String}  user_id               - The user's id
	* @property {String}  username               - The user's username
	* @property {String}  password               - The user's password
	* @property {Number}  id_role               - The user's id_role
	* @property {String}  name               - The user's name
	* @property {String}  surname               - The user's surname
	* @property {String}  created               - The user's created date
	* @property {Number}  deleted               - The user's id
	* @property {String}  role               - The user's role
	* @property {Number}  status               - The user's status
	* @property {Number}  id_module               - The module where user has access
	* @property {Number}  email_priority               - The user's email_priority
	* @property {String}  last_guid               - The user's last_guid
	* @property {String}  avatar               - The user's avatar
	* @property {String}  email               - The user's email
	* @property {Number}  intro               - The user's intro
	* @property {Number}  last_seen               - The user's last_seen
	* @property {Number}  pw_unsuccessful               - The number of time the user has written a wrong password.
	* @property {Number}  pw_lastupdated               - The user's is_dev
	* @property {String}  NID               - The user's NID
	* @property {Number}  hashtype               - The user's hashtype
	* @property {String}  generated_code               - The user's generated_code

    */
   GaiaAPI_users.user = function(_props){
        _props = _props || {};
		this.user_id = _props.user_id;
		this.username = _props.username;
		this.password = _props.password;
		this.id_role = _props.id_role;
		this.name = _props.name;
		this.surname = _props.surname;
		this.created = _props.created;
		this.deleted = _props.deleted;
		this.role = _props.role;
		this.status = _props.status;
		this.id_module = _props.id_module;
		this.email_priority = _props.email_priority;
		this.last_guid = _props.last_guid;
		this.avatar = _props.avatar;
		this.email = _props.email;
		this.intro = _props.intro;
		this.last_seen = _props.last_seen;
		this.pw_unsuccessful = _props.pw_unsuccessful;
		this.pw_lastupdated = _props.pw_lastupdated;
		this.NID = _props.NID;
		this.hashtype = _props.hashtype;
		this.generated_code = _props.generated_code;

    };


	GaiaAPI_users.arrayUser = function()
	{
		let r = ArrayEx.apply(this, arguments);
		r.memberType = ["user"]; 
		return r;
	};
	GaiaAPI_users.arrayUser.prototype = Object.create(ArrayEx.prototype);

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_users.responseStatus = function(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {String}  user_id               - The user's id
	* @property {String}  username               - The user's username
	* @property {Number}  id_role               - The user's id_role
	* @property {String}  name               - The user's name
	* @property {String}  surname               - The user's surname
	* @property {String}  created               - The user's created date
	* @property {Number}  deleted               - The user's id
	* @property {String}  role               - The user's role
	* @property {Number}  status               - The user's status
	* @property {Number}  id_module               - The module where user has access
	* @property {Number}  email_priority               - The user's email_priority
	* @property {String}  last_guid               - The user's last_guid
	* @property {String}  avatar               - The user's avatar
	* @property {String}  email               - The user's email
	* @property {Number}  intro               - The user's intro
	* @property {Number}  last_seen               - The user's last_seen
	* @property {Number}  pw_unsuccessful               - The number of time the user has written a wrong password.
	* @property {Number}  pw_lastupdated               - The user's is_dev
	* @property {String}  NID               - The user's NID
	* @property {String}  generated_code               - The user's generated_code

    */
   GaiaAPI_users.userObj = function(_props){
        _props = _props || {};
		this.user_id = _props.user_id;
		this.username = _props.username;
		this.id_role = _props.id_role;
		this.name = _props.name;
		this.surname = _props.surname;
		this.created = _props.created;
		this.deleted = _props.deleted;
		this.role = _props.role;
		this.status = _props.status;
		this.id_module = _props.id_module;
		this.email_priority = _props.email_priority;
		this.last_guid = _props.last_guid;
		this.avatar = _props.avatar;
		this.email = _props.email;
		this.intro = _props.intro;
		this.last_seen = _props.last_seen;
		this.pw_unsuccessful = _props.pw_unsuccessful;
		this.pw_lastupdated = _props.pw_lastupdated;
		this.NID = _props.NID;
		this.generated_code = _props.generated_code;

    };

    /**
	* @property {Number}  counter               - Number of records affected

    */
   GaiaAPI_users.recordsAffected = function(_props){
        _props = _props || {};
		this.counter = _props.counter;

    };

    /**
	* @property {Number}  subject_id               - Created or Modified Subject's ID

    */
   GaiaAPI_users.responsePostObject = function(_props){
        _props = _props || {};
		this.subject_id = _props.subject_id;

    };
