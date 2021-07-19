
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var BrowserUtils = {};
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
            BrowserUtils.stringify(v, k) :
                //encodeURIComponent(k) + "=" + encodeURIComponent(v));
                k + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};
BrowserUtils.subParse = function (str) {
    let hash, obj = {};
    let stra = str.split("?");
    hash = stra[0].replace(/\#/g, "");
    obj[hash] = {};
    if (stra.length > 1) {
        str = stra[1];
        let objl2 = obj[hash];
        let map = str.split("&");
        let len = map.length;
        for (let i = 0; i < len; i++) {
            let pair = map[i].split("=");
            if (pair.length > 1) {
                let k = pair[0].replace(/\]/g, "").split("[");
                if (k.length > 1) {
                    ObjectUtils.setChainValue(objl2, k, pair[1], true);
                } else {
                    objl2[k[0]] = pair[1];
                }
            }             
        }      
    }
    return { "hash": hash, "map": obj };
};
BrowserUtils.parse = function (str) {
    let parts = str.split("#");
    parts.shift();
    let len = parts.length;
    let o = {}; let m = o;
    for (let i = 0; i < len; i++) {
        let p = BrowserUtils.subParse(parts[i]);
        if (p.hash) {
            m.hash = p.hash;
            m.map = p.map[p.hash];
            m.child = {};
            m = m.child;
        }
    }
    return o;
};
export {
    BrowserUtils
}