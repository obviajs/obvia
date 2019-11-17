var Env = function(){
    var _current;
    Object.defineProperty(this, "current", {
        get: function current()
        {
            if(!_current){
                if(navigator.platform.indexOf('Mac') > -1){
                    _current = EnvType.MAC;
                }else if(navigator.platform.indexOf('Win') > -1){
                    _current = EnvType.WIN;
                }else if(navigator.platform.indexOf('Linux') > -1){
                    _current = EnvType.LINUX;
                }else{
                    _current = EnvType.UNKNOWN;
                }
            }
            return _current;
        }
    });
    
    Object.defineProperty(this, "baseurl", {
        get: function baseurl()
        {
            return window.location.origin;
        }
    });
}
Env.instance;
Env.getInstance = function()
{
    var instance = Env.instance;
    if(!instance)
        instance = Env.instance = new Env();
    return instance;
}