var GaiaAPI_report_source = function(_props){
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
	this.report_source = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the required datasources or all the datasources
		* @param {integer} datasource_id DataSource Id
		* @returns {Promise} 
		*/
    	this.get = function(datasource_id){
        let objQuery = {};
		objQuery["datasource_id"] = datasource_id;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayDatasource"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_report_source[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/report_source";
    };
	this.getDataviewOfDatasource = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the dataviews of a datasource
		* @param {integer} id_datasource Datasource Id
		* @returns {Promise} 
		*/
    	this.get = function(id_datasource){
        let objQuery = {};
		objQuery["id_datasource"] = id_datasource;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayDataview"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_report_source[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/report_source/getDataviewOfDatasource";
    };
	this.getDataViewFields = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        
    	/**
		*This method returns the dataview fields
		* @param {integer} id_dataview Dataview Id
		* @returns {Promise} 
		*/
    	this.get = function(id_dataview){
        let objQuery = {};
		objQuery["id_dataview"] = id_dataview;

        let objPath = {};

        let objBody = null;
        let requestContentType = "application/json";
        let responses = {"200":{"responseType":"JSON","type":"arrayDataviewFieldsDvFieldsProps"},"404":{"responseType":"JSON","type":"responseStatus"},"500":{"responseType":"JSON","type":"responseStatus"}};
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
                            ret = new (GaiaAPI_report_source[responses[resp.status].type])(ret);
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
        this.basePath = _server + "/report_source/getDataViewFields";
    };

		this.report_sourceClient = new this.report_source();
		this.getDataviewOfDatasourceClient = new this.getDataviewOfDatasource();
		this.getDataViewFieldsClient = new this.getDataViewFields();

};
Poolable.call(GaiaAPI_report_source);

    /**
	* @property {Number}  datasource_id               - Datasource ID
	* @property {String}  datasource_name               - Datasource name
	* @property {Number}  id_datasource               - Datasource Datasource ID
	* @property {Number}  id_datasource_type               - Datasource Type ID
	* @property {String}  description               - Datasource description
	* @property {Number}  id_user               - Datasource User ID
	* @property {Number}  is_dir               - Check if is directory
	* @property {Number}  allow_datasource_add               - Check if adding a datasource is allowed
	* @property {Number}  allow_folder_add               - Check if adding a folder is allowed
	* @property {Number}  allow_folder_delete               - Check if deleting a folder is allowed
	* @property {Number}  in_use               - Check if datasource is in use
	* @property {String}  entity_name               - Datasource Entity Name
	* @property {Number}  deleted               - Check if datasource is deleted

    */
   GaiaAPI_report_source.datasource = function datasource(_props){
        _props = _props || {};
		this.datasource_id = _props.datasource_id;
		this.datasource_name = _props.datasource_name;
		this.id_datasource = _props.id_datasource;
		this.id_datasource_type = _props.id_datasource_type;
		this.description = _props.description;
		this.id_user = _props.id_user;
		this.is_dir = _props.is_dir;
		this.allow_datasource_add = _props.allow_datasource_add;
		this.allow_folder_add = _props.allow_folder_add;
		this.allow_folder_delete = _props.allow_folder_delete;
		this.in_use = _props.in_use;
		this.entity_name = _props.entity_name;
		this.deleted = _props.deleted;

    };


	GaiaAPI_report_source.arrayDatasource = function arrayDatasource()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["datasource"]; 
	};
	GaiaAPI_report_source.arrayDatasource.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_report_source.arrayDatasource.prototype.constructor = GaiaAPI_report_source.arrayDatasource;

    /**
	* @property {Number}  status_code               - Response status code
	* @property {String}  status_description               - Response description

    */
   GaiaAPI_report_source.responseStatus = function responseStatus(_props){
        _props = _props || {};
		this.status_code = _props.status_code;
		this.status_description = _props.status_description;

    };

    /**
	* @property {Number}  dataview_id               - Dataview ID
	* @property {String}  name               - Dataview Name
	* @property {String}  description               - Dataview Description
	* @property {String}  json               - Dataview JSON
	* @property {Number}  id_datasource               - Dataview's ID Datasource
	* @property {Number}  id_user               - ID User
	* @property {Number}  time_created               - Time Created
	* @property {Number}  deleted               - is deleted
	* @property {Number}  in_use               - In Use
	* @property {Number}  entity_name               - Dataview Entity Name

    */
   GaiaAPI_report_source.dataview = function dataview(_props){
        _props = _props || {};
		this.dataview_id = _props.dataview_id;
		this.name = _props.name;
		this.description = _props.description;
		this.json = _props.json;
		this.id_datasource = _props.id_datasource;
		this.id_user = _props.id_user;
		this.time_created = _props.time_created;
		this.deleted = _props.deleted;
		this.in_use = _props.in_use;
		this.entity_name = _props.entity_name;

    };


	GaiaAPI_report_source.arrayDataview = function arrayDataview()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["dataview"]; 
	};
	GaiaAPI_report_source.arrayDataview.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_report_source.arrayDataview.prototype.constructor = GaiaAPI_report_source.arrayDataview;

    /**
	* @property {Number}  id               - Field Id
	* @property {Number}  x               - x coordinate
	* @property {Number}  y               - y coordinate
	* @property {Number}  width               - width
	* @property {Number}  height               - height
	* @property {String}  section               - section

    */
   GaiaAPI_report_source.props = function props(_props){
        _props = _props || {};
		this.id = _props.id;
		this.x = _props.x;
		this.y = _props.y;
		this.width = _props.width;
		this.height = _props.height;
		this.section = _props.section;

    };



    /**
	* @property {String}  fieldName               - Field Name
	* @property {String}  fieldType               - Field Type
	* @property {String}  fieldDisplay               - Field Display
	* @property {String}  componentName               - Component Name
	* @property {props}  props               - Field Properties
	* @property {Number}  id_row               - Row Id

    */
   GaiaAPI_report_source.dv_fields = function dv_fields(_props){
        _props = _props || {};
		this.fieldName = _props.fieldName;
		this.fieldType = _props.fieldType;
		this.fieldDisplay = _props.fieldDisplay;
		this.componentName = _props.componentName;
		this.props = _props.props;
		this.id_row = _props.id_row;

    };


	GaiaAPI_report_source.arrayDvFieldsProps = function arrayDvFieldsProps()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["dv_fields","props"]; 
	};
	GaiaAPI_report_source.arrayDvFieldsProps.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_report_source.arrayDvFieldsProps.prototype.constructor = GaiaAPI_report_source.arrayDvFieldsProps;



    /**
	* @property {String}  sql               - Dataview Query
	* @property {Number}  dataview_id               - Dataview Id
	* @property {String}  table_name               - Table Name
	* @property {fields}  fields               - Array of Fields

    */
   GaiaAPI_report_source.dataview_fields = function dataview_fields(_props){
        _props = _props || {};
		this.sql = _props.sql;
		this.dataview_id = _props.dataview_id;
		this.table_name = _props.table_name;
		this.fields = _props.fields;

    };


	GaiaAPI_report_source.arrayDataviewFieldsDvFieldsProps = function arrayDataviewFieldsDvFieldsProps()
	{
		ArrayEx.apply(this, arguments);    
		this.memberType = ["dataview_fields","dv_fields","props"]; 
	};
	GaiaAPI_report_source.arrayDataviewFieldsDvFieldsProps.prototype = Object.create(ArrayEx.prototype);
	GaiaAPI_report_source.arrayDataviewFieldsDvFieldsProps.prototype.constructor = GaiaAPI_report_source.arrayDataviewFieldsDvFieldsProps;
