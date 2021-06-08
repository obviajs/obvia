import { ApiClientGen } from "../../lib/ApiClientGen/ApiClientGen.js";
import { download } from "../../lib/my.js";

let urlArr = [
    //"https://gaia-oshee.oxana.io/api/applets/yaml"
    //"https://gaia-oshee.oxana.io/api/form_submit/yaml"
    "http://gaia-accounting/api/salesinvoices/yaml",
];

let generateApi;

for (let i = 0; i < urlArr.length; i++) {
    let url = urlArr[i];
    let arr = url.split("/");
    let title = arr[arr.length - 1];
    title = title == "yaml" ? arr[arr.length - 2] : title;
    title = title.split(".")[0];
    let gen = new ApiClientGen({
        url: url,
        requestBodyParamMode: 1,
        title: "_" + title,
    });

    gen
        .generate()
        .then(function (r) {
            generateApi = download(r.apiTitle + ".js", r.apiSrc);
        })

}

/*
 GaiaAPI_Utils.generateAndLoadDataView(url, 10).then(function (aex) {
    console.log(aex);
});
*/

export default generateApi