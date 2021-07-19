import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var DataStore = function (_props) {
    let _defaultParams = {
        storeName: "obviajs.io"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _storeName = _props.storeName;
    let _storage;

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
export {
    DataStore    
};