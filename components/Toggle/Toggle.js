/**
 * This is a Toggle Element
 *
 * Kreatx 2019
 */
import { Label, LabelType } from "/obvia/components/Label.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { CheckBox } from "/obvia/components/CheckBox.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Toggle = function (_props) {
    let _self = this;
    Object.defineProperty(this, "value", {
        get: function value() {
            return _self.proxyMaybe.checkBox.value;
        },
        set: function value(v) {
            _self.proxyMaybe.checkBox.value = v;
        },
        enumerable:true
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _self.proxyMaybe.checkBox.checked;
        },
        set: function checked(v) {
            _self.proxyMaybe.checkBox.checked = !!v;
        },
        enumerable:true
    });

    this.beforeAttach = function () {
        this.$input = _self.proxyMaybe.checkBox.$el;
    };
 
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
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
                    id: 'checkBox'
                }
            },
            {
                ctor: Label,
                props:{
                    id: 'span',
                    labelType: LabelType.span,
                    classes: ["slider"]
                }
            }
        ],
        classes: ["switch"],
        props: {
            span: {
                classes: ["slider"],
            }
        }
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    
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

    let r = Label.call(this, _props, true);
    return r;
};
DependencyContainer.getInstance().register("Toggle", Toggle, DependencyContainer.simpleResolve);
Toggle.prototype.ctor = "Toggle";
export {
    Toggle
};