import { EventDispatcher } from "/obvia/lib/EventDispatcher.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { BinUtils } from "/obvia/lib/BinUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";

var HttpClient = function (_props) {
    this.$el = $(this);
    let _defaultParams = {
        timeout: 600000,
        sendCookies: false,
        cache: false,
        queryParams: {},
        pathParams: {},
        headers: {},
        batching: false,
        batchUrl: "",
        retry: false,
        retryProps: {
            base: 2,
            exponent: 2,
            factor: 100,
            maxRetries: 2
        }
    };
    _props = ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _timeout = _props.timeout;
    let _batching = _props.batching;
    let _batchUrl = _props.batchUrl;
    let _xhr;
    let _methods = ["GET", "POST", "DELETE", "PUT"];
    let _responseTypes = ["text", "json", "blob", "document", "arraybuffer"];
    let _headers = _props.headers;
    let _sendCookies = _props.sendCookies;
    let _cache = _props.cache;
    let _queryParams = _props.queryParams;
    let _pathParams = _props.pathParams;
    let _body = {};
    let _tbody = null;
    let _self = this;

    let _base = _props.retryProps.base;
    let _exponent = _props.retryProps.exponent;
    let _factor = _props.retryProps.factor;
    let _retryTimeOut;
    let _retriesCount = 0;
    let _timeDisconnected;
    let _maxRetries = _props.retryProps.maxRetries;
    //we might want to persist/send to server this for later inspection/statistics
    let _connTimeLine = [];
    let _retry = _props.retry;

    let _batchRequests = [];
    let _batchBody = [];
    let _batchQuery = [];
    let _batchPath = [];
    let _batchHeaders = [];

    let _resetBatch = function () {
        _batchRequests = [];
        _batchBody = [];
        _batchQuery = [];
        _batchPath = [];
        _batchHeaders = [];
    };

    let _prepareUrl = function (url, pathParams, queryParams) {
        url = _buildUrl(url, pathParams);
        if (url[url.length - 1] != '/' && queryParams && Object.keys(queryParams).length > 0) {
            url = url + '/';
        }
        if (queryParams && Object.keys(queryParams).length > 0)
            url += "?" + new URLSearchParams(queryParams).toString();
        return url;
    };

    this.processBatch = function () {
        let ro = {
            "requests": []
        };
        let len = _batchRequests.length;

        for (let i = 0; i < len; i++) {
            let r = {
                "id": i,
                "method": _batchRequests[i].method,
                "url": _batchRequests[i].url,
                "body": _batchBody[i],
                "headers": _batchHeaders[i]
            };
            ro.requests.push(r);
        }

        let r = this.body(ro, true)
            .type()
            // .query()
            // .path()
            .headers({
                "Accept": "application/json"
            })
            .post(_batchUrl, "json", true);

        _resetBatch();
        return r;
    };

    this.get = function (url, responseType = "json") {
        if (_batching) {
            let ci = _batchRequests.length;
            url = _prepareUrl(url, _batchPath[ci], _batchQuery[ci]);
            _batchRequests.push({
                "url": url,
                "method": "GET",
                "responseType": responseType
            });
            return new Promise((resolve, reject) => {
                _self.on("xhrResolved", (e) => {
                    let cri = ArrayUtils.indexOfObject(e.responseObject.response, "id", ci);
                    let r = e.responseObject.response[cri];
                    let ro = {
                        "status": r.status,
                        "response": r.body
                    };
                    resolve(ro);
                });
                _self.on("xhrRejected", (e) => {
                    reject(e.responseObject);
                });
            });
        } else
            return _request(url, "GET", responseType);
    };

    this.post = function (url, responseType = "json", processBatch = false) {
        if (_batching && !processBatch) {
            _batchRequests.push({
                "url": url,
                "method": "POST",
                "responseType": responseType
            });
        } else
            return _request(url, "POST", responseType);
    };

    this.delete = function (url, responseType = "json") {
        if (_batching) {
            _batchRequests.push({
                "url": url,
                "method": "DELETE",
                "responseType": responseType
            });
        } else
            return _request(url, "DELETE", responseType);
    };

    this.put = function (url, responseType = "json") {
        if (_batching) {
            _batchRequests.push({
                "url": url,
                "method": "PUT",
                "responseType": responseType
            });
        } else
            return _request(url, "PUT", responseType);
    };

    this.head = function (url)
    {
        if (_batching) {
            _batchRequests.push({
                "url": url,
                "method": "HEAD",
                "responseType": null
            });
        } else
            return _request(url, "HEAD", null);
    };
    
    this.type = function (ct = 'application/json')
    {
        //reset headers
        delete _headers["Accept"];
        delete _headers["Content-Type"];

        ct = ct.toLowerCase();
        switch (ct) {
            case 'application/x-www-form-urlencoded':
                _tbody = new URLSearchParams(_body).toString();
                _headers["Content-Type"] = ct;
                break;
            case 'form-data':
            case 'multipart/form-data':
                if (_body && _body.toString() != "[object FormData]") {
                    _tbody = new FormData();
                    for (var key in _body) {
                        _tbody.append(key, _body[key]);
                    }
                } else {
                    _tbody = _body;
                }
                _headers["Accept"] = 'multipart/form-data';
                break;
            case 'json':
            case 'application/json':
                _tbody = JSON.stringify(_body);
                _headers["Content-Type"] = 'application/json';
                break;
        }
        return this;
    };
    this.agent = function (a) {
        _headers["User-Agent"] = a;
        return this;
    };
    this.headers = function (h) {
        _headers = ObjectUtils.extend(false, false, _headers, h);
        return this;
    };
    this.oauth2 = function (accessToken) {
        _headers["Authorization"] = 'Bearer ' + accessToken;
        return this;
    };
    this.basicAuth = function (username, password) {
        _headers["Authorization"] = 'Basic ' + btoa(`${username}:${password}`);
        return this;
    };

    this.body = function (b, processBatch = false) {
        if (_batching && !processBatch) {
            _batchBody.push(_normalizeParams(b));
        } else if (b && b.toString() != "[object FormData]")
            _body = _normalizeParams(b);
        else
            _body = b;
        return this;
    };

    this.query = function (q, processBatch = false) {
        if (_batching && !processBatch) {
            _batchQuery.push(_normalizeParams(q));
        } else
            _queryParams = _normalizeParams(q);
        return this;
    };

    this.path = function (p, processBatch = false) {
        if (_batching && !processBatch) {
            _batchPath.push(p);
        } else
            _pathParams = p;
        return this;
    };

    let _resetRetry = function () {
        if (_retry && _retriesCount > 0) {
            _base = _props.retryProps.base;
            if (_retryTimeOut != null) {
                clearTimeout(_retryTimeOut);
            }
            _retriesCount = 0;
            _connTimeLine.push({
                disconnectedAt: _timeDisconnected,
                connectedAt: new Date()
            });
            _timeDisconnected = null;
        }
    };

    let _request = function (url, method, responseType = "json") {
        let originalRequestArgs = arguments;
        return new Promise((resolve, reject) => {


            url = _prepareUrl(url, _pathParams, _queryParams);
            // create an XHR object
            _xhr = new XMLHttpRequest();
            _xhr.withCredentials = _sendCookies;
            _xhr.timeout = _timeout;
            // listen for `onload` event
            _xhr.onload = (e) => {
                _resetRetry();
                // process response
                let ro = {
                    "status": e.currentTarget.status,
                    "response": e.currentTarget.response || e.currentTarget.responseText
                };
                resolve(ro);
                let xhrResolved = jQuery.Event("xhrResolved");
                xhrResolved.originalEvent = e;
                if (_batching) {
                    //no need for JSON.parse as response property of xhr will contain the parsed json when content type is json
                }
                xhrResolved.responseObject = ro;
                _self.trigger(xhrResolved, [_self]);
            };
            _xhr.onloadend = () => {
                console.log('onloadend');
            };
            _xhr.onerror = function (e) {
                let ro = {
                    "status": this.status,
                    "statusText": e.currentTarget.statusText
                };
                reject(ro);
                let xhrRejected = jQuery.Event("xhrRejected");
                xhrRejected.responseObject = ro;
                xhrRejected.originalEvent = e;
                _self.trigger(xhrRejected, [_self]);
            };
            _xhr.onprogress = (event) => {
                // event.loaded returns how many bytes are downloaded
                // event.total returns the total number of bytes
                // event.total is only available if server sends `Content-Length` header
                let xhrProgress = jQuery.Event("xhrProgress");
                xhrProgress.originalEvent = event;
                _self.trigger(xhrProgress, [_self]);
            };

            _xhr.ontimeout = (e) => {
                if (_timeDisconnected == null) {
                    _timeDisconnected = new Date();
                }
                if (_retry && _retriesCount < _maxRetries) {
                    ++_retriesCount;
                    _base = Math.pow(_base, _exponent);
                    _retryTimeOut = setTimeout(function () {
                        _request.apply(_self, originalRequestArgs).then((ro) => resolve(ro)).catch((ro) => reject(ro));
                    }, _base * _factor);
                } else {
                    _resetRetry();
                    let ro = {
                        status: -1,
                        statusText: "Request timed out."
                    };
                    reject(ro);
                    let xhrRejected = jQuery.Event("xhrRejected");
                    xhrRejected.responseObject = ro;
                    xhrRejected.originalEvent = e;
                    _self.trigger(xhrRejected, [_self]);
                }
            };

            _xhr.onreadystatechange = function (event) {
                let xhrEvent;
                if (event.currentTarget.readyState == 1) {
                    xhrEvent = jQuery.Event("xhrStarted");
                } else if (event.currentTarget.readyState == 2) {
                    xhrEvent = jQuery.Event("xhrHeadersReceived");
                } else if (event.currentTarget.readyState == 3) {
                    xhrEvent = jQuery.Event("xhrDataReceived");
                } else if (event.currentTarget.readyState == 4) {
                    xhrEvent = jQuery.Event("xhrDone");
                }
                xhrEvent.originalEvent = event;
                _self.trigger(xhrEvent, [_self]);
            };
            responseType = responseType.toLowerCase();
            if (_responseTypes.indexOf(responseType) > -1) {
                _xhr.responseType = responseType;
            } else {
                let ro = {
                    "status": -1,
                    "statusText": "unsupported return type"
                };
                reject(ro);
                let xhrRejected = jQuery.Event("xhrRejected");
                xhrRejected.responseObject = ro;
                _self.trigger(xhrRejected, [_self]);
            }

            method = method.toUpperCase();
            if (_methods.indexOf(method) > -1)
                _xhr.open(method, url);
            else {
                let ro = {
                    "status": -1,
                    "statusText": "unsupported method"
                };
                reject(ro);
                let xhrRejected = jQuery.Event("xhrRejected");
                xhrRejected.responseObject = ro;
                _self.trigger(xhrRejected, [_self]);
            }

            for (let header in _headers) {
                _xhr.setRequestHeader(header, _headers[header]);
            }
            if (1 == 2 && _cache === false) {
                // via Cache-Control header:
                _xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
                // fallbacks for IE and older browsers:
                _xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
                _xhr.setRequestHeader("Pragma", "no-cache");
            }
            _xhr.send(_tbody);
        });
    };

    this.abort = function () {
        _xhr.abort();
    };
    /**
     * Normalizes parameter values:
     * <ul>
     * <li>remove nils</li>
     * <li>keep files and arrays</li>
     * <li>format to string with `paramToString` for other cases</li>
     * </ul>
     * @param {Object.<String, Object>} params The parameters as object properties.
     * @returns {Object.<String, Object>} normalized parameters.
     */
    let _normalizeParams = function (params) {
        let newParams;
        if (params && params.forEach) {
            let len = params.length;
            newParams = new Array(len);
            for (let i = 0; i < len; i++) {
                newParams[i] = _normalizeParams(params[i]);
            }
        } else {
            newParams = {};
            if (StringUtils.isString(params)) {
                newParams = params;
            } else {
                for (let key in params) {
                    if (params.hasOwnProperty(key) && params[key] != null) {
                        let value = params[key];
                        if (BinUtils.isFile(value) || BinUtils.isBlob(value) || Array.isArray(value)) {
                            newParams[key] = value;
                        } else if (ObjectUtils.isObject(value)) {
                            newParams[key] = _normalizeParams(value);
                        } else {
                            newParams[key] = _paramToString(value);
                        }
                    }
                }
            }
        }
        return newParams;
    };

    /**
     * Returns a string representation for an actual parameter.
     * @param param The actual parameter.
     * @returns {String} The string representation of <code>param</code>.
     */
    let _paramToString = function (param) {
        let r = param;
        if (param instanceof Date) {
            r = param.toJSON();
        }
        return r;
    };
    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
     * NOTE: query parameters are not handled here.
     * @param {String} path The path to append to the base URL.
     * @param {Object} pathParams The parameter values to append.
     * @returns {String} The encoded path with parameter values substituted.
     */
    let _buildUrl = function (url, pathParams) {
        if (url[url.length - 1] != '/' && pathParams && Object.keys(pathParams).length > 0) {
            url = url + '/';
        }
        let r = true;
        url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
            var value;
            if (pathParams.hasOwnProperty(key)) {
                value = _paramToString(pathParams[key]);
            } else {
                value = fullMatch;
            }
            r = false;
            return encodeURIComponent(value);
        });
        if (r && pathParams) {
            let values = Object.values(pathParams);
            let len = values.length;
            for (let i = 0; i < len; i++) {
                url += values[i] + (i == len - 1 ? "" : "/");
            }
        }
        return url;
    };

    Object.defineProperty(this, "xhr", {
        get: function xhr() {
            return _xhr;
        }
    });

    Object.defineProperty(this, "connTimeLine", {
        get: function connTimeLine() {
            return _connTimeLine;
        }
    });

    Object.defineProperty(this, "retry", {
        get: function retry() {
            return _retry;
        },
        set: function retry(v) {
            _retry = v;
        }
    });

    Object.defineProperty(this, "timeout", {
        get: function timeout() {
            return _timeout;
        },
        set: function timeout(v) {
            _timeout = v;
        }
    });
    //getResponseHeader('Content-Type');
    //xhr.getAllResponseHeaders();
};
HttpClient.prototype = Object.create(EventDispatcher.prototype);
export {
    HttpClient
};