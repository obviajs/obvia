var Env = function () {
    var _current;
    Object.defineProperty(this, "current", {
        get: function current() {
            if (!_current) {
                if (navigator.platform.indexOf('Mac') > -1) {
                    _current = EnvType.MAC;
                } else if (navigator.platform.indexOf('Win') > -1) {
                    _current = EnvType.WIN;
                } else if (navigator.platform.indexOf('Linux') > -1) {
                    _current = EnvType.LINUX;
                } else {
                    _current = EnvType.UNKNOWN;
                }
            }
            return _current;
        }
    });
    
    Object.defineProperty(this, "baseurl", {
        get: function baseurl() {
            return window.location.origin;
        }
    });
};
Env.instance = null;
Env.getInstance = function () {
    if (!Env.instance)
        Env.instance = new Env();
    return Env.instance;
};
var EnvType =
{
    "MAC": 1,
    "WIN": 2,
    "LINUX": 3,
    "UNIX": 4,
    "UNKNOWN": 999
};
export {
    Env, EnvType
};