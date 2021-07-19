/**
 * This is a FormField Element
 * 
 * Kreatx 2018
 */
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { Label } from "/obvia/components/Label.js";
import { Props } from "/obvia/components/base/Props.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var FormField = function (_props) {
    let _self = this;
    let _input, _lbl;

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _lbl = this.labelForId;
            if (_component) {
                _componentId = _component.props.id;
                _input = this.children[_componentId];
                _prepareInput();
            }
            if (_props.required)
                _self.required = _props.required;
            if (_props.placeholder)
                _self.placeholder = _props.placeholder;
            if (_props.name)
                _self.name = _props.name;
            if (_props.label)
                _self.label = _props.label;
            //_component = _input.literal;            
        }
    };

    let _prepareInput = function () {
        if (_input) {
            let _cmpObj;
            if (["input", "select", "textarea", "button"].indexOf(_input.$el[0].tagName.toLowerCase()) > -1) {
                _cmpObj = _input.$el;
            } else {
                _cmpObj = _input.$el.find("input, select, textarea, button").filter(function () {
                    return ($(this).closest(".no-form-control").length == 0);
                });
            }
            _cmpObj.addClass("form-control");
            if (_size)
                _cmpObj.addClass(_size);

            _lbl.$el.prop("for", _input.domID);
        }
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {

        }
    };
    let _afterAttach = this.afterAttach;

    Object.defineProperty(this, "component", {
        get: function component() {
            return _component;
        },
        set: function component(v) {
            if (_component != v) {
                _component = v;
                this.removeChild(_input);
                _input = this.addComponent(_component);
                _prepareInput();
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "name", {
        get: function name() {
            return _name;
        },
        set: function name(v) {
            if (_name != v) {
                _name = v;
                if (_name) {
                    if (_input && _input.$el)
                        _input.$el.attr("name", _name);
                } else {
                    if (_input && _input.$el)
                        _input.$el.removeAttr('name');
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "required", {
        get: function required() {
            return _required;
        },
        set: function required(v) {
            if (_required != v) {
                _required = v;
                if (_required) {
                    if (_input && _input.$el)
                        _input.$el.attr('required', _required);
                } else {
                    if (_input && _input.$el)
                        _input.$el.removeAttr('required');
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (_lbl)
                    _lbl.label = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "input", {
        get: function input() {
            return _input;
        },
        set: function input(v) {
            if (_input != v) {
                this.removeChild(_input);
                this.addChild(v);
                _input = v;
                _component = v.literal;
                _prepareInput();
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "inputLabel", {
        get: function inputLabel() {
            return _lbl;
        },
        enumerable: true
    });

    let _defaultParams = {
        enabled: true,
        required: false,
        size: FormFieldSize.SMALL,
        type: "",
        name: "",
        label: "",
        input: null
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _placeholder;
    let _name;
    let _required;
    let _label;
    let _component = _props.component;
    let _componentId;
    let _lblCmp = {
        "ctor": Label,
        "props": {
            id: 'labelForId'
        }
    };
    let _size = _props.size;

    _props.components = [_lblCmp];
    if (_component && !ObjectUtils.isEmpty(_component)) {
        _props.components.push(_component);
    }

    let r = Container.call(this, _props, true);

    let _enabled = _props.enabled;
    Object.defineProperty(this, "enabled", {
        get: function enabled() {
            return _enabled;
        },
        set: function enabled(v) {
            if (_enabled != v) {
                _enabled = v;
                if (_input)
                    _input.enabled = !!v;
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            return new Props(_self, _props);
        },
        configurable: true
    });

    Object.defineProperty(this, "placeholder", {
        get: function placeholder() {
            return _placeholder;
        },
        set: function placeholder(v) {
            if (_placeholder != v) {
                _placeholder = v;
                if (_placeholder) {
                    if (_input && _input.$el)
                        _input.$el.attr("placeholder", _placeholder);
                } else {
                    if (_input && _input.$el)
                        _input.$el.removeAttr('placeholder');
                }
            }
        },
        enumerable: true
    });
    return r;
};
//component prototype
FormField.prototype.ctor = 'FormField';
var FormFieldSize =
{
    "SMALL": "form-control-sm",
    "LARGE": "form-control-lg"
};
DependencyContainer.getInstance().register("FormField", FormField, DependencyContainer.simpleResolve);
export {
    FormField, FormFieldSize
};