let url = "https://gaia.oxana.io/api/process_users/yaml";
    //"https://gaia.oxana.io/api/users/yaml";
//http://flower-gaia/api/processes/yaml
//http://flower-gaia/api/process_role_status_forms/yaml
//http://flower-gaia/api/users/yaml
//http://flower-gaia/api/process_users/yaml

let arr = url.split("/");
let title = arr[4];
let gen = new ApiClientGen({
    "url": url,
    requestBodyParamMode: 1,
    "title": "_" + title
});

gen.generate().then(function (r) {
    download(r.apiTitle + ".js", r.apiSrc);

}).then(function () {
    console.log();
});

/*
 GaiaAPI_Utils.generateAndLoadDataView(url, 10).then(function (aex) { 
    console.log(aex);
});
*/