let url = "http://flower-gaia/api/dataview_pid_1/yaml";
GaiaAPI_Utils.generateAndLoadDataView(url, 10).then(function (aex) { 
    console.log(aex);
});
/*    
let arr = url.split("/");
let title = arr[4];
let gen = new ApiClientGen({
    "url": url,
    requestBodyParamMode: 1,
    "title": "_" + title  
});
//gen.
Builder = {};
Builder.providerValueField = "dataview_id";
Builder.data = [];

gen.generate().then(function (r) { 
    //download(r.apiTitle + ".js", r.apiSrc); 
    eval(r.apiSrc);
    let api = new (eval(r.apiTitle))();
    let raDvs = new RemoteArray(
        {
            recordsPerPage: 10,
            fetchPromise: function (p) {
                let dvInp = new dvInput();
                dvInp.tableData = new tableData({
                    currentRecord: p.startPage * p.recordsPerPage,
                    recordsPerPage: p.recordsPerPage
                });
                return api[title+"Client"].post(dvInp);
            }
        }
    );
    Builder.data[1] = new ArrayEx(raDvs); 
    return Builder.data[1].init();
}).then(function () { 
    console.log(Builder.data[1]);
});
*/
 