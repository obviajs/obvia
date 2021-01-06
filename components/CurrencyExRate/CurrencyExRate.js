/**
 * This is an CurrencyExRate Element
 *
 * Kreatx 2019
 */

//component definition
var CurrencyExRate = function (_props) {
    let _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (JSON.stringify(_value) != JSON.stringify(v)) {
                _value.exRate = v.exRate;
                _value.currency = v.currency;

                this.exchangeRate.value = v.exRate;
                this.exchangeRate.currency = v.currency;
            }
        },
        enumerable: true,
    });

    this.changeHandler = function (e) {
        _value.exRate = this.children.exchangeRate.value;
        _value.currency = this.children.currencySelect.value;
    };
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {

        }
    };
    let _cmps;
    let fnContainerDelayInit = function () {
        _cmps = [

            {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_53",
                    css: {
                        "display": "flex",
                        "width": "100%"
                    },
                    "components": [

                        {
                            ctor: DropDown,
                            props: {
                                id: "currencySelect",
                                dataProvider: _currencyList,
                                labelField: _labelField,
                                valueField: _valueField,
                                value: _value.currency,
                                css: {
                                    float: 'left'
                                }
                            }
                        },
                        {
                            ctor: TextInput,
                            props: {
                                id: "exchangeRate",
                                value: _value.exRate,
                                css: {}
                            }
                        }
                    ]
                }
            },



        ];
    };


    let _defaultParams = {
        value: {
            exRate: "",
            currency: "1"
        },
        classes: ["d-flex"],
        type: ContainerType.NONE,
        currencyList: [],
        labelField: "title",
        valueField: "key",

    };
    _props = extend(false, false, _defaultParams, _props);

    let _value = _props.value;
    let _currencyList = _props.currencyList;
    let _labelField = _props.labelField;
    let _valueField = _props.valueField;
    let _change = _props.change;


    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler();
        }
    };
    fnContainerDelayInit();
    _props.components = _cmps;
    Container.call(this, _props, true);

};
//component prototype
CurrencyExRate.prototype.ctor = 'CurrencyExRate';