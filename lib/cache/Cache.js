
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DataStore } from "/obvia/lib/DataStore.js";
var Cache = function (_props) {
    let _defaultParams = {
        storeName: Cache.storeName,
        ttl: 30000000000,
        partition: []
    };
    _props = ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _ttl = _props.ttl;
    let _storeName = _props.storeName;
    let _partition = _props.partition;
    let _storePartition = _storeName + _partition.join(".");
    let _dependencies = {};
    let _depId = _storePartition + ".dependencies";

    let _ds = new DataStore({ storeName: _storeName });
    _ds.init();

    _dependencies = _ds.storage[_depId] ? _ds.storage[_depId] : _dependencies;

    this.set = function (name, value, dependencies = null, ttl = null) {
        if (name != _depId) {
            let v = new CachedVariable();
            v.value = value;
            if (dependencies)
                v.dependencies = dependencies;
            v.ttl = ttl ? ttl : _ttl;
            _ds.storage[name] = v;
        } else
            throw "You may not store a variable with that name because it is a reserved name.";
    };
    
    this.get = function (name) {
        let v = _ds.storage[name];
        let ok = true;
        if (v && v.dependencies && v.dependencies.length > 0) {
            for (let i = 0; i < v.dependencies.length && ok; i++) {
                ok = !(_dependencies[v.dependencies[i]] > v.updateTime);
            }
        }
        if (v && ok) {
            let tsNow = new Date().getTime();
            ok = tsNow - v.updateTime < v.ttl;
        }
        return (v && ok) ? v.value : null;
    };

    this.dependencyUpdate = function (dep) {
        if (dep) {
            let tsNow = new Date().getTime();
            if (Array.isArray(dep)) {
                for (let i = 0; i < dep.length; i++) {
                    _dependencies[dep[i]] = tsNow;
                }
            } else
                _dependencies[dep] = tsNow;
        }
    };

    this.persist = function () {
        _ds.storage[_depId] = _dependencies;
        _ds.persist();
    };

    this.clear = function () {
        for (let name in _ds.storage) {
            delete _ds.storage[name];
        }
    };
};
Cache.storeName = "cache.obviajs.io";
Cache.instances = {};
Cache.getInstance = function (storeName, _props=null) {
    if (!storeName)
        storeName = Cache.storeName;
    let instance = Cache.instances[storeName];
    if (!instance)
        instance = Cache.instances[storeName] = new Cache(_props);
    return instance;
};     
Cache.persistAll = function () {
    for (let storeName in Cache.instances) {
        Cache.instances[storeName].persist();
    }
};
var CachedVariable = function () {
    this.dependencies = [];
    this.updateTime = new Date().getTime();
    this.value;
    this.ttl;
};
export {
    Cache
};