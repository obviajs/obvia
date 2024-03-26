import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { get } from "/obvia/lib/my.js";

var OaiFnCallsGen = function (_props)
{
    let _defaultParams = {
        url: "yaml_or_json__url",
        specificationFormat:"yaml",
        requestBodyParamMode: 1,
        title: "",
        forceReload: false
    };
    ObjectUtils.fromDefault(_defaultParams, _props);

    if (_props.forceReload)
    {
        let parts = _props.url.split("/");
        if (parts[parts.length - 1].contains('?'))
        {
            _props.url += "&r=" + Math.random();
        } else
            _props.url += "?r=" + Math.random();
    }
    let _title = _props.title;
    let _specificationFormat = _props.specificationFormat;
    const regex = /\{.*?\}/g; // Regular expression to match content inside curly brackets

    let requestBodyParamMode = _props.requestBodyParamMode;
    let _httpMethods = ["get", "post", "delete", "put", "patch"];
    this.generate = function ()
    {
        return get(_props.url).then(async function (r)
        {
            let oas;
            if(_specificationFormat=="yaml")
                oas = YAML.parse(r.response);
            else 
                oas = JSON.parse(r.response);
            
            oas = await JSONRef.resolveRefs(oas, {resolveCirculars: true}); 
            return _generate(oas.resolved);
        });
    };

    let _generate = function (oas)
    {
        let url = oas.servers[0].url;
        let apiTitle = StringUtils.convertToCamelCase(_title || oas.info.title);
        let pathsInfo = [];
        for (let path in oas.paths)
        {
            let methodsInfo = [];
            let responseInfo = {};
            for (let method in oas.paths[path])
            {
                if (_httpMethods.indexOf(method.toLocaleLowerCase()) < 0)
                {
                    throw new Error(method + " is not a valid http method.");
                }
                let paramsInfo = [];

                if (oas.paths[path][method].parameters)
                {
                    let pLen = oas.paths[path][method].parameters.length;
                    for (let i = 0; i < pLen; i++)
                    {
                        let param = oas.paths[path][method].parameters[i];
                        paramsInfo.push({
                            "type": param.schema.type,
                            "title": param.name,
                            "usedIn": param.in,
                            "description": param.description
                        });                  
                    }
                }
                let requestContentType = "application/json";
                if (oas.paths[path][method].requestBody && oas.paths[path][method].requestBody.content)
                {
                    for (let ct in oas.paths[path][method].requestBody.content)
                    {
                        requestContentType = ct.toLowerCase();
                        let typeInfo;
                        if (oas.paths[path][method].requestBody.content[ct].schema.type)
                        {
                            typeInfo = oas.paths[path][method].requestBody.content[ct].schema;
                        } else if (oas.paths[path][method].requestBody.content[ct].schema.$ref)
                        {
                            let typePath = oas.paths[path][method].requestBody.content[ct].schema.$ref;
                            let typeChain = typePath.split('/');
                            typeChain.shift();
                            typeInfo = ObjectUtils.getChainValue(oas, typeChain);
                            typeInfo.title = typeChain.last() || typeInfo.title;
                        }
                        let typeDefined = typeInfo.title != null;
                        typeInfo.title = typeInfo.title || StringUtils.convertToCamelCase(method + "RequestBody" + "_" + path.split("/").last());
                        typeInfo.type = typeInfo.type || "object";
                        if ((requestBodyParamMode == 2 || !typeDefined) && typeInfo.type == "object")
                        {
                            let memberTypeInfo = typeInfo;
                            for (let prop in typeInfo.properties)
                            {
                                if (typeInfo.properties[prop].type == "object")
                                {
                                    memberTypeInfo = typeInfo.properties[prop];

                                } else if (typeInfo.properties[prop].$ref)
                                {
                                    let typePath = typeInfo.properties[prop].$ref;
                                    let typeChain = typePath.split('/');
                                    typeChain.shift();
                                    memberTypeInfo = ObjectUtils.getChainValue(oas, typeChain);
                                    memberTypeInfo.title = typeChain.last() || memberTypeInfo.title;
                                } 
                                paramsInfo.push({
                                    "type": memberTypeInfo.properties?.[prop].type || memberTypeInfo.type,
                                    "title": prop,
                                    "usedIn": "body",
                                    "description": memberTypeInfo.properties?.[prop].description || memberTypeInfo.description,
                                    "items": memberTypeInfo.items
                                });
                            }
                        } else if (requestBodyParamMode == 1 || typeInfo.type == "array")
                        {
                            let props;
                            if (ObjectUtils.isObject(typeInfo.properties))
                                props = Object.keys(typeInfo.properties);

                            if (props != null && props.length == 1)
                            {
                                typeInfo = typeInfo.properties[props[0]];
                                typeInfo.title = typeInfo.title || props[0];
                            } 
                            paramsInfo.push({ ...typeInfo, usedIn: "body" });
                        }
                        break;
                    }
                }
                if (oas.paths[path][method].responses)
                {
                    for (let r in oas.paths[path][method].responses)
                    {
                        for (let ct in oas.paths[path][method].responses[r].content)
                        {
                            let typeInfo;
                            if (oas.paths[path][method].responses[r].content[ct].schema.type)
                            {
                                typeInfo = oas.paths[path][method].responses[r].content[ct].schema;
                                let strPath = path.replace(regex, '');
                                let arrStrPath = strPath.split("/");
                                for(let i=0;i<arrStrPath.length;i++){
                                    if(arrStrPath[i].trim() != "")
                                        strPath = arrStrPath[i];
                                }
                                typeInfo.title = typeInfo.title || StringUtils.convertToCamelCase(method + "ResponseBody" + "_" + strPath);
                                typeInfo.type = typeInfo.type || "object";
                            } else if (oas.paths[path][method].responses[r].content[ct].schema.$ref)
                            {
                                let typePath = oas.paths[path][method].responses[r].content[ct].schema.$ref;
                                let typeChain = typePath.split('/');
                                typeChain.shift();
                                typeInfo = ObjectUtils.getChainValue(oas, typeChain);
                                typeInfo.title = typeChain.last() || typeInfo.title;
                            }
               
                            responseInfo[r] =  typeInfo;
                        }
                    }
                }
                let arrMethod = method.split("/");
                let methodName = arrMethod.last();
                let summaryInfo = oas.paths[path][method].summary;

                methodsInfo.push({
                    "methodName": methodName,
                    "params": paramsInfo,
                    "requestContentType": requestContentType,
                    "responses": responseInfo,
                    "summary": summaryInfo
                });
            }
            let arrPath = path.split("/");
            let pathName;
            do
            {
                pathName = arrPath.last();
                arrPath.pop();
            } while (pathName.indexOf("{") > -1);
            pathName = StringUtils.convertToCamelCase(pathName);
            let basePath = (url[url.length - 1] != '/' && path[0] != '/' ? '/' : '') + path;
            pathsInfo.push({
                "path": pathName,
                "methods": methodsInfo,
                "basePath": basePath
            });
        }
        return {
            "apiTitle": apiTitle.replace(/ /g, ''),
            "apiInfo": {
                "paths": pathsInfo,
                "server": url
            }
        };
    };
};
export
{
	OaiFnCallsGen
};
