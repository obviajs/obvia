/**
 * This is a FormField Element
 * 
 * Kreatx 2018
 */

//component definition
var FormField = function (_props) {
    let _self = this;
    let _input, _lbl;
    
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _componentId = _component.props.id;
            _input = this.children[_componentId];
            _lbl = this.labelForId;
            _lbl.$el.prop("for", _input.domID);
            if (_props.required)
                _self.required = _props.required;
            if (_props.placeholder)
                _self.placeholder = _props.placeholder;
            if (_props.name)
                _self.name = _props.name;
            if (_props.label)
                _self.label = _props.label;
            //_component = _input.literal;

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
        }
    };
    
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
           
        }
    };
    let _afterAttach = this.afterAttach;

    Object.defineProperty(this, "component",
    {
        get: function component() {
            return _component;
        }
    });

    Object.defineProperty(this, "name",
    {
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
    
    Object.defineProperty(this, "required",
    {
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

    Object.defineProperty(this, "label",
    {
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

    Object.defineProperty(this, "input",
    {
        get: function input() {
            return _input;
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "inputLabel",
    {
        get: function inputLabel() {
            return _lbl;
        },
        enumerable:true
    });
    /**
         this.validate = function () {
        if (_props.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                this.$el.addClass('invalid');
                return false;
            } else {
                this.errorList = [];
                this.$el.removeClass('invalid');
            }
        }
        return true;
    };
     *  */
    

    this.validate = function () {

    };

    let _defaultParams = {
        enabled: true,
        required: false,
        size: FormFieldSize.SMALL,
        type: ContainerType.NONE,
        name: "",
        label: "",
        input: null
    };
    
    _props = extend(false, false, _defaultParams, _props);
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
    if (_component && !Object.isEmpty(_component)) {
        _props.components.push(_component);
    }
    
    Container.call(this, _props);

    let _enabled = _props.enabled;
    Object.defineProperty(this, "enabled",
        {
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
    Object.defineProperty(this, "propsLite", {
        get: function propsLite() {
            let obj = {};
            for (let prop in _props) {
                if (typeof _props[prop] != 'function' && (this.inspect || (this[prop]==null || !this[prop].$el))) {
                    switch (prop) {
                        case "component":
                            let component = {};
                            if (_input) {
                                component.ctor = _input.ctor; //_component.ctor;
                                component.props = _input.propsLite;
                            } else
                                component = _component; 
                            obj[prop] = component;
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if (!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });
    
    Object.defineProperty(this, "props", {
        get: function props() {
            let obj = {};
            for (let prop in _props) {
                if (typeof _props[prop] != 'function') {
                    switch (prop) {
                        case "component":
                            let component = {};
                            if (_input) {
                                component.ctor = _input.ctor; //_component.ctor;
                                component.props = _input.props;
                            } else
                                component = _component; 
                            
                            obj[prop] = component;
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if (!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });

    Object.defineProperty(this, "placeholder",
        {
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
};
//component prototype
FormField.prototype.ctor = 'FormField';