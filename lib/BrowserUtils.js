BrowserUtils = {};
BrowserUtils.get = function (name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
};
BrowserUtils.body = function (htmlContent) {
    let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
    let array_matches = pattern.exec(htmlContent);
    return array_matches[1];
};
BrowserUtils.removeScripts = function (htmlContent) {
    let SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (SCRIPT_REGEX.test(htmlContent)) {
        htmlContent = htmlContent.replace(SCRIPT_REGEX, "");
    }
    return htmlContent;
};
BrowserUtils.stringify = function (obj, prefix) {
    let str = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                stringify(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};
BrowserUtils.parse = function (str) {
    let hash, obj;
    let stra = str.split("?");
    hash = stra[0].replace(/\#/g, "");
    if (stra.length > 1) {
        str = str[1];
        let map = str.split("&");
        let len = map.length;
        for (let i = 0; i < len; i++) {
            let pair = map[i].split("=");
            let k = pair[0].replace(/\]/g, "").split("[");
            if (k.length > 1) {
                setChainValue(obj, k, pair[1], true);
            } else {
                obj[k[0]] = pair[1];
            }
        }
    }
    return { "hash": hash, "map": obj };
};