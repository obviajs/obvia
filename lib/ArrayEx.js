var ArrayEx = function () {
    let _self = this;
    let _remoteArray, _oldLen;
    let _page;
    let _autoReset = false;
    let _guid = StringUtils.guid();

    //TODO: 
    /**
     * implement filtering
     * implement sort by access time desc (which element was accessed latest)
     */
    let _moreLoaded = function (e) {
        _self.gotoRecord(_ri);
        let evt = new PropertyChangeEvent(_self, "length", _oldLen, _self.length);
        _oldLen = _self.length;
        evt.source_guid = _self.guid;
        _self.trigger(evt);
    };

    //current/requested index 
    let _ci, _ri = 0;
    this.gotoRecord = function (ri) {
        if (_ci != ri) {
            //let len = Math.min(_self.length % _remoteArray.recordsPerPage, _remoteArray.recordsPerPage);
            if (this[ri + _remoteArray.recordsPerPage - 1]) {
                _page.splicea(0, _remoteArray.recordsPerPage, this.slice(ri, ri + _remoteArray.recordsPerPage));
                _ci = ri;
            } else {
                if (_remoteArray.totalRecords == Infinity) {
                    _ri = ri;
                } else {
                    if (ri < 0)
                        ri = 0;
                    else
                    if (ri + _remoteArray.recordsPerPage > _remoteArray.totalRecords - 1)
                        ri = _remoteArray.totalRecords - _remoteArray.recordsPerPage;
                    this.gotoRecord(ri);
                }
            }
        }
    };

    Object.defineProperty(this, "remoteArray", {
        get: function remoteArray() {
            return _remoteArray;
        },
        enumerable: false
    });

    Object.defineProperty(this, "guid", {
        get: function guid() {
            return _guid;
        },
        enumerable: false
    });

    Object.defineProperty(this, "filterData", {
        get: function filterData() {
            if (_remoteArray)
                return _remoteArray.filterData;
        },
        set: function filterData(x) {
            if (_remoteArray) {
                _remoteArray.filterData = x;
            }
        }
    });

    Object.defineProperty(this, "autoReset", {
        get: function autoReset() {
            return _autoReset;
        },
        set: function autoReset(x) {
            if (_autoReset != x) {
                _autoReset = x;
            }
        }
    });
    let _memberType = null;
    Object.defineProperty(this, "memberType", {
        get: function memberType() {
            return _memberType;
        },
        set: function memberType(x) {
            if (_memberType != x) {
                _memberType = x;
            }
        }
    });

    Object.defineProperty(this, "page", {
        get: function page() {
            return _page;
        },
        enumerable: false
    });

    Object.defineProperty(this, "totalRecords", {
        get: function totalRecords() {
            let r = this.length;
            if (_remoteArray)
                r = _remoteArray.totalRecords;
            return r;
        },
        enumerable: false
    });

    let _$el = $({});
    this.trigger = function () {
        _$el.trigger.apply(_$el, arguments);
    };

    this.on = function (eventType, fnc) {
        if (typeof fnc !== 'function') {
            throw Error("The specified parameter is not a callback");
        } else {
            if (typeof fnc == 'function') {
                _$el.on.apply(_$el, arguments);
            }
        }
        return this;
    };

    let _historySteps = [];

    this.filter = function (callback) {
        if (_remoteArray)
            return _remoteArray.reset();
        else {
            let i = 0,
                steps = [],
                ri = 0;

            while (i < this.length) {
                if (!callback.call(this, this[i])) {
                    steps.push({
                        "index": ri,
                        "el": this[i]
                    });
                    this.splice(i, 1);
                } else {
                    i++;
                }
                ri++;
            }
            _historySteps.push(steps);
        }
    };

    this.undo = function () {
        if (_historySteps.length > 0) {
            let steps = _historySteps.pop();
            for (let i = 0; i < steps.length; i++) {
                this.splice(steps[i].index, 0, steps[i].el);
            }
        }
    };

    this.undoAll = function () {
        if (_historySteps.length > 0) {
            for (let i = 0; i < _historySteps.length; i++) {
                let steps = _historySteps[i];
                for (let j = 0; j < steps.length; j++) {
                    this.splice(steps[j].index, 0, steps[j].el);
                }
            }
            _historySteps = [];
        }
    };


    this.off = function () {
        if (_$el) {
            _$el.off.apply(_$el, arguments);
        }
    };
    this.init = function () {
        let p;
        if (_remoteArray)
            p = _remoteArray.init().then(function () {
                return _self;
            });
        else
            p = Promise.resolve(_self);
        return p;
    };
    this.nextPage = function () {
        let p;
        if (_remoteArray)
            p = _remoteArray.nextPage().then(function () {
                return _self;
            });
        else
            p = Promise.resolve(_self);
        return p;
    };
    let r = new Proxy(this, {
        apply: function (target, thisArg, argumentsList) {
            return thisArg[target].apply(this, argumentList);
        },
        deleteProperty: function (target, property) {
            if (!isNaN(property)) {
                // let oldValue = target[property];
                // var evt = new PropertyChangeEvent(_self, property, oldValue, null);
                // evt.source_guid = _self.guid;
                // target.trigger(evt);
                _self.splice(property, 1);
            } else
                Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver) {
            let mc = true;
            if (_memberType && _memberType.length > 0 && !isNaN(property)) {
                let mt;
                if (value && value.constructor)
                    mt = value.constructor.name;
                else
                    mt = typeof value;
                mc = _memberType.indexOf(mt) > -1;
            }
            if (mc) {
                let oldValue = target[property];
                target[property] = value;
                let evt = new PropertyChangeEvent(_self, property, oldValue, value);
                evt.source_guid = _self.guid;
                target.trigger(evt);
            }
            return mc;
        },
        get: function (target, property, receiver) {
            // if (property == "length") {
            //     var i = 0;
            //     for (var prop in target) {
            //         if (!isNaN(prop)) {
            //             ++i;
            //         }
            //     }
            //     return i;
            // } else
            if (!target.hasOwnProperty(property) && _remoteArray && isString(property) && !isNaN(property)) {
                _remoteArray.gotoRecord(parseInt(property));
            } else if (_remoteArray && isString(property) && !isNaN(property)) {
                _remoteArray.gotoRecord(parseInt(property));
                return Reflect.get(...arguments);
            } else
                return Reflect.get(...arguments);
        }
    });

    for (let a = 0; a < arguments.length; a++) {
        if (arguments[a] && arguments[a].forEach) {
            this.splicea(this.length, 0, arguments[a]);
        } else if (a == 0) {
            if (arguments[a] && arguments[a].ctor == "RemoteArray") {
                _page = new ArrayEx();
                _remoteArray = arguments[a];
                _remoteArray.on(RemoteDataEvent.REQUEST_SUCCESS, _moreLoaded);
                _remoteArray.source = r;
                _oldLen = 0;
            } else if (arguments.length == 1) {
                this.length = arguments[a];
            } else {
                this.push(arguments[a]);
            }
        } else {
            this.push(arguments[a]);
        }
    }

    return r;
};
ArrayEx.isArrayEx = function (obj) {
    return (obj != null && ("ctor" in obj) && obj.ctor == 'ArrayEx');
};
ArrayEx.prototype = Object.create(Array.prototype);
ArrayEx.prototype.toArray = function () {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
        ret.push(this[i]);
    }
    return ret;
};
ArrayEx.prototype.toJSON = function () {
    return this.toArray();
};
ArrayEx.prototype.ctor = 'ArrayEx';
ArrayEx.prototype.constructor = ArrayEx;