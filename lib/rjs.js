/*
 * @package Micro-RequireJs
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 */
var rjs = {};
rjs.options = {
    basepath: location.origin
};
/**
* Create loader element according to CSS strategy
*
* @param {string} file
* @returns {HTMLElement}
*/
rjs.cssStrategy = function (file, callback) {
    var el = window.document.createElement("link");
    el.type = "text/css";
    el.onload = callback;
    el.rel = "stylesheet";
    el.href = (rjs.options.basepath && (file.indexOf("http") < 0) ? rjs.options.basepath : "") + file;
    el.async = true;
    return el;
};
/**
* Create loader element according to JavaScript strategy
*
* @param {string} file
* @returns {HTMLElement}
*/
rjs.jsStrategy = function (file, callback) {
    var el = window.document.createElement("script");
    el.type = "text/javascript";
    el.onload = callback;
    el.src = (rjs.options.basepath && (file.indexOf("http") < 0) ? rjs.options.basepath : "") + file;
    el.async = true;
    return el;
};

rjs.buildLoaderElement = function (file, callback) {
    var ext = file.split(".").pop().toLowerCase();
    let i = ext.indexOf("?");
    if (i > -1) {
        ext = ext.substr(0, i);
    }
    if (ext.indexOf("js") > -1) {
        ext = "js";
    } else if (ext.indexOf("css") > -1)
        ext = "css";

    switch (ext) {
        case "css":
            return rjs.cssStrategy(file, callback);
        case "js":
            return rjs.jsStrategy(file, callback);
    }
    throw new Error("Unknown file extension " + ext);
};

rjs.define = function (file) {
    return new Promise((resolve, reject) => {
        let el = rjs.buildLoaderElement(file.trim(), (e) => {
            resolve(file);
        });
        // make it seekable
        el.setAttribute("data-rjs", true);
        window.document.body.appendChild(el);
    });
};
/**
* Remove from DOM any assets loaded by RJS
*/
rjs.reset = function () {
    let scripts = document.querySelectorAll("script[data-rjs]"),
        links = document.querySelectorAll("link[data-rjs]");
    [].concat(scripts, links).forEach(function (el) {
        if (el.type) {
            el.parentNode.removeChild(el);
        }
    });
};
export {
    rjs
};