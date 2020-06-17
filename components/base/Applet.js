var Applet = function (_props) {
    let _defaultParams = {
        forceReload: false,
        behaviors: {
            "beginDraw": "BEGIN_DRAW",
            "endDraw": "END_DRAW"
        },
        attr: {}
    };
    _props = extend(false, false, _defaultParams, _props);
    let _self = this;
    let _parent = _props.parent;
    let _forceReload = _props.forceReload;
    let _app = _props.app;
    let _dataPromise = _props.dataPromise;
    let _data = _props.data;
    let _uiRoute = _props.uiRoute;
    let _port = _props.port;
    let _attr = _props.attr;
    let _mimeType = "application/json";
    //the url after # that will bring this view to focus
    let _anchor = _props.anchor;
    //a two way map, to convert between hashparams to internal params and vice versa
    let _map = new TwoWayMap(_props.map);
    //the url of the view json
    let _url = _props.url;
    //array of applet dependencies, recursive structure.
    let _applets = _props.applets;
    //the loaded JSON literal of the view
    let _literal;
    //the component instance of the view
    let _view;
    //the behaviors implementations (ex ctl)
    let _implementation;
    let _loaded = false;
    let _base = BrowserManager.getInstance().base;
    let _furl = _base + (_url[0] == "." ? _url.substr(1) : _url);
    //Applet implementation skeleton
    let _behaviors = _props.behaviors;
    
    this.init = function () {
        return (!_loaded ? coroutine(function* () {
            let rnd = _forceReload ? "?r=" + Math.random() : "";
            let r = yield Promise.all([
                get(_furl + _anchor + ".json" + rnd, _mimeType),
                //import uses different starting point (currrent file directory)
                import(_furl + _anchor + ".js" + rnd),
                _dataPromise ? (typeof _dataPromise == 'function' ? _dataPromise.call() : _dataPromise) : Promise.resolve(_data)
            ]).then((p) => { 
                let module = p[1];
                _data = p[2];
                _implementation = new module.Implementation(_self);
                _implementation.guid = StringUtils.guid();
                return p;
            });
            
            _literal = JSON.parse(r[0].response);
            _literal.props.bindingDefaultContext = _data;
            _view = Component.fromLiteral(_literal);
            _app.addImplementation(_implementation);
            
            _self.addBehaviors(_view, _behaviors, false);
            
            let len = _applets;
            for (let i = 0; i < len; i++) {
                let applet = _applets[i];
                applet.app = _app;
                applet.parent = _view;
                let inst = new Applet(applet);
                yield inst.init();
            }
            return _literal;
        }) : Promise.resolve(_literal)).then(((l) => { 
            let p;
            if (_uiRoute && typeof _uiRoute == 'function') {
                p = _uiRoute.call(_self, _self);
            }
            _loaded = true;
            return p;
        }));
    };
    
    this.addBehaviors = function (cmps, behaviors, recurse = true) {
        var cmps = isObject(cmps) && !cmps.forEach?[cmps]:cmps;
        let eventTypesJoined = "";
        for (let b in behaviors) {
            eventTypesJoined += " " + b;
        }
        EventDispatcher.listen(cmps, eventTypesJoined, _proxyHandler);
        //cmp.on(eventTypesJoined, _proxyHandler);
        _app.addBehaviors(cmps, behaviors, recurse);
    };
    
    let _proxyHandler = function (e) {
        //add implementation guid so App.js will know which behavior implementation to execute
        e.guid = _implementation.guid;        
    };

    Object.defineProperty(this, "url", {
        get: function url() {
            return _url;
        },
        configurable: true
    });

    Object.defineProperty(this, "loaded", {
        get: function loaded() {
            return _loaded;
        },
        configurable: true
    });

    Object.defineProperty(this, "anchor", {
        get: function anchor() {
            return _anchor;
        },
        configurable: true
    });

    Object.defineProperty(this, "literal", {
        get: function literal() {
            return _literal;
        },
        configurable: true
    });

    Object.defineProperty(this, "parent", {
        get: function parent() {
            return _parent;
        },
        configurable: true
    });

    Object.defineProperty(this, "port", {
        get: function port() {
            return _port;
        },
        configurable: true
    });
    
    Object.defineProperty(this, "attr",
    {
        get: function attr() {
            return _attr;
        },
        enumerable: true
    });
    
    Object.defineProperty(this, "implementation", {
        get: function implementation() {
            return _implementation;
        },
        configurable: true
    });

    Object.defineProperty(this, "behaviors", {
        get: function behaviors() {
            return _behaviors;
        },
        configurable: true
    });

    Object.defineProperty(this, "app", {
        get: function app() {
            return _app;
        },
        configurable: true
    });

    Object.defineProperty(this, "data", {
        get: function data() {
            return _data;
        },
        configurable: true
    });

    Object.defineProperty(this, "view", {
        get: function view() {
            return _view;
        },
        configurable: true
    });
};
Applet.ctor = "Applet";