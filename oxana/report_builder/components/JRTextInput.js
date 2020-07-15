var JRTextInput = function(_props){

    let _defaultParams = {
        width : "",
        height : ""
    };
    _props = extend(false, false, _defaultParams, _props);
    let _width = _props.width;
    let _height = _props.height;
    
    Object.defineProperty(this, "width",
    {
        get: function width() {
            return _width;
        },
        set: function width(v) {
            if (_width != v != v) {
                _width = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "height",
    {
        get: function height() {
            return _height;
        },
        set: function height(v) {
            if (_height != v != v) {
                _height = v;
            }
        },
        enumerable: true
    });

    let r = TextInput.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRTextInput.prototype.ctor = 'JRTextInput';