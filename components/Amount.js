/**
 * This is an Amount Element
 *
 * Kreatx 2019
 */

//component definition
var Amount = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (JSON.stringify(_value) != JSON.stringify(v)) {
                _value.amount = v.amount;
                _value.currency = v.currency;

                this.amountInput.value = v.amount;
                this.amountInput.currency = v.currency;
            }
        },
        enumerable: true,
    });

    this.changeHandler = function (e) {
        if (_mask.groupSeparator) {
            var regex = new RegExp(_mask.groupSeparator, 'g');
            _value.amount = this.children.Container_80.amountInput.value.replace(regex, '');
        } else {
            _value.amount = this.children.Container_80.amountInput.value;
        }
        _value.currency = this.children.Container_80.currencySelect.value;
    };

    let _cmps;
    let fnContainerDelayInit = function () {
        _cmps = [{
            ctor: Container,
            props: {
                id: "Container_80",
                type: ContainerType.NONE,
                components: [{
                        ctor: TextInput,
                        props: {
                            id: "amountInput",
                            type: TextInputType.NUMBER,
                            mask: _mask,
                            value: _value.amount,
                            css: {
                                width: '80%',
                                float: 'left'
                            }
                        }
                    },
                    {
                        ctor: Select,
                        props: {
                            id: "currencySelect",
                            dataProvider: _currencyList,
                            labelField: _labelField,
                            valueField: _valueField,
                            value: _value.currency,
                            css: {
                                width: '20%',
                                float: 'left'
                            }
                        }
                    }
                ]
            }

        }]
    }

    var _defaultParams = {
        value: {
            amount: "",
            currency: "1"
        },
        currencyList: [],
        labelField: 'text',
        valueField: 'id',
        mask: {
            'alias': 'decimal',
            'groupSeparator': ',',
            'autoGroup': true,
            'digits': 2,
            'digitsOptional': false,
            'placeholder': '0.00'
        }

    };
    _props = extend(false, false, _defaultParams, _props);

    var _value = _props.value;
    var _currencyList = _props.currencyList;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _mask = _props.mask;
    if (_mask.groupSeparator == '.') {
        _mask.groupSeparator = ',';
    }
    var _change = _props.change;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler();
        }
    };

    fnContainerDelayInit();
    _props.components = _cmps;
    Container.call(this, _props, true);

    if (overrided) {
        this.keepBase();
    }

};

//component prototype
Amount.prototype.ctor = 'Amount';