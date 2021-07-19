import {Container} from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { coroutine } from "/obvia/lib/coroutine.js";

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
    
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            this.$container = this.$el;
            e.preventDefault();
            coroutine(function* () {
                yield CodeMode.require(_mode);
                yield CodeTheme.require(_theme);
            }).then(function () {
                _cmInst = CodeMirror.MergeView(_self.$el[0], _props);
            });
        }
    };
    
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
    
    
    let _defaultParams = {
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
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _content = _props.content;
    _mode = _props.mode;
    _theme = _props.theme;

    let r = Container.call(this, _props);
    return r;
};
CodeMerge.prototype.ctor = 'CodeMerge';
export {
    CodeMerge
};
