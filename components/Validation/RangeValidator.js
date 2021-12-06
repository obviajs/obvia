/**
 * This is a RangeValidator Element
 * 
 * Kreatx 2020
 */

import { Validator } from "/obvia/components/Validation/Validator.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ValidationManager } from "/obvia/components/Validation/ValidationManager.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var RangeValidator = function (_props)
{
    let _self = this,
        _min, _max, _minAlias, _maxAlias;

    this.validate = function ()
    {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance)
        {
            if (!_self.enabled || ((_self.min == null || parseFloat(_controlToValidateInstance.value) >= parseFloat(_self.min)) && (_self.max == null || parseFloat(_controlToValidateInstance.value) <= parseFloat(_self.max))))
            {
                _self.isValid = true; 
            } else
                _self.isValid = false;
        }
        return Promise.resolve(_self.isValid);
    };

    Object.defineProperty(this, "minAlias", {
        get: function minAlias()
        {
            return _minAlias;
        },
        set: function minAlias(v)
        {
            if (_minAlias != v)
            {
                let oldValue = _minAlias;
                _minAlias = v;
                _myw.propertyChanged("minAlias", oldValue, v);
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "maxAlias", {
        get: function maxAlias()
        {
            return _maxAlias;
        },
        set: function maxAlias(v)
        {
            if (_maxAlias != v)
            {
                let oldValue = _maxAlias;
                _maxAlias = v;
                _myw.propertyChanged("maxAlias", oldValue, v);
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "min", {
        get: function min()
        {
            return _min;
        },
        set: function min(v)
        {
            if (_min != v)
            {
                _min = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "max", {
        get: function max()
        {
            return _max;
        },
        set: function max(v)
        {
            if (_max != v)
            {
                _max = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (_props.max != null && !this.getBindingExpression("max"))
            {
                _max = _props.max;
            }
            if (_props.min != null && !this.getBindingExpression("min"))
            {
                _min = _props.min;
            }
            if (_props.minAlias != null && !this.getBindingExpression("minAlias"))
            {
                _minAlias = _props.minAlias;
            }
            if (_props.maxAlias != null && !this.getBindingExpression("maxAlias"))
            {
                _maxAlias = _props.maxAlias;
            }
            if (_min > _max)
            {
                throw new Error("The specified Min value is greater than the specified Max value.");
            }
        }
    };

    let _defaultParams = {
        min: null,
        max: null
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);


    let _label;
    let _labelType = _props.labelType;

    let r = Validator.call(this, _props);
    let _myw = ChangeWatcher.getInstance(r);
    return r;
};
RangeValidator.prototype.ctor = 'RangeValidator';
DependencyContainer.getInstance().register("RangeValidator", RangeValidator, DependencyContainer.simpleResolve);
export
{
    RangeValidator
};