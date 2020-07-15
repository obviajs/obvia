var JRLabel = function(_props){
    let r = Label.call(this, _props);

    let resizeBtn = new JRBand({
        id: 'jr_resizer',
        type : "CONTAINER_FLUID",
        classes: ["resizable"]
    });
    // let $label = $(this.template());
    // let $newLabel = $label.append("<div id = resizable> </div>")
    // this.$el = $newLabel;
    this.implement(new JRComponent(_props));
    this.add(resizeBtn,0);
    
    return r;
};
JRLabel.prototype.ctor = 'JRLabel';