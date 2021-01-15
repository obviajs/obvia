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
		* @param {report_entity} report_entity The request body for post /reports 
		* @returns {Promise} 
		*/
    	this.post = function(report_entity){
        let objQuery = {};

        let objPath = {};

        let objBody = report_entity;
        let requestContentType = "json";
        let responses = {"200":{"responseType":"JSON","type":"report_entity"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
	this.getReports = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get the requested report
		* @param {string} report_guid Report Guid
		* @returns {Promise} 
		*/
    	this.get = function(report_guid){
        let objQuery = {};

        let objPath = {};
		objPath["report_guid"] = report_guid;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayReportEntity"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/reports/{report_guid}/getReports";
    };
	this.getRevisions = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*Get the requested revision
		* @param {string} revision_guid Revision GUID
		* @returns {Promise} 
		*/
    	this.get = function(revision_guid){
        let objQuery = {};

        let objPath = {};
		objPath["revision_guid"] = revision_guid;

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"revision_data"},"404":{"responseType":"JSON","type":"responseStatus"}};
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
        this.basePath = _server + "/reports/{revision_guid}/getRevisions";
    };
	this.getReportComponents = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the report components
		* @param {string} view Report Literal
		* @returns {Promise} 
		*/
    	this.get = function(view){
        let objQuery = {};
		objQuery["view"] = view;

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
        this.basePath = _server + "/reports/getReportComponents";
    };
	this.addDocument = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method adds a document and a revision in Digital Archive
		* @param {string} report_name Report Name
		* @returns {Promise} 
		*/
    	this.post = function(report_name){
        let objQuery = {};

        let objPath = {};

        let objBody = {"report_name":report_name};
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
        this.basePath = _server + "/reports/addDocument";
    };
	this.addRevision = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method adds a revision in Digital Archive
		* @param {integer} id_document Report Name
		* @returns {Promise} 
		*/
    	this.post = function(id_document){
        let objQuery = {};

        let objPath = {};

        let objBody = {"id_document":id_document};
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
        this.basePath = _server + "/reports/addRevision";
    };

		this.reportsClient = new this.reports();
		this.getReportsClient = new this.getReports();
		this.getRevisionsClient = new this.getRevisions();
		this.getReportComponentsClient = new this.getReportComponents();
		this.addDocumentClient = new this.addDocument();
		this.addRevisionClient = new this.addRevision();

};
Poolable.call(GaiaAPI_reports);

    /**
	* @property {Number}  report_entity_id               - Report ID
	* @property {String}  report_name               - Report Name
	* @property {String}  description               - Report Description
	* @property {Number}  deleted               - Is Deleted
	* @property {Number}  author_id_user               - Report's Author ID
	* @property {String}  report_help_url               - Report's URL
	* @property {String}  date_created               - Report's Creation Date
	* @property {String}  date_modified               - Report's Modified Date
	* @property {Number}  id_report_type               - Report's Type ID
	* @property {String}  report_literal               - Report's Literal
	* @property {String}  report_xml               - Report's XML
	* @property {Number}  id_dataview               - Report's dataview id
	* @property {String}  report_literal_view               - Report's literal view
	* @property {String}  report_guid               - Report's guid
	* @property {Number}  id_document               - Document Id
	* @property {Number}  component_count               - Component count
	* @property {String}  dataview_fields_list               - Dataview Fields List

    */
   GaiaAPI_reports.report_entity = function report_entity(_props){
        _props = _props || {};
		this.report_entity_id = _props.report_entity_id;
		this.report_name = _props.report_name;
		this.description = _props.description;
		this.deleted = _props.deleted;
		this.author_id_user = _props.author_id_user;
		this.report_help_url = _props.report_help_url;
		this.date_created = _props.date_created;
		this.date_modified = _props.date_modified;
		this.id_report_type = _props.id_report_type;
		this.report_literal = _props.report_literal;
		this.report_xml = _props.report_xml;
		this.id_dataview = _props.id_dataview;
		this.report_literal_view = _props.report_literal_view;
		this.report_guid = _props.report_guid;
		this.id_document = _props.id_document;
		this.component_count = _props.component_count;
		this.dataview_fields_list = _props.dataview_fields_list;

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
	GaiaAPI_reports.arrayReportEntity = function arrayReportEntity()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["report_entity"]; 
	};
	GaiaAPI_reports.arrayReportEntity.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_reports.arrayReportEntity.prototype.constructor = GaiaAPI_reports.arrayReportEntity;

    /**
	* @property {String}  revision_literal               - Revision Literal
	* @property {String}  revision_extradata               - Revision Extradata

    */
   GaiaAPI_reports.revision_data = function revision_data(_props){
        _props = _props || {};
		this.revision_literal = _props.revision_literal;
		this.revision_extradata = _props.revision_extradata;

    };
