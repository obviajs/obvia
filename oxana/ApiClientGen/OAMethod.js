var OAMethod = function (apiClient)
{     
    this.basePath = "";
    this.apiCall = function (objQuery, objBody, objPath, objType)
    { 
        return apiClient
            .body(objBody)
            .type(objType)
            .query(objQuery)
            .path(objPath)
            .headers()//additional headers information
            .get(this.basePath, responseType = "text");
    };   
}
