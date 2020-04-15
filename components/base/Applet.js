var Applet = function (_props) {
    let _defaultParams = {
        forceReload: false
    };
    _props = extend(false, false, _defaultParams, _props);
    let _self = this;
    let _forceReload = _props.forceReload;
    let _app = _props.app;
    let _mimeType = "application/json";
    //the url after # that will bring this view to focus
    let _urlHook = _props.urlHook;
    //a two way map, to convert between hashparams to internal params and vice versa
    let _map = new TwoWayMap(_props.map);
    //the url of the view json
    let _url = _props.url;
    //array of applet dependencies, recursive structure.
    let _applets = _props.applets;
    //the loaded JSON literal of the view
    let _literal;
    //the behaviors implementations (ex ctl)
    let _implementation;

    this.init = function () {
        return coroutine(function* () {
            let len = _applets;
            for (let i = 0; i < len; i++) {
                let applet = _applets[i];
                yield applet.init();
            }
            let rnd = _forceReload ? "?r=" + Math.random() : "";
            let r = yield Promise.all([
                get(_url + "main.json" + rnd, _mimeType),
                //import uses different starting point (currrent file directory)
                import("../../"+_url + "implementation.js" + rnd).then((module) => { _implementation = new module.Implementation(_app); })
            ]);
            _literal = JSON.parse(r[0].response);
            return _literal;
        });
    };

    
    Object.defineProperty(this, "url", {
        get: function url() {
            return _url;
        },
        configurable: true
    });

    Object.defineProperty(this, "urlHook", {
        get: function urlHook() {
            return _urlHook;
        },
        configurable: true
    });

    Object.defineProperty(this, "literal", {
        get: function literal() {
            return _literal;
        },
        configurable: true
    });

    Object.defineProperty(this, "implementation", {
        get: function implementation() {
            return _implementation;
        },
        configurable: true
    });
};
Applet.ctor = "Applet";