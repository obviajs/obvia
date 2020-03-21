var ApiClient = function (_props) {
    let _defaultParams = {
        url: "https://cors-anywhere.herokuapp.com/pastebin.com/raw/tSKLhXA5",
        timeout: 50000,
        sendCookies: false,
        cache: false,
        queryParams: {},
        headers: {}
    };
    _props = extend(false, false, _defaultParams, _props);
    let _timeout = _props.timeout;
    let _xhr;
    let _methods = ["GET", "POST", "DELETE", "PUT"];
    let _responseTypes = ["text", "json", "blob", "document", "arraybuffer"];
    let _headers = _props.headers;
    let _sendCookies = _props.sendCookies;
    let _cache = _props.cache;
    let _queryParams = _props.queryParams;
    let _body = {};
    let _tbody = null;
    this.get = function (url, responseType = "json") {
        return _request(url, "GET", responseType);
    };
    this.post = function (url, responseType = "json") {
        return _request(url, "POST", responseType);
    };
    this.delete = function (url, responseType = "json") {
        return _request(url, "DELETE", responseType);
    };
    this.put = function (url, responseType = "json") {
        return _request(url, "PUT", responseType);
    };
    this.type = function (ct = 'application/json') {
        ct = ct.toLowerCase();
        _headers["Content-Type"] = ct;
        switch (ct) {
            case 'application/x-www-form-urlencoded':
                _tbody = new URLSearchParams(_body).toString();
                break;
            case 'form-data':
            case 'multipart/form-data':
                _tbody = new FormData();
                for (var key in _body) {
                    _tbody.append(key, _body[key]);
                }
                if(ct == "multipart/form-data")
                    _headers["Content-Type"] += "; charset=utf-8; boundary=" + Math.random().toString().substr(2);
                break;
            case 'json':
            case 'application/json':
                _tbody = JSON.stringify(_body);
                break;
        }
        return this;
    };
    this.agent = function (a) {
        _headers["User-Agent"] = a;
        return this;
    };
    this.headers = function (h) {
        _headers = extend(false, false, _headers, h);
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
    this.body = function (b) {
        _body = _normalizeParams(b);
        return this;
    };
    
    this.query = function (q) {
        _queryParams = _normalizeParams(q);
        return this;
    };
    this.path = function (p) {
        _pathParams = p;
        return this;
    };
    let _request = function (url, method, responseType = "json") {
        return new Promise((resolve, reject) => {
            if (method.toUpperCase() === 'GET' && _cache === false) {
                _queryParams['r'] = Math.random();
            }
            url = _buildUrl(url, _pathParams);
            if (url[url.length - 1] != '/') {
                url = url + '/';
            }
            url += "?" + new URLSearchParams(_queryParams).toString();
            // create an XHR object
            _xhr = new XMLHttpRequest();
            _xhr.withCredentials = _sendCookies;
            _xhr.timeout = _timeout;
            // listen for `onload` event
            _xhr.onload = () => {
                // process response
                resolve({ "status": _xhr.status, "response": _xhr.response || _xhr.responseText });
                return;
            };
            _xhr.onloadend = () => {
                console.log('onloadend');
            };
            _xhr.onerror = function(){
                reject({
                    status: this.status,
                    statusText: _xhr.statusText
                });
            };
            _xhr.onprogress = (event) => {
                // event.loaded returns how many bytes are downloaded
                // event.total returns the total number of bytes
                // event.total is only available if server sends `Content-Length` header
                console.log(`Downloaded ${event.loaded} of ${event.total}`);
            };
            _xhr.ontimeout = () => reject({
                status: -1,
                statusText: "request timeout"
            });
            _xhr.onreadystatechange = function () {
                if (_xhr.readyState == 1) {
                    console.log('Request started.');
                }
                
                if (_xhr.readyState == 2) {
                    console.log('Headers received.');
                }
                
                if (_xhr.readyState == 3) {
                    console.log('Data loading..!');
                }
                if (_xhr.readyState == 4) {
                    console.log('Ready State = 4');
                }
            };
            responseType = responseType.toLowerCase();
            if (_responseTypes.indexOf(responseType) > -1) {
                _xhr.responseType = responseType;
            } else
                reject({
                    status: -1,
                    statusText: "unsupported return type"
                });
                
            method = method.toUpperCase();
            if (_methods.indexOf(method) > -1)
                _xhr.open(method, url);
            else
                reject({
                    status: -1,
                    statusText: "unsupported method"
                });
            for (let header in _headers) {
                _xhr.setRequestHeader(header, _headers[header]);
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
        let newParams = {};
        for (let key in params) {
            if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
                let value = params[key];
                if (BinUtils.isFile(value) || BinUtils.isBlob(value) || Array.isArray(value)) {
                    newParams[key] = value;
                } if (isObject(value)) { 
                    newParams[key] = _normalizeParams(value);
                }
                else {
                    newParams[key] = _paramToString(value);
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
        if (param == undefined || param == null) {
            return '';
        }
        if (param instanceof Date) {
            return param.toJSON();
        }

        return param.toString();
    };
    /**
    * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
    * NOTE: query parameters are not handled here.
    * @param {String} path The path to append to the base URL.
    * @param {Object} pathParams The parameter values to append.
    * @returns {String} The encoded path with parameter values substituted.
    */
    let _buildUrl = function (url, pathParams) {
        if (url[url.length - 1] != '/') {
            url = url + '/';
        }
        url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
            var value;
            if (pathParams.hasOwnProperty(key)) {
                value = _paramToString(pathParams[key]);
            } else {
                value = fullMatch;
            }

            return encodeURIComponent(value);
        });

        return url;
    };
    
    //getResponseHeader('Content-Type');
    //xhr.getAllResponseHeaders();
};