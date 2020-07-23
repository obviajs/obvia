var JRBand = function(_props){   

    let _defaultParams = {
        name : "",
        bandOrder : 0,
    };
    _props = extend(false, false, _defaultParams, _props);
    let _name = _props.name;
    let _bandOrder = _props.bandOrder;

    Object.defineProperty(this, "name",
    {
        get: function name() {
            return _name;
        },
        set: function name(v) {
            if (_name != v != v) {
                _name = v;
            }
        },
        enumerable: true
    });
     
    Object.defineProperty(this, "bandOrder",
    {
        get: function bandOrder() {
            return _bandOrder;
        },
        set: function bandOrder(v) {
            if (_bandOrder != v != v) {
                _bandOrder = v;
            }
        },
        enumerable: true
    });

    let r = Container.call(this, _props);  
   // this.implement(new JRComponent(_props));
   //console.log("RR: ",r);
    return r;
};
JRBand.prototype.ctor = 'JRBand';