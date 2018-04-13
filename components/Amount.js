/**
 * This is an Amount Element
 * 
 * Kreatx 2018
 */

//component definition
var Amount = KxGenerator.createComponent({
    value: {
        amount: "",
        currency: "1",
        moneyamount_id: "-666"
    },

    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },
    
    beforeAttach: function () {
        this.$inputContainer = this.$el.find('.input-container');
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$inputContainer, events: {
                    'change': this.handleChange.bind(this)
                }
            }
        ]
    },

    handleChange: function (e) {
        this.value.amount = this.amountInput.getValue();
        this.value.currency = this.currencySelect.getValue();

        this.validate();
    },

    attached: false,

    afterAttach: function (e) {
        if (e.target.id == this.domID + '-wrapper' && !this.attached) {
            this.attached = true;
            this.$inputContainer
                .append(this.renderAmountInput(this.value.amount))
            
            this.amountInput
                .$input
                .parent()
                .append(this.renderCurrencySelect(this.currencyList, this.value.currency));
            
            this.amountInput.$input.css({ 'width': '80%', 'float': 'left' });
            this.currencySelect.$el.css({ 'width': '20%', 'float': 'left'});
    
            this.trigger('creationComplete');  
        }
    },

    renderAmountInput: function (value) {
        this.amountInput = new TextInput({
            id: 'amountInput-' + this.id,
            colspan: '',
            mask: {
                alias: "decimal",
                prefix: ''
            },
            value: value
        });

        this.amountInput.on('creationComplete', function (e) {
            e.stopPropagation(); 
        });

        return this.amountInput.render();
    },

    renderCurrencySelect: function (currencyList, selected) {
        this.currencySelect = new Select({
            id: 'currencySelect-' + this.id,
            dataProvider: currencyList,
            textField: this.labelField || "text",
            valueField: this.valueField || "id",
            value: selected,
        });

        this.currencySelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });

        return this.currencySelect.render();
    },

    setValue: function (value) {
        this.value.amount = value.amount;
        this.value.currency = value.currency;

        this.amountInput.setValue(value.amount);
        this.currencySelect.setValue(value.currency);

        return this;
    },

    enable: function () {
        this.amountInput.enable();
        this.currencySelect.enable();

        return this;
    },

    disable: function () {
        this.amountInput.disable();
        this.currencySelect.disable();
        
        return this;
    },

    validate: function () {
        if (this.required && this.amountInput.validate()) {
            if (this.amountInput.getValue() == "0.00" || this.amountInput.getValue() == "0") {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['zero']
                ];
                this.amountInput.$input.addClass('invalid');
                return false;
            } else {
                this.errorList = [];
                this.amountInput.$input.removeClass('invalid');
                return true;
            }
        } else {
            if (this.required) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['zero']
                ];
                this.amountInput.$input.addClass('invalid');
                return false;
            } else {
                this.errorList = [];
                this.amountInput.$input.removeClass('invalid');
                return true;
            }
            
        }
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>" +    
                    "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                    "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                        "<div class='input-container'>" +
                    
                        "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Amount.type = 'amount';

//register dom element for this component
KxGenerator.registerDOMElement(Amount, 'kx-amount');

