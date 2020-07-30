
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
	* @property {Number}  form_id               - Form Id
	* @property {Number}  field_id               - Field Id
	* @property {Number}  event_id               - Event Id
	* @property {String}  content               - Content
	* @property {Number}  id_process               - Process Id
	* @property {String}  file_name               - File Name

    */
    var script_file = function(_props){
        _props = _props || {};
		this.form_id = _props.form_id;
		this.field_id = _props.field_id;
		this.event_id = _props.event_id;
		this.content = _props.content;
		this.id_process = _props.id_process;
		this.file_name = _props.file_name;

    };

var GaiaAPI_events = function(){
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
	var events = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*Get all forms or the requested form
		* @param {integer} id_event Event id
		* @returns {Promise} 
		*/
    	this.get = function(id_event){
        let objQuery = {};
		objQuery["id_event"] = id_event;

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
        this.basePath = _server + "/events";
    };
	var handledEvents = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*
		* @param {integer} id_process Event Id
		* @param {integer} id_form Form Id
		* @param {integer} id_form_field Field Id
		* @returns {Promise} 
		*/
    	this.get = function(id_process,id_form,id_form_field){
        let objQuery = {};
		objQuery["id_form"] = id_form;
		objQuery["id_form_field"] = id_form_field;

        let objPath = {};
		objPath["id_process"] = id_process;

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
        this.basePath = _server + "/events/{id_process}/handledEvents";
    };
	var unhandledEvents = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*
		* @param {integer} id_process Event Id
		* @param {integer} id_form Form Id
		* @param {integer} id_form_field Field Id
		* @returns {Promise} 
		*/
    	this.get = function(id_process,id_form,id_form_field){
        let objQuery = {};
		objQuery["id_form"] = id_form;
		objQuery["id_form_field"] = id_form_field;

        let objPath = {};
		objPath["id_process"] = id_process;

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
        this.basePath = _server + "/events/{id_process}/unhandledEvents";
    };
	var getEventDocument = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*
		* @param {integer} form_id Form Id
		* @param {integer} field_id Field Id
		* @param {integer} event_id Event Id
		* @returns {Promise} 
		*/
    	this.get = function(form_id,field_id,event_id){
        let objQuery = {};
		objQuery["field_id"] = field_id;
		objQuery["event_id"] = event_id;

        let objPath = {};
		objPath["form_id"] = form_id;

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
        this.basePath = _server + "/events/{form_id}/getEventDocument";
    };
	var events_cte = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method returns all the events realated to the process
		* @param {string} id_process Process Id
		* @param {string} id_form Form Id
		* @param {string} id_form_field Form Field Id
		* @param {string} id_document Frontendevent Document Id
		* @returns {Promise} 
		*/
    	this.get = function(id_process,id_form,id_form_field,id_document){
        let objQuery = {};
		objQuery["id_form"] = id_form;
		objQuery["id_form_field"] = id_form_field;
		objQuery["id_document"] = id_document;

        let objPath = {};
		objPath["id_process"] = id_process;

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
        this.basePath = _server + "/events/{id_process}/events_cte";
    };
	var addEventDocument = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method adds a document
		* @param {integer} event_id Event Id
		* @param {integer} form_id Form Id
		* @param {integer} process_id Process Id
		* @param {integer} field_id Form Field Id
		* @param {string} behavior_name Behavior Name
		* @returns {Promise} 
		*/
    	this.post = function(event_id,form_id,process_id,field_id,behavior_name){
        let objQuery = {};

        let objPath = {};

        let objBody = {"event_id":event_id,"form_id":form_id,"process_id":process_id,"field_id":field_id,"behavior_name":behavior_name};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/events/addEventDocument";
    };
	var saveScriptFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method adds a script file
		* @param {script_file} script_file The request body for post /events/saveScriptFile 
		* @returns {Promise} 
		*/
    	this.post = function(script_file){
        let objQuery = {};

        let objPath = {};

        let objBody = script_file;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/events/saveScriptFile";
    };
	var deleteScriptFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method deletes a script file
		* @param {integer} revision_id Revision Id
		* @param {integer} id_process Process Id
		* @returns {Promise} 
		*/
    	this.get = function(revision_id,id_process){
        let objQuery = {};

        let objPath = {};
		objPath["revision_id"] = revision_id;
		objPath["id_process"] = id_process;

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
        this.basePath = _server + "/events/{revision_id}/{id_process}/deleteScriptFile";
    };
	var loadScriptFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method adds a script file
		* @param {script_file} script_file The request body for post /events/loadScriptFile 
		* @returns {Promise} 
		*/
    	this.post = function(script_file){
        let objQuery = {};

        let objPath = {};

        let objBody = script_file;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/events/loadScriptFile";
    };
	var deployScriptFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method adds a script file
		* @param {integer} revision_id Revision Id
		* @param {integer} id_process Process Id
		* @returns {Promise} 
		*/
    	this.post = function(revision_id,id_process){
        let objQuery = {};

        let objPath = {};

        let objBody = {"revision_id":revision_id,"id_process":id_process};
        let requestContentType = "application/x-www-form-urlencoded";
        let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/events/deployScriptFile";
    };
	var getGlobalFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method adds a script file
		* @returns {Promise} 
		*/
    	this.get = function(){
        let objQuery = {};

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/events/getGlobalFile";
    };
	var saveGlobalFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method adds a script file
		* @param {string} content Content
		* @returns {Promise} 
		*/
    	this.post = function(content){
        let objQuery = {};

        let objPath = {};

        let objBody = {"content":content};
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"responseStatus"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/events/saveGlobalFile";
    };
	var compileScriptFile = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        
    	/**
		*This method compiles script file
		* @param {integer} process_id Process Id
		* @returns {Promise} 
		*/
    	this.get = function(process_id){
        let objQuery = {};

        let objPath = {};
		objPath["process_id"] = process_id;

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
        this.basePath = _server + "/events/{process_id}/compileScriptFile";
    };

	 this.eventsClient = new events();
	 this.handledEventsClient = new handledEvents();
	 this.unhandledEventsClient = new unhandledEvents();
	 this.getEventDocumentClient = new getEventDocument();
	 this.events_cteClient = new events_cte();
	 this.addEventDocumentClient = new addEventDocument();
	 this.saveScriptFileClient = new saveScriptFile();
	 this.deleteScriptFileClient = new deleteScriptFile();
	 this.loadScriptFileClient = new loadScriptFile();
	 this.deployScriptFileClient = new deployScriptFile();
	 this.getGlobalFileClient = new getGlobalFile();
	 this.saveGlobalFileClient = new saveGlobalFile();
	 this.compileScriptFileClient = new compileScriptFile();

    }