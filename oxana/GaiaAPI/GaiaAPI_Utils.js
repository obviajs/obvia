import { ApiClientGen } from "/flowerui/lib/ApiClientGen/ApiClientGen.js";
import { ArrayEx } from "/flowerui/lib/ArrayEx.js";

var GaiaAPI_Utils = {};
GaiaAPI_Utils.generateAndLoadDataView = function (url, recordsPerPage) {
    let arr = url.split("/");
    let title = arr[4];
    let gen = new ApiClientGen({
        "url": url,
        requestBodyParamMode: 1,
        "title": "_" + title
    });

    return gen.generate().then(function (r) {
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
export {
    GaiaAPI_Utils
};