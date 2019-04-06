var App = function(_props){
    var _defaultParams = {
        root: document.body,
        idleInterval: 60000,
        inactivityInterval: 60000,
        components:[]
    };

    _props = extend(false, false, _defaultParams, _props);
    var _root = _props.root;
    var _self = this;
    var _idleTime = 0;
    var _idleInterval = _props.idleInterval;
    var _inactivityInterval = _props.inactivityInterval;
    var _components = _props.components;
    var _children = {};

    if(!('jquery' in Object(_root)))
        _root = $(_root);
    
    var _rootID = _root.attr('id');
    if(!_rootID){
        _rootID = guid();
        _root.attr('id', _rootID);
    }
    window.id = _rootID;

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

    var _eventTypeArr = ["mousedown", "mouseover", "mouseup", "click", "dblclick", "keydown", "keyup"];
    for(var cmpId in this.behaviors)
    {
        for(var eventType in this.behaviors[cmpId])
        {
            _eventTypeArr.pushUnique(eventType);
        }
    }

    var _eventTypeArrJoined = _eventTypeArr.join(" ");
    $(window).on(_eventTypeArrJoined, function(e) {
        if(e.type != "InactivityDetected" && e.type != "ActivityDetected" && e.type != "WindowHide" && e.type != "WindowShow"){
            if(_idleTime >= _inactivityInterval){
                var idleCount = Math.floor(_idleTime/_inactivityInterval);
                _root.trigger("ActivityDetected", [_idleTime, idleCount]);
            }
            _idleTime = 0;
        }
        var cmpBehaviors = _self.behaviors[$(this).attr('id')];
        if(cmpBehaviors[e.type]) {
            var behaviorName = cmpBehaviors[e.type];
            var behavior = _self.behaviorimplementations[behaviorName];
            if(behavior && typeof behavior == 'function') {
                behavior.apply(this, arguments);
            }
        }
    });

    var _loader = new Loader({ id: 'loader' });
       
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
        }
    });
}
App.prototype.type = 'App';