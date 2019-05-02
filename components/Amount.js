/**
 * This is an Amount Element
 *
 * Kreatx 2019
 */

//component definition
var Amount = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value",
    {
        set: function value(v) {
            if (JSON.stringify(_value) != JSON.stringify(v)) {
                _value.amount = v.amount;
                _value.currency = v.currency;

                this.amountInput.value = v.amount;
                this.amountInput.currency = v.currency;
            }
        }
    });

    this.changeHandler = function (e) {
        _value.amount = this.amountInput.value;
        _value.currency = this.currencySelect.value;
    };

    this.attached = false;
    this.afterAttach = function (e) {
        this.cComponents = [];
        if (e.target.id == this.domID && !this.attached) {
            this.attached = true;
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            e.preventDefault();
            this.$el
                .append(this.renderAmountInput(_value.amount))
                .append(this.renderCurrencySelect(_currencyList, _value.currency));

            this.amountInput.$el.css({ 'width': '80%', 'float': 'left' });
            this.currencySelect.$el.css({ 'width': '20%', 'float': 'left' });
        }
    };

    this.renderAmountInput = function (value) {
        this.amountInput = new TextInput({
            id: 'amountInput-' + this.id,
            mask: {
                alias: "decimal",
                prefix: ''
            },
            value: value
        });

        var _self = this;
        this.amountInput.on('creationComplete', function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            _self.cComponents.push(this);

            if (_self.cComponents.length > 1) {
                _self.enabled = this.enabled;

                _self.trigger('creationComplete');
            }

        });

        return this.amountInput.render();
    };

    this.renderCurrencySelect = function (currencyList, selected) {
        this.currencySelect = new Select({
            id: 'currencySelect-' + this.id,
            dataProvider: currencyList,
            textField: _labelField,
            valueField: _valueField,
            value: selected,
        });

        var _self = this;
        this.currencySelect.on('creationComplete', function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            _self.cComponents.push(this);

            if (_self.cComponents.length > 1) {
                _self.enabled = this.enabled;

                _self.trigger('creationComplete');
            }
        });

        return this.currencySelect.render();
    };

    this.template = function () {
        return "<div data-triggers='change' id='" + this.domID + "'></div>";
    };

    var _defaultParams = {
        value: {
            amount: "",
            currency: "1"
        },
        currencyList: [],
        labelField: 'text',
        valueField: 'id'
    };
    _props = extend(false, false, _defaultParams, _props);

    var _value = _props.value;
    var _currencyList = _props.currencyList;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _change = _props.change;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
   
    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler();
        }
    };

    Component.call(this, _props, true);

    if (overrided) {
        this.keepBase();
    }

};

//component prototype
Amount.prototype.ctor = 'Amount';