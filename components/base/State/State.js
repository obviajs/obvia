//persist in cache :) 
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { EventDispatcher } from "/obvia/lib/EventDispatcher.js";

var State = function (_props) {
    this.$el = $(this);
    let _defaultParams = {
        cacheProps: { enabled: false, cachedVariableName: null }
    };
    _props = ObjectUtils.fromDefault(_defaultParams, _props);
    let _cacheProps = _props.cacheProps;
    if (_cacheProps.enabled) {
        _cache = Cache.getInstance();
    }
    
    let _steps = new ArrayEx();
    let _currentIndex = -1;
    let _id = StringUtils.guid();
    Object.defineProperty(this, "id", {
        get: function id() {
            return _id;
        }
    });

    Object.defineProperty(this, "currentIndex", {
        get: function currentIndex() {
            return _currentIndex;
        }
    });

    Object.defineProperty(this, "steps", {
        get: function steps() {
            return _steps;
        }
    });

    this.track = function (description, behaviorName, ret, args) {
        if (ObjectUtils.isObject(ret)) {
            let step = new StateStep();
            step.behaviorName = behaviorName;
            step.description = description;
            step.args = args;
            step.retObj = Object.assign(_steps[_steps.length-1].retObj, ret);
            _steps.push(step);

            let eventObject = $.Event(StateEventType.STATE_STEP_ADDED);
            eventObject.current = step;
            this.trigger(eventObject);
        }
    };

    this.initState = function (s) {
        if (_steps.length == 0) {
            let step = new StateStep();
            step.behaviorName = "INITIAL_STATE";
            step.retObj = s;
            _steps.push(step);
        }
    };

    this.getState = function () {
        let step = _steps.last();
        if (step) {
            Object.freeze(step);
        }
        return step;
    };
};

State.instance = null;
State.getInstance = function () {
    if (!State.instance)
        State.instance = new State();
    return State.instance;
};     

State.prototype = Object.create(EventDispatcher.prototype);
let StateEventType =
{
    "STATE_STEP_ADDED": "stateStepAdded",
};

let StateStep = function (_props) {
    let _id = StringUtils.guid();
    this.behaviorName = "";
    this.description = "";
    this.date = performance.now();
    this.args;
    this.thisObj;
    this.retObj;

    Object.defineProperty(this, "id", {
        get: function id() {
            return _id;
        }
    });
};
export {
    State, StateEventType
};