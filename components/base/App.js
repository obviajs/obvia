var App = function(_props){
    let _defaultParams = {
        idleInterval: 60000,
        inactivityInterval: 60000,
        components:[],
        historyProps: { enabled: true },
        type: ContainerType.NONE,
    };

    _props = extend(false, false, _defaultParams, _props);
    let _self = this;
    let _idleTime = 0;
    let _idleInterval = _props.idleInterval;
    let _inactivityInterval = _props.inactivityInterval;
    let _style = _props.style;
    let _historyProps = _props.historyProps;
    let _history;

    if(_style)
    {
        $("<style id='"+_self.domID+"_style' type='text/css'>"+_style+"</style>").appendTo("head");
    }

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
            _self.trigger("InactivityDetected", [_idleTime, idleCount]);
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
                    _self.trigger("WindowHide", []);
                }
            } else {
                if (!_visible){
                    _visible = true;
                    _self.trigger("WindowShow", []);
                }
            }
        });
    });
    
    let _behaviors = new AutoObject();
    _behaviors[_self.id] = {};
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
    let _behaviorimplementations = {};
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
            "beginDraw": "BEGIN_DRAW",
            "endDraw": "END_DRAW",
            "InactivityDetected": "APP_INACTIVE",
            "ActivityDetected": "APP_ACTIVE",
            "WindowHide": "APP_WINDOW_HIDDEN",
            "WindowShow": "APP_WINDOW_SHOWN",
            "beforeunload": "APP_UNLOADED",
            "idChanged": {
                "UPDATE_BEHAVIOR_BINDINGS": {
                    onPropagation: true
                }
            }
        };
   
        _self.addBehaviors(_self, defaultBehaviors, false);
    };
    _behaviorimplementations["UPDATE_BEHAVIOR_BINDINGS"] = {
        do: function (e) {
            console.log("UPDATE_BEHAVIOR_BINDINGS");
            _behaviors[e.newValue] = _behaviors[e.oldValue];
            delete _behaviors[e.oldValue];
        }
        /**
         * catch events thrown by children
        */
       
    };

    _behaviorimplementations["BEGIN_DRAW"] = function (e) {
        if (!_loader.attached) 
            _self.$el.append(_loader.render());
        _loader.show();
    };
    //default behavior is to hide loader on endDraw
    _behaviorimplementations["END_DRAW"] = function(e) {
        _loader.hide(); 
    };
    _behaviorimplementations["APP_UNLOADED"] = function(e) {
        //window.open("http://google.com/");
        //return "You have unsaved changes";
        let len = BrowserWindow.all.length;
        for (let i = 0; i < len; i++) { 
            BrowserWindow.all[i].close();
        }
    };
    _behaviorimplementations["APP_INACTIVE"] = function(e, idleTime, idleCount) {
        console.log("App became Inactive, Launch a cool screensaver here");
    };
    _behaviorimplementations["APP_ACTIVE"] = function(e, idleTime, idleCount) {
        console.log("App became Active, Disable screensaver and show login if session expired here");
    };
    _behaviorimplementations["APP_WINDOW_HIDDEN"] = function(e, idleTime, idleCount) {
        console.log("App Window was minimized, you may want to stop network traffic or do sth cpu intensive here.");
    };
    _behaviorimplementations["APP_WINDOW_SHOWN"] = function(e, idleTime, idleCount) {
        console.log("App Window was maximized, you may want to greet the user.");
    };

    let _loader = new Loader({ id: 'loader' });
    let _event2behavior = function(e) {
        if(e.type != "InactivityDetected" && e.type != "ActivityDetected" && e.type != "WindowHide" && e.type != "WindowShow"){
            if(_idleTime >= _inactivityInterval){
                let idleCount = Math.floor(_idleTime/_inactivityInterval);
                _self.trigger("ActivityDetected", [_idleTime, idleCount]);
            }
            _idleTime = 0;
        }
        let currentTarget = Component.instances[$(e.currentTarget).attr('id')] ? Component.instances[$(e.currentTarget).attr('id')] : e.currentTarget;
        let target = Component.instances[$(e.target).attr('id')] ? Component.instances[$(e.target).attr('id')] : e.target; 
        let manifestor;

        let behaviorObj = {};
        if(target && _self.behaviors[target.id] && _self.behaviors[target.id][e.type])
        {
            behaviorObj = _self.behaviors[target.id][e.type];
            manifestor = target;
        }else if(_self.behaviors[currentTarget.id] && _self.behaviors[currentTarget.id][e.type] && isObject(_self.behaviors[currentTarget.id][e.type]))
        {
            let cmpBehaviors = _self.behaviors[currentTarget.id][e.type];
            for (var prop in cmpBehaviors) { 
                if (cmpBehaviors[prop].onPropagation) { 
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

                let behavior = _self.behaviorimplementations[behaviorName];
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

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
          //  $(window).trigger("endDraw");
        }
    };
    this.beginDraw = function (e) {
        if (e.target.id == this.domID) {
            $(window).trigger("beginDraw");
            $(this.ownerDocument).on("keydown", function (e) { 
                //target is always body
                if (e.guid != _self.guid) { 
                    if (!e.guid) {
                        e.guid = _self.guid;
                    }
                    _self.trigger(e);
                }
            });
        }
    };

    this.addBehaviors = function (cmp, behaviors, recurse = true) {
        if (!cmp["id"]) {
            cmp["id"] = StringUtils.guid();
        }
        let _eventTypesJoined = "";
        for (let b in behaviors) {
            if (_behaviors[cmp.id][b]) {
                if (!isObject(_behaviors[cmp.id][b])) {
                    let pb = _behaviors[cmp.id][b];
                    _behaviors[cmp.id][b] = {};
                    _behaviors[cmp.id][b][pb] = null;
                } 
                if (isObject(behaviors[b])) {
                    for (var eb in behaviors[b]) {
                        _behaviors[cmp.id][b][eb] = behaviors[b][eb];
                    }
                } else { 
                    _behaviors[cmp.id][b][behaviors[b]] = null;
                }
            }else
                _behaviors[cmp.id][b] = behaviors[b];
            
            _eventTypesJoined += " " + b;
        }
        cmp.on(_eventTypesJoined, _event2behavior);
        if (recurse) {
            for (let cid in cmp.children) {
                this.addBehaviors(cmp.children[cid], behaviors);
            }
        }
    };
    
    this.removeBehaviors = function (cmp, behaviors, recurse = true) {
        if (_behaviors[cmp.id] != null)
            for (let b in behaviors) {
                delete _behaviors[cmp.id][b];
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

    let r = Container.call(this, _props);
    window.id = _self.domID;
    
    _initDefaultBehaviors();
    //this.registerBehaviors();   
    return r;
};
App.prototype.ctor = 'App';