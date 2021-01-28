/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props) {
    let _self = this,
        _value, _dataProvider, _rendering, _multiple;

    let myw = ChangeWatcher.getInstance(_self);

    Object.defineProperty(this, "valueField", {
        get: function valueField() {
            return _valueField;
        },
        set: function valueField(v) {
            if (_valueField != v) {
                _valueField = v;
                this.components = fnContainerDelayInit();
                this.removeAllRows();
                if (_dataProvider && _dataProvider.length > 0) {
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "labelField", {
        get: function labelField() {
            return _labelField;
        },
        set: function labelField(v) {
            if (_labelField != v) {
                _labelField = v;
                this.components = fnContainerDelayInit();
                this.removeAllRows();
                if (_dataProvider && _dataProvider.length > 0) {
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                let oldValue = _value;
                _value = v;
                if (this.$el) {
                    this.$el.val(v);
                    this.trigger('change');
                    myw.propertyChanged("value", oldValue, _value);
                }
            }
        }
    });

    Object.defineProperty(this, "multiple", {
        get: function multiple() {
            return _multiple;
        },
        set: function multiple(v) {
            if (_multiple != v) {
                _multiple = v;
                if (_multiple) {
                    if (this.$el)
                        this.$el.attr("multiple", _multiple);
                } else {
                    if (this.$el)
                        this.$el.removeAttr('multiple');
                }
            }
        }
    });

    let _changeHandler = function (e) {
        let oldValue = _value;
        _value = this.$el.val();
        myw.propertyChange("value", oldValue, _value);
    };

    this.template = function () {
        return "<select data-triggers='change' id='" + this.domID + "'></select>";
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.value && !this.getBindingExpression("value")) {
                this.value = _props.value;
            }
            if (_props.multiple) {
                this.multiple = _props.multiple;
            }
        }
    };
    let fnContainerDelayInit = function () {
        return [{
            ctor: Option,
            props: {
                id: "opt",
                value: '{' + _valueField + '}',
                label: '{' + _labelField + '}'
            }
        }];
    };

    let _defaultParams = {
        dataProvider: new ArrayEx([]),
        labelField: "",
        valueField: "",
        value: null,
        rendering: {
            wrap: false
        }
    };

    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    _props.applyBindings = true;
    let _labelField = _props.labelField;
    let _valueField = _props.valueField;

    _props.components = fnContainerDelayInit();

    let _change = _props.change;
    _props.change = function () {
        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _changeHandler.apply(_self, arguments);
        }
        if (typeof _change == 'function')
            _change.apply(_self, arguments);
    };

    Repeater.call(this, _props);

    let propDataProvider = Object.getOwnPropertyDescriptor(this, "dataProvider");
    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return propDataProvider['get'].call(_self);
        },
        set: function dataProvider(v) {
            _dataProvider = v;
            this.removeAllRows();

            if (v.length > 0) {
                let dpFields = Object.keys(v[0]);
                if (dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                    propDataProvider['set'].call(_self, _dataProvider);
                }
            } else {
                propDataProvider['set'].call(_self, _dataProvider);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            return new Props(_self, _props, ["components", "rendering"]);
        },
        configurable: true
    });

    Object.defineProperty(this, "rendering", {
        get: function rendering() {
            return _rendering;
        },
        enumerable: false,
        configurable: true
    });
};

//component prototype
Select.prototype.ctor = 'Select';