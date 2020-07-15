var JRComponent = function(_props){
    
    let _defaultParams = {
        x  : "",
        y  : "",
        section : "",
        width : "",
        height : ""
    };
    var _props = extend(false, false, _defaultParams, _props);
    
    let _x = _props.x; 
    let _y = _props.y;
    let _section = _props.section;
    let _width = _props.width;
    let _height = _props.height;

    Object.defineProperty(this, "x",
    {
        get: function x() {
            return _x;
        },
        set: function x(v) {
            if (_x != v) {
                _x = v;
                if (this.$el) {
                    if (_x){
                        this.show();

                    }
                        
                    else
                        this.hide();
                }
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
 

};
// JRComponent.prototype.ctor = 'JRComponent';