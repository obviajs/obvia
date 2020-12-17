var Cache = function (_props) {
    var _defaultParams = {
        storeName: Cache.storeName,
        ttl: 300000,
        partition: []
    };

    _props = extend(false, false, _defaultParams, _props);
    var _ttl = _props.ttl;
    var _storeName = _props.storeName;
    var _partition = _props.partition;
    var _storePartition = _storeName + _partition.join(".");
    var _dependencies = {};
    var _depId = _storePartition + ".dependencies";

    var _ds = new DataStore({ storeName: _storeName });
    _ds.init();

    _dependencies = _ds.storage[_depId] ? _ds.storage[_depId] : _dependencies;

    this.set = function (name, value, dependencies = null, ttl = null) {
        if (name != _depId) {
            var v = new CachedVariable();
            v.value = value;
            if (dependencies)
                v.dependecies = dependecies;
            v.ttl = ttl ? ttl : _ttl;
            _ds.storage[name] = v;
        } else
            throw "You may not store a variable with that name because it is a reserved name.";
    };
    
    this.get = function (name) {
        var v = _ds.storage[name];
        var ok = true;
        if (v && v.dependecies.length > 0) {
            for (var i = 0; i < v.dependencies.length && ok; i++) {
                ok = !(_dependencies[v.dependencies[i]] > v.updateTime);
            }
        }
        if (v && ok) {
            var tsNow = new Date().getTime();
            ok = tsNow - v.updateTime < v.ttl;
        }
        return (v && ok) ? v.value : null;
    };

    this.dependencyUpdate = function (dep) {
        if (dep) {
            var tsNow = new Date().getTime();
            if (Array.isArray(dep)) {
                for (var i = 0; i < dep.length; i++) {
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
        for (var name in _ds.storage) {
            delete _ds.storage[name];
        }
    };
};
Cache.storeName = "cache.obviajs.io";
Cache.instances = {};
Cache.getInstance = function (storeName, _props=null) {
    if (!storeName)
        storeName = Cache.storeName;
    var instance = Cache.instances[storeName];
    if (!instance)
        instance = Cache.instances[storeName] = new Cache(_props);
    return instance;
};     
Cache.persistAll = function () {
    for (var storeName in Cache.instances) {
        Cache.instances[storeName].persist();
    }
};