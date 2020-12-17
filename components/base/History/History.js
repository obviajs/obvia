//persist in cache :) 

var History = function(_props)
{ 
    this.$el = $(this);
    var _defaultParams = {
        cacheProps: {enabled:false, cachedVariableName: null}
    };

    _props = extend(false, false, _defaultParams, _props);
    var _cacheProps = _props.cacheProps;
    if(_cacheProps.enabled)
	{
        _cache = Cache.getInstance();
    }
    
    var _steps = new ArrayEx();
    var _currentIndex = -1;
    var _id = StringUtils.guid();
    Object.defineProperty(this, "id", {
        get: function id()
        {
            return _id;
        }
    });

    var w = ChangeWatcher.getInstance(_steps);
    w.watch(_steps, "length", function(e){
        //e.oldValue e.newValue
        console.log("qweeqweqw");
    });

    Object.defineProperty(this, "currentIndex", {
        get: function currentIndex()
        {
            return _currentIndex;
        }
    });

    Object.defineProperty(this, "steps", {
        get: function steps()
        {
            return _steps;
        }
    });

    this.track = function(behavior, behaviorName, ret, thisObj, args){
        if(behavior.undo && typeof behavior.undo == 'function' && ((isObject(ret) && ret.track) || ret===true)){
            var step = new HistoryStep();
            step.behaviorName = behaviorName; 
            step.behavior = behavior;
            if(isObject(ret)){
                step.description = ret.description || behavior.description;
                step.stepType = ret.stepType || behavior.stepType;
            }
            step.thisObj = thisObj;
            step.args = args;
            if(_steps.length>0 && _currentIndex<_steps.length-1)
            {
                //ketu ne currentIndex < length beji splice nga currentIndex e deri ne length
                _steps.splice(Math.max(_currentIndex+1,0), _steps.length - Math.max(_currentIndex,0)- 1 );
            }
            step.retObj = ret;
            _steps.push(step);
            ++_currentIndex;

            var eventObject = $.Event(HistoryEventType.HISTORY_STEP_ADDED);
            eventObject.current = step;
            this.trigger(eventObject);

            eventObject = $.Event(HistoryEventType.HISTORY_CAN_UNDO);
            this.trigger(eventObject);
        }
    }

    this.clear = function(){
        _steps.splice(0, _steps.length);
        var eventObject = $.Event(HistoryEventType.HISTORY_NO_MORE_UNDO);
        this.trigger(eventObject);
        eventObject = $.Event(HistoryEventType.HISTORY_NO_MORE_REDO);
        this.trigger(eventObject);
    }
    
    this.redo = function(){
        if(_steps.length > 0 && _currentIndex+1 >= 0 && _currentIndex < _steps.length-1)
        {
            ++_currentIndex;
            var step = _steps[_currentIndex];
            var behavior = step.behavior;
            if(behavior.do && typeof behavior.do == 'function'){
                _steps[_currentIndex].retObj = behavior.do.apply(step.thisObj, step.args.concat(step.retObj));

                var redoEventObject = $.Event(HistoryEventType.HISTORY_REDONE);
                redoEventObject.redone = step;
                redoEventObject.next = ((_currentIndex+1 >= 0 && _currentIndex < _steps.length-1)?_steps[_currentIndex+1]:null);
                this.trigger(redoEventObject);

                var eventObject = $.Event(HistoryEventType.HISTORY_CAN_UNDO);
                this.trigger(eventObject);
            }
        }else{
            console.log("Nothing to redo.");
            var eventObject = $.Event(HistoryEventType.HISTORY_NO_MORE_REDO);
            this.trigger(eventObject);
        }
    }

    this.undo = function(){
        if(_steps.length > 0 && _currentIndex>=0 && _currentIndex <= _steps.length-1)
        {
            var step = _steps[_currentIndex];
            var behavior = step.behavior;
            if(behavior.undo && typeof behavior.undo == 'function'){
                behavior.undo.apply(step.thisObj, step.args.concat(step.retObj));
            }
            --_currentIndex;
            var undoEventObject = $.Event(HistoryEventType.HISTORY_UNDONE);
            undoEventObject.undone = step;
            undoEventObject.previous = (_currentIndex>=0?_steps[_currentIndex]:null);
            this.trigger(undoEventObject);

            var eventObject = $.Event(HistoryEventType.HISTORY_CAN_REDO);
            this.trigger(eventObject);
        }else{
            console.log("Nothing to undo.");
            var eventObject = $.Event(HistoryEventType.HISTORY_NO_MORE_UNDO);
            this.trigger(eventObject);
        }
    }
}

History.instances = {};
History.getInstance = function(instName)
{
    var instance = History.instances[instName];
    if(!instance)
        instance = History.instances[instName] = new History();
    return instance;
}     
History.prototype = Object.create(EventDispatcher.prototype);