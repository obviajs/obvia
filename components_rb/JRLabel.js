var JRLabel = function(_props){
    console.log("JRLabel");
   
    let r = Label.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRLabel.prototype.ctor = 'JRLabel';