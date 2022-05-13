/**
 * This is a DateTime Input Element
 *
 * Kreatx 2019
 */
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { TextInput } from "/obvia/components/TextInput/TextInput.js";
var DateTime = function (_props)
{
    let _self = this;
    let _enabled;

    Object.defineProperty(this, "value", {
        get: function value()
        {
            let d;
            if (_dateTimeInput)
                d = dayjs(_dateTimeInput.value, _self.internalFormat);
            else if (_value)
                d = dayjs(_value, _self.inputFormat);
            return !d || !d.isValid() ? "" : d.format(_outputFormat);
        },
        set: function value(v)
        {
            let oldValue = _value;
            _value = dayjs(v, _inputFormat);
            if (this.$el && _value.isValid())
            {
                _dateTimeInput.attr['date'] = _value.format(_displayFormat);
                _dateTimeInput.value = _value.format(_self.internalFormat);
                _textInput.value = _value.format(_displayFormat);
            } else
            {
                _dateTimeInput.attr['date'] = "Choose Date";
                _dateTimeInput.value = "";
                _textInput.value = _displayFormat;
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
                _dateTimeInput.attr['min'] = _min.format(_internalFormat);
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
                _dateTimeInput.attr['max'] = _max.format(_internalFormat);
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
        _dateTimeInput = _self.children.dateTimeInput;
        _textInput = _self.children.textInput;
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
        if (_props.enabled)
        {
            this.enabled = _props.enabled;
        }
        // else
        // {
        //     this.value = dayjs().format(_inputFormat);
        // }
    };

    this.inputHandler = function (e)
    {
        let oldValue = _value;
        _value = dayjs(_dateTimeInput.$el.val(), _self.internalFormat);
        if (_value.isValid())
        {
            _dateTimeInput.attr['date'] = _value.format(_displayFormat);
            _dateTimeInput.value = _value.format(_self.internalFormat);
            _self.children.textInput.value = _value.format(_displayFormat);
        } else
        {
            _self.children.dateTimeInput.$el[0].setAttribute("aria-invalid", "false");
            _dateTimeInput.attr['date'] = "Choose Date";
            _dateTimeInput.value = "";
            _self.children.textInput.display = false;
            _self.children.textInput.value = _displayFormat;
        }
        _myw.propertyChanged("value", oldValue, _value);
    };

    let _cmps;

    let fnContainerDelayInit = function ()
    {
        _cmps = [{
            ctor: TextInput,
            props: {
                id: "dateTimeInput",
                attr: {
                    type: "datetime-local"
                },
                input: function ()
                {
                    let e = arguments[0];
                    if (!e.isDefaultPrevented())
                    {
                        _self.inputHandler();
                    }
                },
                mouseclick: function (e)
                {
                    _shapeshift(e);
                },
                focus: function (e)
                {
                    _shapeshift(e);
                },
                css: {
                    width: "100%"
                }
            }
        },
        {
            ctor: TextInput,
            props: {
                id: "textInput",
                placeholder: _displayFormat,
                visible: false,
                attr: {
                    type: "text"
                },
                css: {
                    position: "absolute",
                    width: "80%",
                    top: "1px",
                    left: "1px",
                    height: "calc(100% - 3px)",
                    border: "none",
                    display: "block",
                    padding: "0.375rem 0.5rem",
                    "font-size": "14px",
                    "line-height": "1.5",
                    color: "#495057",
                    "background-color": "#fff",
                    "background-clip": "padding-box"
                },
                classes: ["no-form-control"],
                blur: function ()
                {
                    if (_self.children.textInput.value && _self.children.textInput.value != _displayFormat)
                    {
                        if (_validate(_self.children.textInput.value))
                        {
                            _self.children.dateTimeInput.$el[0].setAttribute("aria-invalid", "false");
                            _self.children.textInput.visible = false;
                            _self.value = dayjs(_self.children.textInput.value, _displayFormat).format(_inputFormat);
                        } else
                        {
                            _self.children.dateTimeInput.$el[0].setAttribute("aria-invalid", "true");
                            _self.children.textInput.visible = true;
                        }
                    } else
                    {
                        _self.value = "";
                        _self.inputHandler();
                    }
                },
                change: function ()
                {
                    if (_self.children.textInput.value && _self.children.textInput.value != _displayFormat)
                    {
                        if (_validate(_self.children.textInput.value))
                        {
                            _self.value = dayjs(_self.children.textInput.value, _displayFormat).format(_inputFormat);
                        } else
                        {
                            _self.value = "";
                        }
                    } else
                    {
                        _self.value = "";
                        _self.inputHandler();
                    }
                },
                keypress: function (e)
                {
                    if ([...e.key].length === 1 && !e.ctrlKey && !e.metaKey) 
                    {
                        let avoid = [37, 38, 39, 40];
                        if (!avoid.includes(arguments[0].originalEvent.keyCode))
                        {
                            let el = this.$el[0];
                            let selectionEnd = el.selectionEnd + (el.selectionEnd > el.selectionStart ? 0 : 1);
                            let str = this.value = _format(e, el, this.value);

                            if (selectionEnd)
                            {
                                el.focus();
                                let dformat = Array.from(new Set(_displayFormat.split(""))).join("");
                                dformat = dformat.replace(/[^a-z]/ig, "");
                                let regExp = new RegExp("[^0-9" + dformat + "]");
                                while (str[selectionEnd] && regExp.test(str[selectionEnd]))
                                    selectionEnd++;
                                el.setSelectionRange(selectionEnd, selectionEnd + 1);
                            }
                            e.preventDefault();
                        }
                    }
                }
            }
        }];
    }
    let _shapeshift = function (e)
    {
        _textInput.display = true;
        if (_value.isValid())
        {
            _self.children.textInput.value = _value.format(_displayFormat);
        } else
        {
            _self.children.textInput.value = _displayFormat;
        }
        _self.children.textInput.visible = true;
        _self.children.dateTimeInput.focus();
        _self.children.textInput.focus();
        if (e.type == "focus")
            _self.children.textInput.$el[0].setSelectionRange(_self.children.textInput.$el[0].selectionStart, 0);
    };
    let _format = function (e, el, str)
    {
        let selectionLength = el.selectionEnd - el.selectionStart;
        let newStr = str.splice(el.selectionStart, selectionLength == 0 ? 1 : selectionLength, String.fromCharCode(e.charCode));
        if (newStr.length < _displayFormat.length)
        {
            str = newStr.slice(0, el.selectionStart + 1) + _displayFormat.slice(el.selectionStart + 1, el.selectionEnd) + str.slice(el.selectionEnd)
        } else
            str = newStr;

        let dformat = Array.from(new Set(_displayFormat.split(""))).join("");
        dformat = dformat.replace(/[^a-z]/ig, "");
        let regExp = new RegExp("[^0-9" + dformat + "]", "g");
        //let strippedStr = str.replace(regExp, "");
        let selectionStart = el.selectionStart;
        let count = selectionStart;
        let pattern = _displayFormat.replace(/[a-z]/ig, "*");
        let formatted = str.substring(0, selectionStart);
        let sepsCnt = (formatted.match(regExp) || []).length;
        count -= sepsCnt;
        let len = str.length;
        for (let i = selectionStart; i < len; i++)
        {
            const c = pattern[i];
            if (str[i] && c)
            {
                if (/\*/.test(c) && !(regExp.test(str[i])))
                {
                    formatted += str[i];
                } else
                {
                    //formatted += c;
                    formatted += _displayFormat[i];
                }
            }
        }
        return formatted;
    };

    let _validate = function (str)
    {
        let between = (nr, from, to) => nr > from && nr < to;
        let validators = {
            "YY": (part) => part.length == 2 && !isNaN(part),
            "YYYY": (part) => part.length == 4 && !isNaN(part),
            "M": (part) => (part.length == 1 || (part[0] != "0" && part.length == 2)) && !isNaN(part) && between(parseInt(part), 0, 13),
            "MM": (part) => part.length == 2 && !isNaN(part) && between(parseInt(part), 0, 13),
            "D": (part) => (part.length == 1 || (part[0] != "0" && part.length == 2)) && !isNaN(part) && between(parseInt(part), 0, 32),
            "DD": (part) => part.length == 2 && !isNaN(part) && between(parseInt(part), 0, 32),
            "H": (part) => (part.length == 1 || (part[0] != "0" && part.length == 2)) && !isNaN(part) && between(parseInt(part), -1, 24),
            "HH": (part) => part.length == 2 && !isNaN(part) && between(parseInt(part), -1, 24),
            "h": (part) => (part.length == 1 || (part[0] != "0" && part.length == 2)) && !isNaN(part) && between(parseInt(part), 0, 13),
            "hh": (part) => part.length == 2 && !isNaN(part) && between(parseInt(part), 0, 13),
            "m": (part) => (part.length == 1 || (part[0] != "0" && part.length == 2)) && !isNaN(part) && between(parseInt(part), -1, 60),
            "mm": (part) => part.length == 2 && !isNaN(part) && between(parseInt(part), -1, 60),
            "s": (part) => (part.length == 1 || (part[0] != "0" && part.length == 2)) && !isNaN(part) && between(parseInt(part), -1, 60),
            "ss": (part) => part.length == 2 && !isNaN(part) && between(parseInt(part), -1, 60),
        };

        let fstrs = _displayFormat.split(/[^a-z0-9]/ig);
        let parts = str.split(/\D/g);
        let len = parts.length;
        let newStr = "", valid = true;
        for (let i = 0; i < len && valid; i++)
        {
            let fstr = fstrs[i];
            let part = parts[i];
            if (!(valid = validators[fstr](part)))
            {
                console.log(fstr + " input is wrong");
                break;
            }
        }
        if (valid)
        {
            let value = dayjs(str, _displayFormat).valueOf();
            if (_min)
            {
                let min = _min.valueOf();
                if (value < min)
                {
                    console.log('Date input is less than minimum allowed');
                    valid = false;
                }
            }
            if (_max)
            {
                let max = _max.valueOf();
                if (value > max)
                {
                    console.log('Date input is greater than maximum allowed');
                    valid = false;
                }
            }
        }
        return valid;
    };

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY HH:mm',
        outputFormat: 'DD/MM/YYYY HH:mm',
        displayFormat: 'DD/MM/YYYY hh:mm A',
        internalFormat: "YYYY-MM-DDTHH:mm",
        value: null,
        min: null,
        max: null,
        type: "",
        css: { position: "relative" }
    };
    ObjectUtils.fromDefault(_defaultParams, _props);

    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _displayFormat = _props.displayFormat;
    let _internalFormat = _props.internalFormat;

    let _dateTimeInput, _textInput, _value, _min, _max;

    fnContainerDelayInit();
    _props.components = _cmps;

    let r = Container.call(this, _props);
    let _myw = ChangeWatcher.getInstance(r);

    Object.defineProperty(this, "enabled", {
        get: function enabled()
        {
            return _enabled;
        },
        set: function enabled(v)
        {
            if (_enabled != v)
            {
                _enabled = v;
                _dateTimeInput.enabled = _enabled;
                _textInput.enabled = _enabled;
            }
        },
        configurable: true,
        enumerable: true
    });
    return r;
};
DateTime.prototype.ctor = "DateTime";
DateTime.prototype.valueProp = 'value';
DependencyContainer.getInstance().register("DateTime", DateTime, DependencyContainer.simpleResolve);
export
{
    DateTime
};