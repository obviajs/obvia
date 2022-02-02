import { Container } from "/obvia/components/Container.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { coroutine } from "/obvia/lib/coroutine.js";
import { BrowserManager } from "/obvia/lib/BrowserManager.js";
import { BrowserUtils } from "/obvia/lib/BrowserUtils.js";
import { get } from "/obvia/lib/my.js";
import { Injector } from "/obvia/lib/Injector.js";
import { evalJSX } from "/obvia/lib/jsx/evalJSX.js";

var Applet = function (_props)
{
    this.$el = $(this);
    let r;
    let _defaultParams = {
        forceReload: false,
        mimeType: "application/json",
        behaviors: {},
        type: "",
        attr: {},
        lazy: true,
        fetchViewPromise: Applet.fetchViewJSON,
        fetchImplementationPromise: function (p)
        {
            let rnd = p.forceReload ? "?r=" + Math.random() : "";
            let _base = BrowserManager.getInstance().base;
            let _furl = _base + (p.url[0] == "." ? p.url.substr(1) : p.url);
            let _self = this;
            //import uses different starting point (currrent file directory)
            return import(_furl + p.anchor + ".js" + rnd).then((module) =>
            {
                return module[_self.anchor];
            });
        },
        defaultAppletsUiRoute: null,
        applets: [],
        defaultAppletIndex: null
    };
    if (!_props.id)
    {
        _props.id = _props.anchor;
    }
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _defaultAppletsUiRoute = _props.defaultAppletsUiRoute;
    let _fetchViewPromise = _props.fetchViewPromise;
    let _fetchImplementationPromise = _props.fetchImplementationPromise;
    let _self = this;
    let _parentApplet = _props.parentApplet;
    let _forceReload = _props.forceReload;
    let _app = _props.app;
    let _dataPromise = _props.dataPromise;
    let _data = {};
    let _uiRoute = _props.uiRoute;
    let _mimeType = _props.mimeType;
    let _lazy = _props.lazy;
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
    //the behaviors implementations (ex ctl)
    let _implementation;
    let _loaded = false;
    //Applet implementation skeleton
    let _behaviors = ObjectUtils.fromDefault({
        "beginDraw": "BEGIN_DRAW",
        "endDraw": "END_DRAW",
        "afterAttach": "AFTER_ATTACH",
        "beforeAttach": "BEFORE_ATTACH",
        "detached": "DETACHED",
        "init": "INIT",
        "enroute": "ENROUTE",
        "preroute": "PREROUTE"
    }, _props.behaviors);
    let _title = _props.title;
    let _defaultAppletIndex = _props.defaultAppletIndex;

    let _instIndexMap = { "0": 0 };
    this.route = async function (msg)
    {
        if ((_parentApplet == _app) || msg.hash == _anchor)
        {
            msg = msg || {};
            await _self.routeApplet(msg.map);
            let inst;
            if (msg.child && _appletsMap[msg.child.hash])
            {
                let appletIndex = msg.child.map.inst && msg.child.map.inst > -1 ? msg.child.map.inst : 0;
                appletIndex = _instIndexMap[appletIndex];
                if (appletIndex == null)
                {
                    let applet = _applets[_appletsMap[msg.child.hash][0].appletIndex];
                    _instIndexMap[appletIndex] = _applets.length;
                    inst = _self.addApplet(applet);
                } else
                    inst = _appletsMap[msg.child.hash][appletIndex];
            } else
            {
                if (_defaultAppletIndex != null && _applets[_defaultAppletIndex])
                {
                    msg.child = { "hash": _applets[_defaultAppletIndex].anchor };
                    inst = _appletsMap[_applets[_defaultAppletIndex].anchor][0];
                }
            }
            if (inst)
                await inst.route(msg.child);
        }
    };

    this.addApplet = function (applet)
    {
        applet.app = _self.app;
        applet.parentApplet = _self;
        _applets.push(applet);
        if (!_appletsMap[applet.anchor])
        {
            _appletsMap[applet.anchor] = [];
        }
        if (_defaultAppletsUiRoute && !applet.uiRoute)
        {
            applet.uiRoute = _defaultAppletsUiRoute;
        }
        let appletInst = new Applet(applet);
        appletInst.appletIndex = _applets.length - 1;
        _appletsMap[applet.anchor].push(appletInst);
        return appletInst;
    };

    let _updateHash = function ()
    {
        let regex = new RegExp('\\b' + _anchor + '\\b');
        let hash = BrowserManager.getInstance().hash;
        let arr = hash.split("#");
        let len = arr.length, m;
        for (let i = 0; i < len && !m; i++)
        {
            m = regex.exec(arr[i]);
            if (m)
            {
                arr[i] = _anchor + '?' + BrowserUtils.stringify(_msg);
                BrowserManager.getInstance().hash = arr.join("#");
            }
        }
    };
    let _proxy = {
        deleteProperty: function (target, property)
        {
            Reflect.deleteProperty(target, property);
            _updateHash();
            return true;
        },
        set: function (target, property, value, receiver)
        {
            target[property] = value;
            _updateHash();
            return true;
        },
        get(target, key)
        {
            if (typeof target[key] === 'object' && target[key] !== null)
            {
                return new Proxy(target[key], _proxy);
            } else
            {
                return target[key];
            }
        }
    };

    let _msg = {};
    let _proxiedMsg = new Proxy(_msg, _proxy);

    let _initAppletInternal = async function ()
    {
        let mp = new Promise(async (resolve, reject) =>
        {
            let ap;
            if (_loaded)
            {
                ap = Promise.resolve(_literal);
                await _routeApply();
                resolve(r);
            } else
            {
                let dp;
                ap = Promise.all([
                    _fetchViewPromise.call(r, _props),
                    _dataPromise ? (typeof _dataPromise == 'function' ? _dataPromise.call() : _dataPromise) : Promise.resolve(_data),
                    _fetchImplementationPromise.call(r, _props)
                ]).then(async (p) =>
                {
                    _data = Object.assign(p[1], _data);
                    let impCFN = p[2];
                    _self.bindingDefaultContext = _data;
                    //_implementation = new impCFN(_self, _proxiedMsg);
                    _implementation = await Injector.getInstance().inject(impCFN, {
                        "applet": _self,
                        "msg": _proxiedMsg
                    });
                    _implementation.guid = _self.guid;
                    _app.addImplementation(_implementation);
                    _literal = p[0];
                    //_self.components = [_literal];
                    dp = await _self.addComponents([_literal]);

                    _self.addBehaviors(_self, _behaviors, false);
                    _self.addBehaviors(_app, _app.defaultBehaviors, false);

                    if (_applets)
                    {
                        let len = _applets.length;
                        for (let i = 0; i < len; i++)
                        {
                            let applet = _applets[i];
                            applet.app = _app;
                            applet.parentApplet = _self;
                            if (!_appletsMap[_applets[i].anchor])
                            {
                                _appletsMap[_applets[i].anchor] = [];
                            }
                            if (_defaultAppletsUiRoute && !applet.uiRoute)
                            {
                                applet.uiRoute = _defaultAppletsUiRoute;
                            }
                            let inst = new Applet(applet);
                            inst.appletIndex = i;
                            _appletsMap[_applets[i].anchor].push(inst);
                        }
                    }
                }).catch((params) =>
                {
                    reject(params);
                });
                Promise.all([ap, dp]).then((async (l) =>
                {
                    await _routeApply();
                    resolve(r);
                }));
            }
        });
        return mp;
    };

    let _routeApply = async function ()
    {
        _self.trigger("preroute");
        let p;
        if (_uiRoute && typeof _uiRoute == 'function')
        {
            p = await _uiRoute.call(r, r);
        }
        _self.trigger("enroute");
        _loaded = true;
    };

    this.routeApplet = async function (msg)
    {
        ObjectUtils.inTheImageOf(msg, _msg);
        return _initAppletInternal();
    };

    this.initApplet = async function (msg)
    {
        //set the hash for this applet by stringifying msg     
        ObjectUtils.shallowCopy(msg, _proxiedMsg);
        return _initAppletInternal();
    };

    this.addBehaviors = function (cmps, behaviors, recurse = true)
    {
        var cmps = ObjectUtils.isObject(cmps) && !cmps.forEach ? [cmps] : cmps;
        let eventTypesJoined = "";
        for (let b in behaviors)
        {
            eventTypesJoined += " " + b;
        }
        let len = cmps.length;
        for (let i = 0; i < len; i++)
        {
            let cmp = cmps[i];
            _app.addBehaviors(_self.guid, cmp, behaviors);
            if (recurse)
            {
                for (let cid in cmp.children)
                {
                    this.addBehaviors(cmp.children[cid], behaviors);
                }
            }
        }
    };

    this.removeBehaviors = function (cmps, behaviors, recurse = true)
    {
        var cmps = ObjectUtils.isObject(cmps) && !cmps.forEach ? [cmps] : cmps;
        let eventTypesJoined = "";
        for (let b in behaviors)
        {
            eventTypesJoined += " " + b;
        }

        let len = cmps.length;
        for (let i = 0; i < len; i++)
        {
            let cmp = cmps[i];
            _app.removeBehaviors(_self.guid, cmp, behaviors);
            if (recurse)
            {
                for (let cid in cmp.children)
                {
                    this.removeBehaviors(cmp.children[cid], behaviors);
                }
            }
        }
    };

    Object.defineProperty(this, "url", {
        get: function url()
        {
            return _url;
        },
        configurable: true
    });

    Object.defineProperty(this, "loaded", {
        get: function loaded()
        {
            return _loaded;
        },
        configurable: true
    });

    Object.defineProperty(this, "anchor", {
        get: function anchor()
        {
            return _anchor;
        },
        configurable: true
    });

    Object.defineProperty(this, "literal", {
        get: function literal()
        {
            return _literal;
        },
        configurable: true
    });


    Object.defineProperty(this, "parentApplet", {
        get: function parentApplet()
        {
            return _parentApplet;
        },
        configurable: true
    });

    Object.defineProperty(this, "implementation", {
        get: function implementation()
        {
            return _implementation;
        },
        configurable: true
    });

    Object.defineProperty(this, "behaviors", {
        get: function behaviors()
        {
            return _behaviors;
        },
        configurable: true
    });

    Object.defineProperty(this, "app", {
        get: function app()
        {
            return _app;
        },
        configurable: true
    });

    Object.defineProperty(this, "data", {
        get: function data()
        {
            return _data;
        },
        configurable: true
    });

    Object.defineProperty(this, "appletsMap", {
        get: function appletsMap()
        {
            return _appletsMap;
        }
    });

    Object.defineProperty(this, "applets", {
        get: function applets()
        {
            return _applets;
        }
    });

    Object.defineProperty(this, "defaultAppletIndex", {
        get: function defaultAppletIndex()
        {
            return _defaultAppletIndex;
        },
        set: function defaultAppletIndex(v)
        {
            if (_defaultAppletIndex != v)
            {
                _defaultAppletIndex = v;
            }
        }
    });

    let _cachedScope = null
    this.invalidateScopeChain = function ()
    {
        _cachedScope = null;
    };

    this.getScopeChain = function ()
    {
        let scope = _cachedScope
        if (!_cachedScope)
        {
            scope = [];
            if (_self == this.bindingDefaultContext || this.proxyMaybe == this.bindingDefaultContext)
            {
                if (this.proxyMaybe)
                    scope.push(this.proxyMaybe);
                else
                    scope.push(this.bindingDefaultContext);
            } else if (this.proxyMaybe)
                scope.splice(scope.length, 0, this.bindingDefaultContext, this.proxyMaybe);
            else
                scope.splice(scope.length, 0, this.bindingDefaultContext, _self);

            if (this.parentApplet)
            {
                scope.splicea(scope.length, 0, this.parentApplet.getScopeChain())
            } else
                scope.push(window)
            _cachedScope = scope;
        }
        return scope;
    };
    r = Container.call(_self, _props);
    return r;
};
Applet.ctor = "Applet";
Applet.fetchViewJSON = function (p)
{
    let rnd = p.forceReload ? "?r=" + Math.random() : "";
    let _base = BrowserManager.getInstance().base;
    let _furl = _base + (p.url[0] == "." ? p.url.substr(1) : p.url);
    return get(_furl + p.anchor + ".json" + rnd, p.mimeType).then(function (r)
    {
        return JSON.parse(r.response);
    });
};
Applet.fetchViewJSX = function (p)
{
    let rnd = p.forceReload ? "?r=" + Math.random() : "";
    let _base = BrowserManager.getInstance().base;
    let _furl = _base + (p.url[0] == "." ? p.url.substr(1) : p.url);
    return get(_furl + p.anchor + ".jsx" + rnd, p.mimeType).then(function (r)
    {
        return evalJSX(r.response);
    });
};
export
{
    Applet
};