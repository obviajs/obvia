/**
 * This is a DateTime Input Element
 *
 * Kreatx 2019
 */
import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var DateTime = function (_props)
{
    let _self = this;

    Object.defineProperty(this, "value", {
        get: function value()
        {
            let d = dayjs(this.$input.val(), _self.internalFormat);
            let date = d.format(_outputFormat);
            return (!d.isValid() || date == "") ? "" : date;
        },
        set: function value(v)
        {
            let oldValue = _value;
            _value = dayjs(v, _inputFormat);
            if (this.$el && _value.isValid())
            {
                this.attr['date'] = _value.format(_displayFormat);
                this.$el.val(_value.format(_self.internalFormat));
            } else
            {
                this.attr['date'] = "Choose Date";
                this.$el.val("");
            }
            _myw.propertyChanged("value", oldValue, value);
        },
        enumerable: true
    });

    Object.defineProperty(this, "min", {
        get: function min()
        {
            return _min;
        },
        set: function min(v)
        {
            _min = dayjs(v, _inputFormat);
            if (this.$el)
                this.attr['min'] = _min.format(_internalFormat);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "internalFormat", {
        get: function internalFormat()
        {
            return _internalFormat;
        },
        set: function internalFormat(v)
        {
            if (_internalFormat != v)
            {
                _internalFormat = v;
            }
        }
    });

    Object.defineProperty(this, "max", {
        get: function max()
        {
            return _max;
        },
        set: function max(v)
        {
            _max = dayjs(v, _inputFormat);
            if (this.$el)
                this.attr['max'] = _max.format(_internalFormat);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "inputFormat", {
        get: function inputFormat()
        {
            return _inputFormat;
        },
        set: function inputFormat(v)
        {
            if (_inputFormat !== v)
            {
                _inputFormat = v;
                this.value = _value.format(_inputFormat);;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "outputFormat", {
        get: function outputFormat()
        {
            return _outputFormat;
        },
        set: function outputFormat(v)
        {
            if (_outputFormat !== v)
            {
                _outputFormat = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "displayFormat", {
        get: function displayFormat()
        {
            return _displayFormat;
        },
        set: function displayFormat(v)
        {
            if (_displayFormat !== v)
            {
                _displayFormat = v;
                this.trigger('change');
            }
        },
        enumerable: true
    });

    this.endDraw = function ()
    {
        this.$input = this.$el;
        if (_props.displayFormat)
        {
            this.displayFormat = _props.displayFormat;
        }
        if (_props.inputFormat)
        {
            this.inputFormat = _props.inputFormat;
        }
        if (_props.outputFormat)
        {
            this.outputFormat = _props.outputFormat;
        }
        if (_props.min)
        {
            this.min = dayjs(_props.min, _inputFormat).format(_inputFormat);
        }
        if (_props.max)
        {
            this.max = dayjs(_props.max, _inputFormat).format(_inputFormat);
        }
        if (!this.getBindingExpression("value"))
        {
            this.value = dayjs(_props.value, _inputFormat).format(_inputFormat);
        }
        // else
        // {
        //     this.value = dayjs().format(_inputFormat);
        // }
    };

    this.inputHandler = function (e)
    {
        let oldValue = _value;
        _value = dayjs(this.$input.val(), _self.internalFormat);
        if (_value.isValid())
        {
            this.attr['date'] = _value.format(_displayFormat);
            this.$el.val(_value.format(_self.internalFormat));
        } else
        {
            this.attr['date'] = "Choose Date";
            this.$el.val("");
        }
        _myw.propertyChanged("value", oldValue, _value);
    };

    if (!this.hasOwnProperty("template"))
    {
        this.template = function ()
        {
            return "<input data-triggers='input' type='datetime-local' id='" + this.domID + "'/>";
        };
    }

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY HH:mm',
        outputFormat: 'DD/MM/YYYY HH:mm',
        displayFormat: 'DD/MM/YYYY hh:mm A',
        internalFormat: "YYYY-MM-DDTHH:mm",
        value: null,
        min: null,
        max: null
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _displayFormat = _props.displayFormat;
    let _internalFormat = _props.internalFormat;

    let _value, _min, _max;
    let _input = _props.input;
    _props.input = function ()
    {
        if (typeof _input == 'function')
            _input.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented())
        {
            _self.inputHandler();
        }
    };
    let r = Parent.call(this, _props);
    let _myw = ChangeWatcher.getInstance(r);
    return r;
};
DateTime.prototype.ctor = "DateTime";
DependencyContainer.getInstance().register("DateTime", DateTime, DependencyContainer.simpleResolve);
export
{
    DateTime
};