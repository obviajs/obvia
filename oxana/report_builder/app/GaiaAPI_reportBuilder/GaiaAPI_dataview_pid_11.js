var GaiaAPI_dataview_pid_11 = function(_props){
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
	this.dataview_pid_11 = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the list of revisions
		* @param {integer} id_document Document ID
		* @returns {Promise} 
		*/
    	this.post = function(id_document){
        let objQuery = {};

        let objPath = {};

        let objBody = {"id_document":id_document};
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"arrayRevision"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_dataview_pid_11[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/dataview_pid_11";
    };

		this.dataview_pid_11Client = new this.dataview_pid_11();

};
Poolable.call(GaiaAPI_dataview_pid_11);

    /**
	* @property {Number}  revision_id               - Revision ID
	* @property {Number}  id_document               - Document ID
	* @property {Number}  id_user               - user ID
	* @property {Number}  revision_file_name               - Revision File Name
	* @property {Number}  revision_name               - Revision Name
	* @property {Number}  byte_size               - Byte Size
	* @property {Number}  is_active               - Is Active
	* @property {Number}  system_date               - System Date
	* @property {Number}  deleted               - Is deleted

    */
   GaiaAPI_dataview_pid_11.revision = function revision(_props){
        _props = _props || {};
		this.revision_id = _props.revision_id;
		this.id_document = _props.id_document;
		this.id_user = _props.id_user;
		this.revision_file_name = _props.revision_file_name;
		this.revision_name = _props.revision_name;
		this.byte_size = _props.byte_size;
		this.is_active = _props.is_active;
		this.system_date = _props.system_date;
		this.deleted = _props.deleted;

    };


	GaiaAPI_dataview_pid_11.arrayRevision = function arrayRevision()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["revision"]; 
	};
	GaiaAPI_dataview_pid_11.arrayRevision.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_dataview_pid_11.arrayRevision.prototype.constructor = GaiaAPI_dataview_pid_11.arrayRevision;

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_dataview_pid_11.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };
