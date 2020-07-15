var App = function(_props){
    let _defaultParams = {
        idleInterval: 60000,
        inactivityInterval: 60000,
        components:[],
        historyProps: { enabled: true },
        type: ContainerType.NONE,
        guid: StringUtils.guid(),
        defaultAppletIndex: 0
    };

    _props = extend(false, false, _defaultParams, _props);
    let _self = this;
    let _idleTime = 0;
    let _idleInterval = _props.idleInterval;
    let _inactivityInterval = _props.inactivityInterval;
    let _style = _props.style;
    let _historyProps = _props.historyProps;
    let _history;
    let _applets = _props.applets;
    let _browserManager = BrowserManager.getInstance();
    let _guid = _props.guid;
    let _title;
    let _defaultAppletIndex = _props.defaultAppletIndex;

    if(_style)
    {
        $("<style id='"+_self.domID+"_style' type='text/css'>"+_style+"</style>").appendTo("head");
    }

    Object.defineProperty(this, "title", {
        get: function title() {
            return _title;
        },
        set: function title(v) { 
            if (title != v) { 
                _browserManager.title = _title = v;
            }
        },
        configurable: true
    });

    Object.defineProperty(this, 'history',
    {
        get: function history() {
            return _history;
        }
    });

    let timerIncrement = function () {
        _idleTime = _idleTime + _idleInterval;
        if (_idleTime >= _inactivityInterval) {
            let idleCount = Math.floor(_idleTime / _inactivityInterval);
            let evt = jQuery.Event("InactivityDetected");
            evt.guid = _guid;
            _self.trigger(evt, [_idleTime, idleCount]);
        }
    };
    let t = setInterval(timerIncrement, _idleInterval); 

    let _visible = true;
    let visibilityEvents = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'];
    visibilityEvents.forEach(function (event){
        window.addEventListener(event, function (event){
            if (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden) {
                if (_visible){
                    _visible = false;
                    let evt = jQuery.Event("WindowHide");
                    evt.guid = _guid;
                    _self.trigger(evt, []);
                }
            } else {
                if (!_visible){
                    _visible = true;
                    let evt = jQuery.Event("WindowShow");
                    evt.guid = _guid;
                    _self.trigger(evt, []);
                }
            }
        });
    });
    
    let _behaviors = new AutoObject();
    
    Object.defineProperty(this, 'behaviors',
    {
        get: function () {
            return _behaviors;
        },
        set: function (v) {
            if (_behaviors != v) { 
                _behaviors = v;
            }
        }
    });
    let _behaviorimplementations = new AutoObject();
    Object.defineProperty(this, 'behaviorimplementations',
    {
        get: function () {
            return _behaviorimplementations;
        },
        set: function (v) {
            if (_behaviorimplementations != v) { 
                _behaviorimplementations = v;
            }
        }
    });
    
    let _initDefaultBehaviors = function () {
        if (_historyProps.enabled) {
            _history = History.getInstance(".history_" + _self.domID);
            /*_history.on(HistoryEventType.HISTORY_UNDONE + " " + HistoryEventType.HISTORY_REDONE + " " + HistoryEventType.HISTORY_STEP_ADDED, function (e) {
                _self.trigger(e);
            });
            */
            let historyBehaviors = {};
            historyBehaviors[HistoryEventType.HISTORY_UNDONE] = "HISTORY_UNDONE";
            historyBehaviors[HistoryEventType.HISTORY_REDONE] = "HISTORY_REDONE";
            historyBehaviors[HistoryEventType.HISTORY_STEP_ADDED] = "HISTORY_STEP_ADDED";
            _self.addBehaviors(_history, historyBehaviors, false);
        }
        let defaultBehaviors = {
            "InactivityDetected": "APP_INACTIVE",
            "ActivityDetected": "APP_ACTIVE",
            "WindowHide": "APP_WINDOW_HIDDEN",
            "WindowShow": "APP_WINDOW_SHOWN",
            "beforeunload": "APP_UNLOADED"
        };
   
        _self.addBehaviors(_self, defaultBehaviors, false);
    };

    _behaviorimplementations[_guid]["APP_UNLOADED"] = function(e) {
        //window.open("http://google.com/");
        //return "You have unsaved changes";
        let len = BrowserWindow.all.length;
        for (let i = 0; i < len; i++) { 
            BrowserWindow.all[i].close();
        }
    };
    _behaviorimplementations[_guid]["APP_INACTIVE"] = function(e, idleTime, idleCount) {
        console.log("App became Inactive, Launch a cool screensaver here");
    };
    _behaviorimplementations[_guid]["APP_ACTIVE"] = function(e, idleTime, idleCount) {
        console.log("App became Active, Disable screensaver and show login if session expired here");
    };
    _behaviorimplementations[_guid]["APP_WINDOW_HIDDEN"] = function(e, idleTime, idleCount) {
        console.log("App Window was minimized, you may want to stop network traffic or do sth cpu intensive here.");
    };
    _behaviorimplementations[_guid]["APP_WINDOW_SHOWN"] = function(e, idleTime, idleCount) {
        console.log("App Window was maximized, you may want to greet the user.");
    };

    this.addApplet = function (applet) {
        applet.app = applet.parent = r;
        _applets.push(applet);
        let appletInst = _appletsMap[applet.anchor] = new Applet(applet);
        return appletInst;
    };

    let _implementations = {};
    this.addImplementation = function (imps) { 
        if (!_implementations[imps.guid]) {
            for (let behavior in imps) {
                if (_behaviorimplementations[imps.guid][behavior] == null || imps[behavior].override) {
                    _behaviorimplementations[imps.guid][behavior] = imps[behavior];
                } else {
                    if (!_behaviorimplementations[imps.guid][behavior].forEach) {
                        _behaviorimplementations[imps.guid][behavior] = new ArrayEx([_behaviorimplementations[imps.guid][behavior]]);
                    }
                    _behaviorimplementations[imps.guid][behavior].push(imps[behavior]);
                }
            }
            _implementations[imps.guid] = imps;
        } else { 
            console.log("implementations already added.");
        }
    };

    let _event2behavior = function(e) {
        if(e.type != "InactivityDetected" && e.type != "ActivityDetected" && e.type != "WindowHide" && e.type != "WindowShow"){
            if(_idleTime >= _inactivityInterval){
                let idleCount = Math.floor(_idleTime / _inactivityInterval);
                let evt = jQuery.Event("ActivityDetected");
                evt.guid = _guid;
                _self.trigger(evt, [_idleTime, idleCount]);
            }
            _idleTime = 0;
        }
        let currentTarget = Component.instances[$(e.currentTarget).attr('id')] ? Component.instances[$(e.currentTarget).attr('id')] : e.currentTarget;
        let target = Component.instances[$(e.target).attr('id')] ? Component.instances[$(e.target).attr('id')] : e.target; 
        let manifestor;

        let behaviorObj = {};
        if(target && _self.behaviors[target.domID] && _self.behaviors[target.domID][e.type])
        {
            behaviorObj = _self.behaviors[target.domID][e.type];
            manifestor = target;
        }else if(_self.behaviors[currentTarget.domID] && _self.behaviors[currentTarget.domID][e.type] && isObject(_self.behaviors[currentTarget.domID][e.type]))
        {
            let cmpBehaviors = _self.behaviors[currentTarget.domID][e.type];
            for (var prop in cmpBehaviors) { 
                if (cmpBehaviors[prop] && cmpBehaviors[prop].onPropagation) { 
                    behaviorObj[prop] = cmpBehaviors[prop];
                }
            }
            manifestor = currentTarget;
        }
        
        //console.log(e.type + " " + _idCurrentTarget + " " + _idTarget);
        
        if(behaviorObj) {
            let behaviorNameArr = [], behaviorFilterArr = [];
            let behaviorName, behaviorFilter;
          
            if(isObject(behaviorObj))
            {
                for(let prop in behaviorObj){
                    behaviorNameArr.push(prop);
                    if (isObject(behaviorObj[prop])) {
                        behaviorFilterArr.push(behaviorObj[prop]["filter"]);
                    } else
                        behaviorFilterArr.push(behaviorObj[prop]);
                }
            }else{
                behaviorNameArr = [behaviorObj];
                behaviorFilterArr = [null];
            }
            
            for(let b=0;b<behaviorNameArr.length;b++)
            {
                behaviorName = behaviorNameArr[b];
                behaviorFilter = behaviorFilterArr[b];

                let behavior = _self.behaviorimplementations[e.guid][behaviorName];
                let qualifies = true, extraArgs = [];
                if(behavior && typeof behaviorFilter == 'function') {
                    qualifies = behaviorFilter.apply(manifestor, arguments);
                    if(isObject(qualifies)){
                        extraArgs = qualifies.extraArgs;
                        qualifies = qualifies.qualifies;
                    }
                }
                if(behavior && qualifies) {
                    let args = [];
                    for (let i = 0; i < arguments.length; i++) {
                        args.push(arguments[i]);
                    }
                    if(extraArgs.length>0){
                        args = args.concat(extraArgs);
                    }

                    if(typeof behavior == 'function') {
                        behavior.apply(manifestor, args);
                    }else{
                        let behavior_implementations = isObject(behavior) && !behavior.forEach?[behavior]:behavior;
                        for(let bi=0;bi<behavior_implementations.length;bi++)
                        {
                            behavior = behavior_implementations[bi];
                            if(isObject(behavior)){
                                let ret = behavior.do.apply(manifestor, args);
                                if(_historyProps.enabled){
                                    _history.track(behavior, behaviorName, ret, manifestor, args);
                                }
                                if(behavior.stopPropagation){
                                    e.stopPropagation();
                                }
                                if(behavior.stopImmediatePropagation){
                                    e.stopImmediatePropagation();
                                }
                                if(behavior.preventDefault){
                                    e.preventDefault();
                                }
                            }else if(typeof behavior == 'function') {
                                behavior.apply(manifestor, args);
                            }
                        }
                    }
                }
            }
        }
    };

    this.init = function (e) {
        if (e.target.id == this.domID) {
            if (_props.title) { 
                _self.title = _props.title;
            }
        }     
    };

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            
        }
    };

    let _hashchange = function (e) {
        //if 
        _route(e.newValue);
      
        /**
         * p.hash, p.map
        e.oldValue;
        e.newValue;
         */
        
        
    };

   
    let _route = function (hash) {
        let m = BrowserUtils.parse(hash);
        if (m.hash && m.hash != "") { 
            let appletInst = _appletsMap[m.hash];
            if (appletInst) {
                appletInst.route(m.map);
            } else { 
                if (_applets && _applets.length > 0) {
                    appletInst = _appletsMap[_applets[_defaultAppletIndex].anchor];
                    appletInst.route(m.map);
                }
            }
            // appletInst.init(m.map).then((literal) => {
            // });
        } else { 
            if (_applets && _applets.length > 0) {
                appletInst = _appletsMap[_applets[_defaultAppletIndex].anchor];
                appletInst.route(m.map);
            }
        }
    };

    _browserManager.on("hashchange", _hashchange);
    let _appletsMap = {};

    this.beginDraw = function (e) {
        if (e.target.id == this.domID) {
            $(this.ownerDocument.body).on("keydown keyup", function (e) { 
                //target is always body
                if (e.target == _self.ownerDocument.body) { 
                    if (!e.guid) {
                        _self.trigger(e);     
                        if (!e.guid) {
                            e.guid = _guid;
                        }
                    }
                }
            });

            if (_applets && _applets.length > 0) { 
                let len = _applets.length;
                for (let i = 0; i < len; i++) { 
                    _applets[i].app = _applets[i].parent = r;
                    let appletInst = _appletsMap[_applets[i].anchor] = new Applet(_applets[i]);
                    appletInst.on("appletInit", _appletInit);
                }
            }
            _browserManager.init();
            _route(_browserManager.hash);
        }
    };

    let _appletInit = function (e) {
        //compare with Proxy of myself
        if(e.target.parent == r)
            console.log("App.js Appletinit", e.map);
        //_delayUpdateHash.apply(this, arguments);
    };

    let _updateHash = function (e) {
        console.log("App.js Appletinit", e.map);
        return e;
    };
    let _delayUpdateHash = debounce(_updateHash, 2000);

    this.addBehaviors = function (cmps, behaviors, recurse = true) {
        var cmps = isObject(cmps) && !cmps.forEach?[cmps]:cmps;
        let len = cmps.length;
        for (let i = 0; i < len; i++) { 
            let cmp = cmps[i];
            let uid;
            if (!cmp["domID"]) {
                uid = cmp["domID"] = StringUtils.guid();
            } else
                uid = cmp.domID;
            
            let _eventTypesJoined = "";
            for (let b in behaviors) {
                if (_behaviors[uid][b]) {
                    if (!isObject(_behaviors[uid][b])) {
                        let pb = _behaviors[uid][b];
                        _behaviors[uid][b] = {};
                        _behaviors[uid][b][pb] = null;
                    } 
                    if (isObject(behaviors[b])) {
                        for (var eb in behaviors[b]) {
                            _behaviors[uid][b][eb] = behaviors[b][eb];
                        }
                    } else { 
                        _behaviors[uid][b][behaviors[b]] = null;
                    }
                }else
                    _behaviors[uid][b] = behaviors[b];
                
                _eventTypesJoined += " " + b;
            }
            cmp.on(_eventTypesJoined, _event2behavior);
            if (recurse) {
                for (let cid in cmp.children) {
                    _eventTypesJoined += " " + this.addBehaviors(cmp.children[cid], behaviors);
                }
            }
        }
    };
    
    this.removeBehaviors = function (cmp, behaviors, recurse = true) {
        if (_behaviors[cmp.domID] != null)
            for (let b in behaviors) {
                delete _behaviors[cmp.domID][b];
            }
        if (recurse) {
            for (let cid in cmp.children) {
                this.removeBehaviors(cmp.children[cid], behaviors);
            }
        }
    };
    
    Object.defineProperty(this, "idleInterval", 
    {
        get: function idleInterval() 
        {
            return _idleInterval;
        }
    });
    
    Object.defineProperty(this, "inactivityInterval", 
    {
        get: function inactivityInterval() 
        {
            return _inactivityInterval;
        }
    });
    
    Object.defineProperty(this, "appletsMap", 
    {
        get: function appletsMap() 
        {
            return _appletsMap;
        }
    });
    
    let r = Container.call(this, _props);
    window.id = _self.domID;
    
    _initDefaultBehaviors();
    //this.registerBehaviors();   
    return r;
};
App.prototype.ctor = 'App';