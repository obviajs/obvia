var OAMethod = function (httpClient) {
    this.basePath = "";
    this.apiCall = function (objQuery, objBody, objPath, objType, method) {
        return httpClient
            .body(objBody)
            .type(objType)
            .query(objQuery)
            .path(objPath)
            .headers()//additional headers information
        [method](this.basePath, "text");
    };
};
export {
    OAMethod
};