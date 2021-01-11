var JRHRule = function (_props) {
    
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
      if (e.target.id == this.domID) {
        if (typeof _beforeAttach == 'function') _beforeAttach.apply(this, arguments);
        if (_props.x) this.x = _props.x;
        if (_props.y) this.y = _props.y;
      }
    };

    let r = HRule.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRHRule.prototype.ctor = 'JRHRule';