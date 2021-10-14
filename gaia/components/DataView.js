import { Literal } from "/obvia/lib/Literal.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { UseBindings } from "/obvia/lib/UseBindings.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { Cache } from "/obvia/lib/cache/Cache.js";
import { Rule } from "/obvia/components/base/Rule.js";
import { debounce } from "/obvia/lib/DecoratorUtils.js";
import { OpenAPI_utils } from "/obvia/lib/OpenApi/OpenAPI_utils.js";
import { RemoteArray } from "/obvia/lib/rca/RemoteArray.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var DataView = function (_props) {
    let _defaultParams = {
        url: null,
        recordsPerPage: 40,
        filterData: null,
        init: false,
        cacheData: false
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //var _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _filterData;    
    let _cache = Cache.getInstance();

    let _url = _props.url, _guid = _props.guid, _cacheData = _props.cacheData;
    let _recordsPerPage = _props.recordsPerPage;
    let _init = _props.init;
    UseBindings.call(this, _props);
    let r = ArrayEx.call(this);
 
    let _raDvs, _self = r;
    if (_props.filterData) {
        _filterData = new Rule(_props.filterData);        
        _filterData.bindingsManager.on("bindingExecuted", (e) => {
            _debouncedFilter(_filterData);
        });
        _filterData.parent = _self;
    }

    let _preInit = function () {
        let p = OpenAPI_utils.get(_url);
        p.then(function (r) {
            let api = r.inst;
            _raDvs = new RemoteArray(
                {
                    "recordsPerPage": _recordsPerPage,
                    fetchPromise: function (p) {
                        let dvInp = new r.constructor.dvInput();
                        dvInp.tableData = new r.constructor.tableData({
                            currentRecord: p.startPage * p.recordsPerPage,
                            "recordsPerPage": p.recordsPerPage
                        });
                        if (p.filterData) {
                            dvInp.advancedSqlFilters = p.filterData;
                        }
                        return api[r.title + "Client"].post(dvInp);
                    }
                }
            );
            if (_props.filterData) {
                _raDvs.filterData = _filterData;
            }
        });
        return p;
    };
    let p;

    let _applyBindings = this.applyBindings;
    this.applyBindings = function () {
        _applyBindings();
        if(_filterData)
            _filterData.applyBindings();
    };

    this.init = function () {
        if (!p) {
            p = _preInit();
        }
        return p.then(() =>
        {
            let pInit, cached = false;
            if (_cacheData) {
                let source = _cache.get(_guid);
                if (source != null) {
                    _self.splicea(0, _self.length, source);
                    cached = true;
                    pInit = Promise.resolve(_self)
                }
            }
            if (!cached) {
                pInit = _raDvs.init().then(function (source) {
                    if (_cacheData) {
                        _cache.set(_guid, source);
                        _cache.persist();
                    }
                    _self.splicea(0, _self.length, source);
                    return _self;
                });
            }
            return pInit;
        });
    };
    Object.defineProperty(this, "filterData", {
        get: function filterData() {
            return _filterData;
        },
        configurable: true        
    });
    Object.defineProperty(this, "url", {
        get: function url() {
            return _url;
        },
        set: function url(v) {
            if (_url != v) {
                _url = v;
                if (_url && _url != "") {
                    p = _preInit();
                    if (_init && (_filterData == null || !_filterData.hasBindings))
                        _self.filter(_filterData);
                } else {
                    _self.splicea(0, _self.length);
                }
            }
        }
    });
    

    this.filter = function (filterData = _filterData) {
        if (!p) {
            p = _preInit();
        }
        return p.then(() => {
            _raDvs.filterData = filterData;
            return _raDvs.reset().then(function (loadedValues) {
                _self.splicea(0, _self.length, loadedValues);
                return _self;
            });
        });
    };
    let _debouncedFilter = debounce(this.filter, 1);
    
    if (_init && (_filterData == null || !_filterData.hasBindings) && !this.bindedProps["url"]) {
        p = _preInit();
        return Promise.resolve(this.init().then(() => { return r}));
    }
    
    return Promise.resolve(r);
};
DataView.prototype = Object.create(ArrayEx.prototype);
DataView.prototype.ctor = 'DataView';
DataView.prototype.constructor = DataView;
Literal.call(DataView);
DependencyContainer.getInstance().register("DataView", DataView, DependencyContainer.simpleResolve);
export {
    DataView
};