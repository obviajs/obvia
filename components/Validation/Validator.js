/**
 * This is a Validator Element
 * 
 * Kreatx 2020
 */

import { Label, LabelType } from "/obvia/components/Label.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ValidationManager } from "/obvia/components/Validation/ValidationManager.js";

var Validator = function (_props)
{
    let _self = this,
        _isValid = true,
        _controlToValidate, _controlToValidateInstance,
        _validationGroup, _setFocusOnError, _errorMessage, _initialValue,
        _invalidClasses, _validClasses, _required = false

    Object.defineProperty(this, "isValid", {
        get: function isValid()
        {
            return _isValid;
        },
        set: function isValid(v)
        {
            if (_isValid != v)
            {
                _isValid = v;
            }
            if (!_isValid)
            {
                _self.label = _errorMessage;
                _self.show();
                if (_setFocusOnError && _controlToValidateInstance)
                {
                    _controlToValidateInstance.focus();
                }
                _self.classes = _invalidClasses;
            } else
            {
                _self.label = "";
                _self.hide();
                _self.classes = _validClasses;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "required", {
        get: function required()
        {
            return _required;
        },
        set: function required(v)
        {
            if (_required != v)
            {
                _required = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "validationGroup", {
        get: function validationGroup()
        {
            return _validationGroup;
        },
        set: function validationGroup(v)
        {
            if (_validationGroup != v)
            {
                _validationGroup = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "setFocusOnError", {
        get: function setFocusOnError()
        {
            return _setFocusOnError;
        },
        set: function setFocusOnError(v)
        {
            if (_setFocusOnError != v)
            {
                _setFocusOnError = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "errorMessage", {
        get: function errorMessage()
        {
            return _errorMessage;
        },
        set: function errorMessage(v)
        {
            if (_errorMessage != v)
            {
                _errorMessage = v;
                if (!_isValid)
                {
                    _self.label = _errorMessage;
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "controlToValidate", {
        get: function controlToValidate()
        {
            return _controlToValidate;
        },
        set: function controlToValidate(v)
        {
            if (_controlToValidate != v)
            {
                _controlToValidate = v;
                if (_controlToValidate && _self.parent)
                {
                    _controlToValidateInstance = null; let i = 6, parent = _self.parent;
                    while (_controlToValidateInstance == null && i > 0)
                    {
                        _controlToValidateInstance = parent.find(_controlToValidate);
                        --i;
                        parent = parent.parent;
                    }
                } else
                    _controlToValidateInstance = null;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "setFocusOnError", {
        get: function setFocusOnError()
        {
            return _setFocusOnError;
        },
        set: function setFocusOnError(v)
        {
            if (_setFocusOnError != v)
            {
                _setFocusOnError = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "controlToValidateInstance", {
        get: function controlToValidateInstance()
        {
            return _controlToValidateInstance;
        },
        set: function controlToValidateInstance(v)
        {
            if (_controlToValidateInstance != v)
            {
                _controlToValidateInstance = v;
                if (_controlToValidateInstance)
                {
                    _controlToValidate = _controlToValidateInstance.id;
                }
            }
        },
        configurable: true
    });

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {

            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);

            if (_props.controlToValidate && !this.getBindingExpression("controlToValidate"))
            {
                this.controlToValidate = _props.controlToValidate;
            }
            if (_props.errorMessage && !this.getBindingExpression("errorMessage"))
            {
                this.errorMessage = _props.errorMessage;
            }

            if (_props.initialValue && !this.getBindingExpression("initialValue"))
            {
                this.label = _initialValue = _props.initialValue;
            }
            if (_props.setFocusOnError && !this.getBindingExpression("setFocusOnError"))
            {
                this.setFocusOnError = _props.setFocusOnError;
            }
            if (_props.validationGroup && !this.getBindingExpression("validationGroup"))
            {
                this.validationGroup = _props.validationGroup;
            }
            if (_props.required && !this.getBindingExpression("required"))
            {
                this.required = _props.required;
            }
        }
    };

    let _defaultParams = {
        controlToValidate: null,
        validationGroup: null,
        setFocusOnError: true,
        errorMessage: null,
        initialValue: null,
        label: "",
        labelType: LabelType.label,
        invalidClasses: [],
        validClasses: []
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);


    let _validationManager = ValidationManager.getInstance();
    _validationManager.add(_self);

    let _label;
    let _labelType = _props.labelType;

    let r = Label.call(this, _props);

    this.destruct = function (mode = 1)
    {
        if (this.$el)
            mode == 1 ? this.$el.remove() : this.$el.detach();
        _self.attached = false;
        _validationManager.remove(_self);
    };

    return r;
};
Validator.prototype.ctor = 'Validator';
export
{
    Validator
};