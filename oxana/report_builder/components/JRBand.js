var JRBand = function(_props){   
    let r = Container.call(this, _props);
    let _defaultParams = {
        bandOrder : 0,
    };

    _props = extend(false, false, _defaultParams, _props);
    let _bandOrder = _props.bandOrder;
    
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
   // this.implement(new JRComponent(_props));
   console.log("RR: ",r);
    return r;
};
JRBand.prototype.ctor = 'JRBand';