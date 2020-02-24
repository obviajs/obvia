var OAMethod = function (apiClient) {
    this.basePath = "";
    this.apiCall = function (objQuery, objBody, objPath, objType, method) {
        return apiClient
            .body(objBody)
            .type(objType)
            .query(objQuery)
            .path(objPath)
            .headers()//additional headers information
        [method](this.basePath, responseType = "text");
    };
};
