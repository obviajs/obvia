var ApiClientGen = function (_props)
{ 
    let _defaultParams = {
        url: "https://cors-anywhere.herokuapp.com/pastebin.com/raw/tSKLhXA5"
    };
    _props = extend(false, false, _defaultParams, _props);
    get(_props.url).then(function (r)
    {
        let oas = YAML.parse(r.response);
        _generate(oas);
    });
    let apiTemplate = `var {apiTitle} = function(){
{paths}
{pathInstances}
    }`;
    let pathTemplate = `\tvar {path} = function(apiClient) { 
        apiClient = apiClient || new ApiClient();
        /*{typeMap}*/
        {methods}
        
        OAMethod.call(this, apiClient);
        this.basePath = "{basePath}";
    };`;
    
    let methodTemplate = `
    {methodDoc}
    \tthis.{methodName} = function({params}){
        let objQuery = {};
{strObjQuery}
        let objPath = {};
{strObjPath}
        let objBody = {objBody};
        let requestContentType = "{requestContentType}";
        let responses = {responses};
        return new Promise((resolve, reject) =>
        {
            \tthis.apiCall(objQuery, objBody, objPath, requestContentType).then(function(resp){
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
    \t};\r`
    //({})
    //getChainValue per marjen e $ref
    let _generate = function (oas)
    { 
        let strClosures = "", pathInstances = "";
        let typeMap = {};
        let url = oas.servers[0].url;
        let apiTitle = oas.info.title; 
        for (let path in oas.paths)
        { 
            let strMethods = "";
            typeMap[path] = {};
            let responses = {};
            for (let method in oas.paths[path])
            {
                typeMap[path][method] = {}; 
                let strObjQuery = "";
                let objBody = null;
                let strObjPath = "";
                let params = [];
                    
                let methodDoc = "\t/**\r\n\t\t*" + oas.paths[path][method].summary + "\r\n"; 
                if (oas.paths[path][method].parameters)
                {
                    let pLen = oas.paths[path][method].parameters.length;
                    for (let i = 0; i < pLen; i++)
                    {
                        let param = oas.paths[path][method].parameters[i];
                        params.push(param.name);
                        typeMap[path][method][param.name] = {};
                        if (param.in == "query")
                        {
                            strObjQuery += `\t\tobjQuery["${param.name}"] = ${param.name};\r\n`;
                        } else if (param.in == "path")
                        {
                            strObjPath += `\t\tobjPath["${param.name}"] = ${param.name};\r\n`;
                        } else
                            console.log("unsupported parameter.in: value");
                        methodDoc += "\t\t* @param {" + param.schema.type + "} " + param.name + " " + param.description + "\r\n";
                    }
                }
                let requestContentType = "application/json";
                if (oas.paths[path][method].requestBody && oas.paths[path][method].requestBody.content)
                { 
                    for (var ct in oas.paths[path][method].requestBody.content)
                    { 
                        requestContentType = ct.toLowerCase();
                        let typeInfo;
                        if (requestContentType == "json" || requestContentType == "application/json")
                        {
                            //TODO: emer me intuitive per parametrin, rastin me $ref
                            if (oas.paths[path][method].requestBody.content[ct].schema)
                            {
                                typeInfo = oas.paths[path][method].requestBody.content[ct].schema;
                            } else if (oas.paths[path][method].requestBody.content[ct].$ref)
                            {
                                let typePath = oas.paths[path][method].requestBody.content[ct].$ref;
                                let typeChain = typePath.split('/');
                                typeChain.shift();
                                typeInfo = getChainValue(oas, typeChain);
                            }//or $ref
                        } else if (requestContentType == "multipart/form-data")
                        { 
                            
                            if (oas.paths[path][method].requestBody.content[ct].schema)
                            {
                                typeInfo = oas.paths[path][method].requestBody.content[ct].schema;
                            } else if (oas.paths[path][method].requestBody.content[ct].$ref)
                            {
                                let typePath = oas.paths[path][method].requestBody.content[ct].$ref;
                                let typeChain = typePath.split('/');
                                typeChain.shift();
                                typeInfo = getChainValue(oas, typeChain);
                            }
                        }
                        _parseType(oas, typeInfo);
                    }
                    params.push("requestBody");
                    objBody = "requestBody";
                }
                if (oas.paths[path][method].responses)
                { 
                    for (var r in oas.paths[path][method].responses)
                    { 
                        for (var ct in oas.paths[path][method].responses[r].content)
                        {
                            responses[r] = { "responseType": r, "type": "TODO" };
                            let typeInfo;
                            if (oas.paths[path][method].responses[r].content[ct].schema)
                            {
                                typeInfo = oas.paths[path][method].responses[r].content[ct].schema;
                            } else if (oas.paths[path][method].responses[r].content[ct].$ref)
                            {
                                let typePath = oas.paths[path][method].responses[r].content[ct].$ref;
                                let typeChain = typePath.split('/');
                                typeChain.shift();
                                typeInfo = getChainValue(oas, typeChain);
                            }
                            _parseType(oas, typeInfo);
                        }
                    }
                }
                //FixMe
                methodDoc += "\t\t* @returns {String} ";
                methodDoc += "\r\n\t\t*/";
                let arrMethod = method.split("/");
                method = arrMethod.last();
                
                strMethods += methodTemplate.formatUnicorn({"methodName":method, "methodDoc":methodDoc, "params":params.join(","), "requestContentType":requestContentType, "strObjQuery":strObjQuery, "objBody":objBody, "strObjPath":strObjPath, "responses":JSON.stringify(responses)});    
            }   
            let arrPath = path.split("/");
            let pathName = arrPath.last();
            let basePath = url + (url[url.length-1] != '/' && path[0]!= '/' ? '/' : '') + path;
            strClosures += pathTemplate.formatUnicorn({ "path": pathName, "methods": strMethods, "basePath": basePath }) + "\r\n"; 
            pathInstances += `\t this.${pathName}Client = new ${pathName}();\r\n`;
        }
        let apiSrc = apiTemplate.formatUnicorn({"apiTitle":apiTitle.replace(/ /g,''), "paths":strClosures, "pathInstances":pathInstances});
        
        console.log(apiSrc);
        eval(apiSrc)
    }
    let _oasjsMap = { "integer": "number" };
    let _typeTemplate = `
    /**
    {jsDoc}
    */
    var {typeName} = function(_props){
    {properties}
    };`;
    let _propDocTemplate = "* @property {{jsType}}  {prop}               - {description}\r\n";
    let _propTemplate = "\tthis.{prop};\r\n";
    //TODO: Add Validation Ex:minimum, maximum for number & pattern for string
    /**
     * 
     * @param {*} oas 
     * @param {*} typeInfo 
     */
    let _parseType = function (oas, typeInfo, propName)
    { 
        let jsDoc = "";
        let properties = "";
        
        let jsType = _oasjsMap[typeInfo.type];
        if (!jsType)
            jsType = typeInfo.type;
        let description = typeInfo.description;
        let types = "";
        propName = propName || typeInfo.title;
        
        if (typeInfo.type == "object")
        { 
            for (var prop in typeInfo.properties)
            { 
                let r = _parseType(oas, typeInfo.properties[prop], prop);
                jsDoc += r.jsDoc;
                properties += r.properties;
                types += r.types.length>0?r.types +"\r\n":"";
            }
            types += _typeTemplate.formatUnicorn({"jsDoc":jsDoc, "typeName": propName, "properties":properties});
        }else if (typeInfo.type == "array")
        {
            if (typeInfo.items.oneOf)
            {
                
            } else
            { 
                _parseType(oas, typeInfo.items);
            }
        }
        else if (typeInfo.$ref)
        {
            let typePath = typeInfo.$ref;
            let typeChain = typePath.split('/');
            typeChain.shift();
            typeInfo = getChainValue(oas, typeChain);
            let r = _parseType(oas, typeInfo, propName);
            jsType = typeChain.last();
            types = r.types + "\r\n";//+ _typeTemplate.formatUnicorn({"jsDoc":r.jsDoc, "typeName": propName, "properties":r.properties});
        }
        properties = _propTemplate.formatUnicorn({"prop": propName});
        jsDoc = _propDocTemplate.formatUnicorn({ "jsType": jsType, "prop": propName, "description": description});
        return {"properties":properties, "jsDoc":jsDoc, "types":types};
    }
    //download("snowCrash.json.txt", jsonLayout); 
}
