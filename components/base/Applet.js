var Applet = function (_props) {
    this.$el = $(this);
    let _defaultParams = {
        forceReload: false,
        behaviors: {
            "beginDraw": "BEGIN_DRAW",
            "endDraw": "END_DRAW",
            "afterAttach": "AFTER_ATTACH",
            "beforeAttach": "BEFORE_ATTACH",
            "detached": "DETACHED",
            "init": "INIT"
        },
        attr: {},
        lazy: true,
        guid: StringUtils.guid()
    };
    _props = extend(false, false, _defaultParams, _props);
    let _self = this;
    let _parent = _props.parent;
    let _forceReload = _props.forceReload;
    let _app = _props.app;
    let _dataPromise = _props.dataPromise;
    let _data = _props.data;
    let _uiRoute = _props.uiRoute;
    let _attr = _props.attr;
    let _mimeType = "application/json";
    let _lazy = _props.lazy;
    let _guid = _props.guid;
    //the url after # that will bring this view to focus
    let _anchor = _props.anchor;
    //a two way map, to convert between hashparams to internal params and vice versa
    //let _map = new TwoWayMap(_props.map);
    //the url of the view json
    let _url = _props.url;
    //array of applet dependencies, recursive structure.
    let _applets = _props.applets;
    //dictionary of applet instances, recursive structure.
    let _appletsMap = {};
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
    let _title = _props.title;

    this.route = function (msg) {
        if ((_parent == _app) || msg[_anchor]) {
            return coroutine(function* () {
                let p = yield _self.init(msg[_anchor]);

                let pc = [p];
                if (msg[_anchor]) {
                    for (let _canchor in _appletsMap) {
                        if (msg[_anchor][_canchor]) {
                            let inst = _appletsMap[_canchor];
                            pc.push(yield inst.route(msg[_anchor]));
                        }
                    }
                }
                return Promise.all(pc);
            });
        }
    };

    this.buildHash = function (s) {
        let inst = s ? s : _self;

        return inst.parent == inst.app ? "#" + inst.anchor + "?" : this.buildHash(inst.parent) + inst.anchor;
    };
    let _amPresent = function () {

    };

    let _map = {};
    this.init = function (msg) {
        //set default hash for this applet. This will be executed only when applet was inited by calling init()
        //getChainValue(host, chain)
        let m = BrowserUtils.parse(BrowserManager.getInstance().hash);
        if (m.hash && m.hash != _anchor) {
            // BrowserManager.getInstance().pushState(null, _app.title || _title, "#" + _anchor);
        }
        _backWards(m);
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
                _implementation = new module.Implementation(_self, msg);
                _implementation.guid = _guid;
                _app.addImplementation(_implementation);
                return p;
            });

            _literal = JSON.parse(r[0].response);
            _literal.props.bindingDefaultContext = _data;
            _view = Component.fromLiteral(_literal);

            _self.addBehaviors(_view, _behaviors, false);
            _self.addBehaviors(_app, _app.defaultBehaviors, false);

            if (_applets) {
                let len = _applets.length;
                for (let i = 0; i < len; i++) {
                    let applet = _applets[i];
                    applet.app = _app;
                    applet.parent = _self;
                    let inst = _appletsMap[_applets[i].anchor] = new Applet(applet);
                    inst.on("appletInit", _appletInit);
                }
            }
            return _self;
        }) : Promise.resolve(_literal)).then(((l) => {
            let evt = jQuery.Event("appletInit");
            evt.map = {};
            if (msg)
                _map[_anchor] = evt.map[_anchor] = msg;
            else {
                _map[_anchor] = evt.map[_anchor] = {};
            }
            _self.trigger(evt);
            let p;
            if (_uiRoute && typeof _uiRoute == 'function') {
                p = _uiRoute.call(_self, _self);
            }
            _loaded = true;
            return _self;
        }));
    };

    let _backWards = function (m) {
        let chain = [],
            p = _self.parent;
        while (p.ctor != 'App') {
            chain.unshift(p.anchor);
            p = p.parent;
        }
        let mm = getChainValue(m.map, chain);
    };

    this.addBehaviors = function (cmps, behaviors, recurse = true) {
        var cmps = isObject(cmps) && !cmps.forEach ? [cmps] : cmps;
        let eventTypesJoined = "";
        for (let b in behaviors) {
            eventTypesJoined += " " + b;
        }
        let len = cmps.length;
        for (let i = 0; i < len; i++) {
            let cmp = cmps[i];
            _app.addBehaviors(_guid, cmp, behaviors);
            if (recurse && !cmp.hasInternalComponents) {
                for (let cid in cmp.children) {
                    this.addBehaviors(cmp.children[cid], behaviors);
                }
            }
        }
    };

    this.removeBehaviors = function (cmps, behaviors, recurse = true) {
        var cmps = isObject(cmps) && !cmps.forEach ? [cmps] : cmps;
        let eventTypesJoined = "";
        for (let b in behaviors) {
            eventTypesJoined += " " + b;
        }

        let len = cmps.length;
        for (let i = 0; i < len; i++) {
            let cmp = cmps[i];
            _app.removeBehaviors(_guid, cmp, behaviors);
            if (recurse && !cmp.hasInternalComponents) {
                for (let cid in cmp.children) {
                    this.removeBehaviors(cmp.children[cid], behaviors);
                }
            }
        }
    };

    let _appletInit = function (e) {
        if (e.target != _self && _appletsMap[e.target.anchor] && e.currentTarget != _self) {
            //extend e and trigger
            _map[_anchor][e.target.anchor] = e.map[e.target.anchor];
            e.map = _map;
            //_self.trigger(e);
        }
        console.log("Applet init event: ", e.map);
    };

    this.on("appletInit", _appletInit);

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

    Object.defineProperty(this, "attr", {
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

    Object.defineProperty(this, "guid", {
        get: function guid() {
            return _guid;
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

    Object.defineProperty(this, "appletsMap", {
        get: function appletsMap() {
            return _appletsMap;
        }
    });

    Object.defineProperty(this, "applets", {
        get: function applets() {
            return _applets;
        }
    });
};
Applet.ctor = "Applet";
Applet.prototype = Object.create(EventDispatcher.prototype);