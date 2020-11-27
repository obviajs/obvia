var GaiaAPI_reports = function(_props){
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
	this.reports = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Create or edit a report
		* @param {reportEntity} reportEntity The request body for post /reports 
		* @returns {Promise} 
		*/
    	this.post = function(reportEntity){
        let objQuery = {};

        let objPath = {};

        let objBody = reportEntity;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"reportEntity"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_reports[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/reports";
    };

		this.reportsClient = new this.reports();

};
Poolable.call(GaiaAPI_reports);

    /**
	* @property {Number}  report_id               - Report ID
	* @property {String}  report_name               - Report Name
	* @property {String}  description               - Report Description
	* @property {Number}  deleted               - Is Deleted
	* @property {Number}  author_id_user               - Report's Author ID
	* @property {String}  report_help_url               - Report's URL
	* @property {String}  date_created               - Report's Creation Date
	* @property {String}  date_modified               - Report's Modified Date
	* @property {Number}  id_report_type               - Report's Type ID
	* @property {String}  report_literal               - Report's Literal
	* @property {String}  report_literal_view               - Report's literal view
	* @property {String}  report_guid               - Report's guid

    */
   GaiaAPI_reports.reportEntity = function reportEntity(_props){
        _props = _props || {};
		this.report_id = _props.report_id;
		this.report_name = _props.report_name;
		this.description = _props.description;
		this.deleted = _props.deleted;
		this.author_id_user = _props.author_id_user;
		this.report_help_url = _props.report_help_url;
		this.date_created = _props.date_created;
		this.date_modified = _props.date_modified;
		this.id_report_type = _props.id_report_type;
		this.report_literal = _props.report_literal;
		this.report_literal_view = _props.report_literal_view;
		this.report_guid = _props.report_guid;

    };

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_reports.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };