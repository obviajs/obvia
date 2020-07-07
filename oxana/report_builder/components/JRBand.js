var JRBand = function(_props){   
    let r = Container.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRBand.prototype.ctor = 'JRBand';