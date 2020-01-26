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
    let apiTemplate = `var {apiTitle} = function()`;
    let pathTemplate = `var {path} = function(apiClient) { 
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
        \tthis.apiCall(objQuery, objBody, objPath, requestContentType).then(function(resp){
            resp.status
            resp.response
        });
    \t};\r`
    //({})
    //getChainValue per marjen e $ref
    let _generate = function (oas)
    { 
        let strClosures = "";
        let typeMap = {};
        let url = oas.servers[0].url;
        for (let path in oas.paths)
        { 
            let strMethods = "";
            typeMap[path] = {};
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
                        requestContentType = ct;
                         //TODO: emer me intuitive per parametrin, rastin me $ref
                        if (oas.paths[path][method].requestBody.content[ct].schema)
                        {
                            
                        } else
                        { 
                            if (oas.paths[path][method].requestBody.content[ct].$ref)
                            { 
                                let typePath = oas.paths[path][method].requestBody.content[ct].$ref;
                                let typeChain = typePath.split('/');
                                typeChain.shift();
                                getChainValue(oas, typeChain);
                            }
                            
                        }//or $ref
                    }
                    params.push("requestBody");
                    objBody = "requestBody";
                }
                if (oas.paths[path][method].responses)
                { 
                    for (var r in oas.paths[path][method].responses)
                    { 
                        oas.paths[path][method].responses[r].content.JSON.schema
                        //type & properties
                        //TODO:
                        //nese ne vend te skema ka $ref atehere do procesojme tipin nga map e tipeve
                    }
                }
                //FixMe
                methodDoc += "\t\t* @returns {String} ";
                methodDoc += "\r\n\t\t*/";
                let arrMethod = method.split("/");
                method = arrMethod.last();
                
                strMethods += methodTemplate.formatUnicorn({"methodName":method, "methodDoc":methodDoc, "params":params.join(","), "requestContentType":requestContentType, "strObjQuery":strObjQuery, "objBody":objBody, "strObjPath":strObjPath});    
            }   
            let arrPath = path.split("/");
            let pathName = arrPath.last();
            let basePath = url + (url[url.length-1] != '/' && path[0]!= '/' ? '/' : '') + path;
            strClosures += pathTemplate.formatUnicorn({"path":pathName, "methods":strMethods, "basePath":basePath})+"\r\n"; 
        }
        console.log(strClosures);
        eval(strClosures)
    }
    //download("snowCrash.json.txt", jsonLayout); 
}
