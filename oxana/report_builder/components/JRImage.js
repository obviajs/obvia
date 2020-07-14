var JRImage = function(_props){
   
    let r = Image.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRImage.prototype.ctor = 'JRImage';