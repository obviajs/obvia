var JRComponent = function(_props){
    
    let _defaultParams = {
        x  : "",
        y  : "",
        section : "",
    };
    
    var _props = extend(false, false, _defaultParams, _props);
    
    let _x = _props.x; 
    let _y = _props.y;
    let _section = _props.section;

    Object.defineProperty(this, "x",
    {
        get: function x() {
            return _x;
        },
        set: function x(v) {
            if (_x != v) {
                _x = v;
            }
        },
        enumerable: true
    });
    
    Object.defineProperty(this, "y",
    {
        get: function y() {
            return _y;
        },
        set: function y(v) {
            if (_y != v) {
                _y = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "section",
    {
        get: function section() {
            return _section;
        },
        set: function section(v) {
            if (_section != v) {
                _section = v;
            }
        },
        enumerable: true
    });
 

};
JRComponent.prototype.ctor = 'JRComponent';