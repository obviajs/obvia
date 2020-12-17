/**
 * This is a Toggle Element
 *
 * Kreatx 2019
 */

var Toggle = function (_props) {
    let _self = this, _checkBox, _span;
    Object.defineProperty(this, "value", {
        get: function value() {
            return _checkBox.value;
        },
        set: function value(v) {
            _checkBox.value = v;
        },
        enumerable:true
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _checkBox.checked;
        },
        set: function checked(v) {
            _checkBox.checked = !!v;
        },
        enumerable:true
    });

    this.beforeAttach = function () {
        this.$input = _checkBox.$el;
    };
    Object.defineProperty(this, "checkBox",
    {
        get:function checkBox(){
            return _checkBox;
        },
        enumerable:false
    });
    Object.defineProperty(this, "span",
    {
        get:function label(){
            return _span;
        },
        enumerable:false
    });
 
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _checkBox = this.checkBoxCmp;
            _span = this.spanCmp;
            if (_props.value)
                _self.value = _props.value;
            if (_props.checked)
                _self.checked = _props.checked;
        }
        console.log("endDraw");
    };
    this.afterAttach = function (e) {
        
    };
    let _defaultParams = {
        value: 1,
        checked:false,
        components: [
            {
                ctor: CheckBox,
                props:{
                    id: 'checkBoxCmp'
                }
            },
            {
                ctor: Label,
                props:{
                    id: 'spanCmp',
                    labelType: LabelType.span,
                    classes: ["slider"]
                }
            }
        ],
        classes: {
            "self":["switch"]
        }
    };
    
    _props = extend(false, false, _defaultParams, _props);
    if(_props.classes["span"]==null)
        _props.classes["span"] = [];
    _props.classes["span"].pushUnique("slider");
    if(_props.classes["self"]==null)
        _props.classes["self"] = [];
    _props.classes["self"].pushUnique("switch");
    let _change = _props.change;
    _props.components[0].props.change = function () {
        if (typeof _change == 'function')
            _change.apply(_self, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            //_cbChange.apply(this, arguments);
        }
        e.stopImmediatePropagation();
        e.stopPropagation();
        _self.trigger("change");
    };
    _props.change = null;

    Label.call(this, _props, true);
};

Toggle.prototype.ctor = "Toggle";