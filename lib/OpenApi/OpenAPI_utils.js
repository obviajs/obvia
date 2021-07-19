import { Cache } from "/obvia/lib/cache/Cache.js";
import { ApiClientGen } from "/obvia/lib/OpenApi/ApiClientGen.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { BrowserManager } from "/obvia/lib/BrowserManager.js";

let OpenAPI_utils = {};
OpenAPI_utils.get = function (url) {
    let cache = Cache.getInstance();
    let arr = url.split("/");
    let title = arr[4];
    let gen = new ApiClientGen({
        "url": url,
        requestBodyParamMode: 1,
        "title": "_" + title,
        importsBaseUrl: BrowserManager.getInstance().base
    });
    let fullTitle = "GaiaAPI_" + title;
    let source = cache.get(fullTitle), p;
    if (source == null) {
        p = gen.generate().then((r) => {
            cache.set(r.apiTitle, r.apiSrc);
            cache.persist();
            const dataUri = 'data:text/javascript;charset=utf-8,'
                + encodeURIComponent(r.apiSrc);
            return import(dataUri).then((module) => {
                r.inst = new module[r.apiTitle]();
                r.title = title;
                r.constructor = module[r.apiTitle];
                return r;
            });            
        });
    } else {
        let r = { "apiSrc": source, "apiTitle": fullTitle, "title": title };
        const dataUri = 'data:text/javascript;charset=utf-8,'
                + encodeURIComponent(source);
        p = import(dataUri).then((module) => {            
            r.inst = new module[r.apiTitle]();
            r.constructor = module[r.apiTitle];
            //p = Promise.resolve(r);
            return r;
        });
    }
    return p;
};
export {
    OpenAPI_utils
};