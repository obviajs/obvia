var App = function(_props){
    var _defaultParams = {
        root: document.body,
        idleInterval: 60000,
        inactivityInterval: 60000,
        components:[],
        historyProps: {enabled:true} 
    };

    _props = extend(false, false, _defaultParams, _props);
    var _root = _props.root;
    var _self = this;
    var _idleTime = 0;
    var _idleInterval = _props.idleInterval;
    var _inactivityInterval = _props.inactivityInterval;
    var _components = _props.components;
    var _children = {};
    var _style = _props.style;
    var _historyProps = _props.historyProps;
    var _history;

    if(!('jquery' in Object(_root)))
        _root = $(_root);
    
    var _rootID = _props.id = _props.id || _root.attr('id') || guid();
    _root.attr('id', _rootID);
    window.id = _rootID;

    if(_style)
    {
        $("<style id='"+_rootID+"' type='text/css'>"+_style+"</style>").appendTo("head");
    }

    Object.defineProperty(this, "rootID", {
        get: function rootID()
        {
            return _rootID;
        }
    });

    Object.defineProperty(this, 'history',
    {
        get: function history() {
            return _history;
        }
    });

    var timerIncrement = function () {
        _idleTime = _idleTime + _idleInterval;
        if (_idleTime >= _inactivityInterval) { 
            var idleCount = Math.floor(_idleTime/_inactivityInterval);
            _root.trigger("InactivityDetected", [_idleTime, idleCount]);
        }
    }
    var t = setInterval(timerIncrement, _idleInterval); 

    var _visible = true;
    var visibilityEvents = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'];
    visibilityEvents.forEach(function (event){
        window.addEventListener(event, function (event){
            if (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden) {
                if (_visible){
                    _visible = false;
                    _root.trigger("WindowHide", []);
                }
            } else {
                if (!_visible){
                    _visible = true;
                    _root.trigger("WindowShow", []);
                }
            }
        });
    });

    this.behaviors = {};
    this.behaviorimplementations = {};
    this.behaviors[_rootID] = {};
   
    if(_historyProps.enabled){
        _history = History.getInstance(".history_"+_rootID);
        _history.behaviors = this.behaviorimplementations;
        _history.on(HistoryEventType.HISTORY_UNDONE + " "+HistoryEventType.HISTORY_REDONE, function(e){
            _root.trigger(e);
        });

        this.behaviors[_rootID][HistoryEventType.HISTORY_UNDONE] = "HISTORY_UNDONE";
        this.behaviors[_rootID][HistoryEventType.HISTORY_REDONE] = "HISTORY_REDONE";
    }

    this.behaviors[_rootID]['creationComplete'] = "APP_LOADED";
    this.behaviors[_rootID]['InactivityDetected'] = "APP_INACTIVE";
    this.behaviors[_rootID]['ActivityDetected'] = "APP_ACTIVE";
    this.behaviors[_rootID]['WindowHide'] = "APP_WINDOW_HIDDEN";
    this.behaviors[_rootID]['WindowShow'] = "APP_WINDOW_SHOWN";
    this.behaviors[_rootID]['beforeunload'] = "APP_UNLOADED";
    
    //default behavior is to hide loader on creationComplete
    this.behaviorimplementations["APP_LOADED"] = function(e) {
        _loader.hide(); 
    };
    this.behaviorimplementations["APP_UNLOADED"] = function(e) {
        //window.open("http://google.com/");
        //return "You have unsaved changes";
    };
    this.behaviorimplementations["APP_INACTIVE"] = function(e, idleTime, idleCount) {
        console.log("App became Inactive, Launch a cool screensaver here");
    };
    this.behaviorimplementations["APP_ACTIVE"] = function(e, idleTime, idleCount) {
        console.log("App became Active, Disable screensaver and show login if session expired here");
    };
    this.behaviorimplementations["APP_WINDOW_HIDDEN"] = function(e, idleTime, idleCount) {
        console.log("App Window was minimized, you may want to stop network traffic or do sth cpu intensive here.");
    };
    this.behaviorimplementations["APP_WINDOW_SHOWN"] = function(e, idleTime, idleCount) {
        console.log("App Window was maximized, you may want to greet the user.");
    };

    var _eventTypeArr = ["mousedown", "mouseover", "mouseup", "click", "dblclick", "keydown", "keyup", "mousemove"];
    var _eventTypeArrJoined;
    var _loader = new Loader({ id: 'loader' });

    this.registerBehaviors = function()
    {
        //TODO: te bejme difference e oldBehaviors me newBehaviors dhe te shtojme vetem ato si evente per te evituar off dhe on
        if(_eventTypeArrJoined)
            $(window).off(_eventTypeArrJoined);
        for(var cmpId in this.behaviors)
        {
            for(var eventType in this.behaviors[cmpId])
            {
                _eventTypeArr.pushUnique(eventType);
            }
        }
        _eventTypeArrJoined = _eventTypeArr.join(" ");
        $(window).on(_eventTypeArrJoined, function(e) {
            if(e.type != "InactivityDetected" && e.type != "ActivityDetected" && e.type != "WindowHide" && e.type != "WindowShow"){
                if(_idleTime >= _inactivityInterval){
                    var idleCount = Math.floor(_idleTime/_inactivityInterval);
                    _root.trigger("ActivityDetected", [_idleTime, idleCount]);
                }
                _idleTime = 0;
            }
            var _domIDCurrentTarget = $(this).attr('id');
            var _domIDTarget = $(e.target).attr('id'); 
            
            var _idCurrentTarget = Component.domID2ID[_domIDCurrentTarget]?Component.domID2ID[_domIDCurrentTarget]:_domIDCurrentTarget;
            var _idTarget = Component.domID2ID[_domIDTarget]?Component.domID2ID[_domIDTarget]:_domIDTarget;

            var cmpBehaviors;
            var _idBehaviorManifestor;
            if(_self.behaviors[_idTarget])
            {
                cmpBehaviors = _self.behaviors[_idTarget];
                _idBehaviorManifestor = _idTarget;
            }else
            {
                cmpBehaviors = _self.behaviors[_idCurrentTarget];
                _idBehaviorManifestor = _idCurrentTarget;
            }
            
            //console.log(e.type+" "+_idCurrentTarget+ " "+_idTarget)
            
            if(cmpBehaviors && cmpBehaviors[e.type]) {
                var behaviorNameArr = [], behaviorFilterArr = [];
                var behaviorName, behaviorFilter;
                var behaviorObj = cmpBehaviors[e.type];

                if(isObject(behaviorObj))
                {
                    for(var prop in behaviorObj){
                        behaviorNameArr.push(prop);
                        behaviorFilterArr.push(behaviorObj[prop]);
                    }

                }else{
                    behaviorNameArr = [behaviorObj];
                    behaviorFilterArr = [null];
                }
                
                for(var b=0;b<behaviorNameArr.length;b++)
                {
                    behaviorName = behaviorNameArr[b];
                    behaviorFilter = behaviorFilterArr[b];

                    var behavior = _self.behaviorimplementations[behaviorName];
                    var qualifies = true, extraArgs = [];
                    if(behavior && typeof behaviorFilter == 'function') {
                        qualifies = behaviorFilter.apply(Component.instances[_idBehaviorManifestor], arguments);
                        if(isObject(qualifies)){
                            extraArgs = qualifies.extraArgs
                            qualifies = qualifies.qualifies;
                        }
                    }
                    if(behavior && qualifies) {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        if(extraArgs.length>0){
                            args = args.concat(extraArgs);
                        }

                        if(typeof behavior == 'function') {
                            behavior.apply(Component.instances[_idBehaviorManifestor], args);
                        }else{
                            if(isObject(behavior)){
                                var ret = behavior.do.apply(Component.instances[_idBehaviorManifestor], args);
                                if(_historyProps.enabled){
                                    _history.track(behaviorName, ret, Component.instances[_idBehaviorManifestor], args);
                                }
                                if(behavior.stopPropagation){
                                    e.stopPropagation();
                                }
                            }
                        }
                    }
                }
            }
        });
    };
    this.registerBehaviors();   

    this.init = function()
    {
        _root.append(_loader.render());
        _loader.show();
        if(_components && Array.isArray(_components))
        {
            for(var i=0;i<_components.length;i++)
            {
                var cmp = Component.fromLiteral(_components[i]);
                _children[cmp.id] = cmp;   
                _components[i].props.id = cmp.id;
                _root.append(cmp.render());
                cmp.parent = this;
                cmp.parentType = this.type;
            }
        }
    }

    Object.defineProperty(this, "children", 
    {
        get: function children() 
        {
            return _children;
        }
    });

    Object.defineProperty(this, "components", 
    {
        get: function components() 
        {
            return _components;
        },
        set: function components(v) 
        {
            //TODO: Add reset logic here or deny setting components after App was inited first.
            _components = v;
        }
    });

    Object.defineProperty(this, "root", 
    {
        get: function root() 
        {
            return _root;
        }
    });

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

    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props)
            {
                if(typeof _props[prop] != 'function')
                {
                    switch(prop)
                    {
                        case "components":
                            var components = [];
                            for(var i=0;i<_components.length;i++)
                            {
                                var component = {};
                                component.constructor = _children[_components[i].props.id].ctor;//_components[i].constructor;
                                component.props = _children[_components[i].props.id].props;
                                components.push(component);
                            }
                            obj[prop] = components;
                            break;
                        default:
                            if(this.hasOwnProperty(prop))
                                obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
    
    Object.defineProperty(this, "literal", {
        get: function literal() {
            return {constructor:this.ctor, props:this.props};
        },
        configurable: true
    });  
}
App.prototype.ctor = 'App';