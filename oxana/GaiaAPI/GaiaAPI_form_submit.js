var GaiaAPI_form_submit = function(_props){
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
	this.form_submit = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Create or Edit a Form
		* @param {stdClass} stdClass The request body for post /form_submit 
		* @returns {Promise} 
		*/
    	this.post = function(stdClass){
        let objQuery = {};

        let objPath = {};

        let objBody = stdClass;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"responseSubmit"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_form_submit[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/form_submit";
    };

		this.form_submitClient = new this.form_submit();

};
Poolable.call(GaiaAPI_form_submit);

    /**


    */
   GaiaAPI_form_submit.stdClass = function stdClass(_props){
        _props = _props || {};

        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new GaiaAPI_form_submit.undefined(_props[prop]);
            }
        }
    };

    /**
	* @property {String}  id_form_submit               - Form Submit Guid

    */
   GaiaAPI_form_submit.responseSubmit = function responseSubmit(_props){
        _props = _props || {};
		this.id_form_submit = _props.id_form_submit;

    };

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_form_submit.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };
