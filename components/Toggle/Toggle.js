/**
 * This is a Toggle Element
 *
 * Kreatx 2019
 */

var Toggle = function (_props, overrided = false) {
    var _self = this, _checkBox;
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
    var _cbBeforeAttach = function(e){
        _checkBox = this;
        if(_props.value)
            _self.value=_props.value;
        if(_props.checked)
            _self.checked=_props.checked;
    }
    let _span;
    let _lblBeforeAttach = function(e){
        _span = this;
    }

    var _defaultParams = {
        value: 1,
        checked:false,
        components: [
            {
                constructor: CheckBox,
                props:{
                    id: 'checkBox',
                    beforeAttach:_cbBeforeAttach
                }
            },
            {
                constructor: Label,
                props:{
                    id: 'span',
                    labelType: LabelType.span,
                    classes: ["slider"],
                    beforeAttach:_lblBeforeAttach
                }
            }
        ],
        classes: {
            "self":["switch"]
        }
    };
    
    _props = extend(false, false, _defaultParams, _props);
    _props.classes["span"].pushUnique("slider");
    _props.classes["self"].pushUnique("switch");
    var _change = _props.change;
    _props.components[0].props.change = function () {
        if (typeof _change == 'function')
            _change.apply(_self, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            //_cbChange.apply(this, arguments);
        }
        e.stopImmediatePropagation();
        e.stopPropagation();
        _self.trigger("change");
    };
    _props.change = null;

    Label.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

Toggle.prototype.ctor = "Toggle";