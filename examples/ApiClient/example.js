let url = "https://gaia.oxana.io/api/forms/yaml";
   
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
