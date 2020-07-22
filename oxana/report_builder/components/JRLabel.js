var JRLabel = function(_props){

    // _props.components = {ctor: JRBand, props: {
    //     id: 'jr_resizer',
    //     type : "CONTAINER_FLUID",
    //     classes: ["resizable"]
    // }}
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
    let r = Label.call(this, _props);
    let resizeBtn = new JRBand({
        id: 'jr_resizer',
        type : "CONTAINER_FLUID",
        classes: ["resizable"]
    });
    this.implement(new JRComponent(_props));
    this.add(resizeBtn,0);
    
    return r;
};
JRLabel.prototype.ctor = 'JRLabel';