var DataStore = function (_props) {
    var _defaultParams = {
        storeName: "obviajs.io"
    };

    _props = extend(false, false, _defaultParams, _props);
    var _storeName = _props.storeName;
    var _storage;

    this.init = function () {
        if (typeof (Storage) !== "undefined") {
            _storage = window.localStorage.getItem(_storeName);
            _storage = _storage ? JSON.parse(_storage) : {};
            _storage = _storage ? _storage : {};
        } else {
            console.log("Sorry! No Web Storage support. Will Default to Normal Storage");
            _storage = {};
        }
    };

    this.persist = function () {
        if (typeof (Storage) !== "undefined") {
            if (!_storage)
                throw "You should call init on the DataStore instance first.";
            else
                window.localStorage.setItem(_storeName, JSON.stringify(_storage));
        }
    };

    Object.defineProperty(this, "storage",
        {
            get: function parent() {
                if (!_storage)
                    throw "You should call init on the DataStore instance first.";
                else
                    return _storage;
            }
        });
};