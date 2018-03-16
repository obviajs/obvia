/**
 * This is a Toggle Element
 * 
 * Kreatx 2018
 */

//component definition
var Toggle = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.$input = this.$el.find("#" + this.domID);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
        ]
    },

    afterAttach: function () {
        this.$input.bootstrapToggle(); 

        this.trigger('creationComplete');
    },

    setValue: function (value) {
        if (this.value != value) {
            this.value = value;

            this.$input.bootstrapToggle('destroy');
            this.$input.bootstrapToggle();
        }
        
        return this;
    },

    enable: function () {
        this.$input.bootstrapToggle('enable');
        return this;    
    },

    disable: function () {
        this.$input.bootstrapToggle('disable');
        return this;
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='form-group col-lg-" + this.colspan + " rowspan" + this.rowspan +" resizable'>" +
                    "<div id='" + this.domID + "-block'>" +
                        "<label rv-style='versionStyle' rv-for='id'><b>{label}</b><span rv-if='required'>*</span></label>" +
                        "<div class=''>" +
                            "<input type='checkbox' rv-checked='value' switch-toggle='toggle' data-on='"+this.checkedLabel+"' data-off='"+this.unCheckedLabel+"'+ data-style='slow'  id='"+this.domID+"'  name='" + this.domID + "'/>"+
                        "</div>" +
                        "<div class='col-md-10' style='padding-left:20px;'>" +
                            "<div style='padding-top: 5px;'>" +
                                "<div>"+
                                    "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Toggle.type = 'toggle';

KxGenerator.registerDOMElement(Toggle, 'kx-toggle');