var JRContainer = function(_props){

    let r = Container.call(this, _props);
   
    this.implement(new JRContainer(_props));
   
    return r;
};
JRContainer.prototype.ctor = 'JRContainer';