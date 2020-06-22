var CodeMerge = function (_props) {
    let _self = this, _cmInst, _mode, _theme;

    Object.defineProperty(this, "content", {
        get: function content()
        {
            if(_cmInst){
                _content = _cmInst.editor().getValue();
            }
            return _content;
        },
        set: function content(v)
        {
            if(this.content!=v)
            {
                _content = v;
                if(_cmInst){
                    _cmInst.editor().setValue(_content);
                }
            }
        },
        enumerable: true
    });
    
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            this.$container = this.$el;
            e.preventDefault();
            coroutine(function* () {
                yield CodeMerge.require();
                yield CodeMode.require(_mode);
                yield CodeTheme.require(_theme);
            }).then(function(){
                _cmInst = CodeMirror.MergeView(_self.$el[0], _props);
            }); 
        }
    }
    
    /*
    if (GUI.IDE.fullScreenState) {
        this.mergeView.editor().setSize(null, window.innerHeight - 110);
        this.mergeView.rightOriginal().setSize(null, window.innerHeight - 110);
        this.mergeView.wrap.style.height = window.innerHeight - 110 + "px";
    } else {
        this.mergeView.editor().setSize(null, size.height || 300);
        this.mergeView.rightOriginal().setSize(null, size.height || 300);
        this.mergeView.wrap.style.height = size.height || 300 + "px";
    }  
    */
    
    
    var _defaultParams = {
        value: "", 
        origLeft: null,
        orig: "",
        lineNumbers: true,
        mode: "javascript",
        highlightDifferences: true,
        connect: "align", //or null
        collapseIdentical: false,
        theme: "default"
    };

    _props = extend(false, false, _defaultParams, _props);
    _content = _props.content;
    _mode = _props.mode;
    _theme = _props.theme;

    let r = Container.call(this, _props);
    return r;
};
CodeMerge.prototype.ctor = 'CodeMerge';
CodeMerge.require = function(){
    rjs.define("./oxana/Code/CodeMode.js", "CodeMode");
    rjs.define("./oxana/Code/CodeTheme.js", "CodeTheme");
    rjs.define("./oxana/Code/CodeBase.js", "CodeBase");
    
    return coroutine(function* () {
        yield rjs.require(["CodeMode", "CodeTheme", "CodeBase"]);
        yield CodeBase.require();
        rjs.define("./oxana/Code/CodeAddons.js", "CodeAddons");
        yield rjs.require(["CodeAddons"]);
        yield CodeAddons.require();
    });
}
