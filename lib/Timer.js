var Timer = function (_props) {
    let _defaultParams = {
        interval: 0,
        tick: 1000
    };
    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["elapsed", "tick"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    this.$el = $(this);
    let _interval = _props.interval;
    let _tick = _props.tick;
    let _t, _i, _tc = _interval / _tick;

    this.start = function () {
        return new Promise((resolve, reject) => {
            _i = setInterval(() => {
                let e = new jQuery.Event("tick");
                e.tickCount = _tc;
                --_tc;
                this.trigger(e);
            }, _tick);
            _t = setTimeout(() => {
                _tc = _interval / _tick;
                clearInterval(_i);
                let e = new jQuery.Event("elapsed");
                this.trigger(e);
                resolve();
            }, _interval);
        });
    };

    this.stop = function () {
        clearInterval(_i);
        _tc = _interval / _tick;
        clearTimeout(_t);
    };

    Object.defineProperty(this, "interval", {
        get: function interval() {
            return _interval;
        },
        set: function interval(v) {
            if (_interval != v) {
                _interval = v;
            }
        }
    });
};
Timer.ctor = 'Timer';
Timer.prototype = Object.create(EventDispatcher.prototype);