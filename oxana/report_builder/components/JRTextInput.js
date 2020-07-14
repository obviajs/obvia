var JRTextInput = function(_props){

    let r = TextInput.call(this, _props);
   
    this.implement(new JRComponent(_props));
   
    return r;
};
JRTextInput.prototype.ctor = 'JRTextInput';