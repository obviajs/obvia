let _cache = Cache.getInstance();

let url = "https://gaia.oxana.io/api/dataview_pid_1/yaml";

let generateAndLoadDataView = function (url, recordsPerPage) {
    let arr = url.split("/");
    let title = arr[4];
    let gen = new ApiClientGen({
        "url": url,
        requestBodyParamMode: 1,
        "title": "_" + title
    });
    let fullTitle = "GaiaAPI_" + title;
    let source = _cache.get(fullTitle);
    let p = source == null ? gen.generate() : Promise.resolve({"apiSrc": source, "apiTitle": fullTitle});
    return p.then(function (r) {
        _cache.set(r.apiTitle, r.apiSrc);
		_cache.persist();
        eval(r.apiSrc);
        let api = new (eval(r.apiTitle))();
        let raDvs = new RemoteArray(
            {
                "recordsPerPage": recordsPerPage,
                fetchPromise: function (p) {
                    let dvInp = new dvInput();
                    dvInp.tableData = new tableData({
                        currentRecord: p.startPage * p.recordsPerPage,
                        "recordsPerPage": p.recordsPerPage
                    });
                    return api[title + "Client"].post(dvInp);
                }
            }
        );
        return (new ArrayEx(raDvs)).init();
    });
};

generateAndLoadDataView(url, 10).then(function (aex) {
    console.log(aex);
});