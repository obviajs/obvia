var JRHRule = function(_props){

    let r = HRule.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRHRule.prototype.ctor = 'JRHRule';