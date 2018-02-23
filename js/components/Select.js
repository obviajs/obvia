/**
 * This is a Select Html Element
 * 
 * Kreatx 2018
 */

//component definition
var Select = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            class: "form-control",
            enabled: true
        }
    },

    beforeAttach: function () {
        this.$select = this.$el.find("#" + this.domID);
    },
    
    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this),
                }
            },
            {
                registerTo: this.$select, events: {
                    'change': this.handleChange.bind(this),
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.$select.html(this.renderOptions());
        this.trigger('creationComplete');
    },

    handleChange: function (e) {
        this.value = this.$select.val()
    },

    template: function () {         
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<select rv-enabled='model.enabled' rv-class='model.class' id='" + this.domID + "'>" +
                    "</select>"+
                "</div>";    
    },

    setValue: function (value) {
        if (this.value != value) {
            this.value = value;
            this.$select.val(value);

            this.trigger('change');
        }

        return this;
    },

    selectByText: function (text) {
        var _self = this;

        this.$select.find('option').each(function () {
            if ($(this).html() == text) {
                _self.setValue($(this).attr('value'));
                return;
            }
        });

        return this;
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;

        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;

        return this;
    },

    renderOptions: function () {
        var opts = "";
        this.dataProvider.forEach(function (option, index) {
            if (option[this.valueField] == this.value) {
                opts += "<option value=" + option[this.valueField] + " selected>" + option[this.textField] + "</option>"; 
            } else {
                opts += "<option value=" + option[this.valueField] + ">" + option[this.textField] + "</option>"; 
            }
        }.bind(this));

        return opts;
    },
    
    render: function () {
        return this.$el;
    }
    
});

//component prototype
Select.type = 'select';

//register dom element for this component
KxGenerator.registerDOMElement(Select, 'kx-select');