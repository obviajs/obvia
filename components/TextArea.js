/**
 * This is a TextArea element
 * 
 * Kreatx 2018
 */

//component definition
var TextArea = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            enabled: true
        }
    },

    beforeAttach: function () {
        this.$input = this.$el.find("#" + this.domID);
        this.$spellCheckBtn = null;

        if (this.spellCheck != false) 
            this.$spellCheckBtn = this.$el.find('#' + this.domID + '-spellCheck');
    },

    registerEvents: function () {
        var events = [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            },

            {
                registerTo: this.$input, events: {
                    'change': this.changeHandler.bind(this),
                }
            }
        ];

        if (this.hasOwnProperty('spellCheck')) {
            if (this.spellCheck != false) {
                events.push({
                    registerTo: this.$spellCheckBtn, events: {
                        'click': this.spellCHeckClickHandler.bind(this)
                    }
                })
            }
        }

        return events;
    },

    changeHandler: function (e) {
        this.validate();
    },

    spellCHeckClickHandler: function (e) {
        this.$input.spellCheckInDialog({ defaultDictionary: this.spellCheck.defaultDictionary });
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
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

    validate: function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];

                this.$input.addClass('invalid');

                return false;
            } else {
                this.errorList = [];
                this.$input.removeClass('invalid');
                return true;
            }
        } else
            return true;
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable '>" +
                "<div id='" + this.domID + "-block'> " +
                    "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                        "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                            "<textarea rv-type='type' rv-value='value' " +
                            "name='" + this.domID + "' id='" + this.domID + "' class='form-control rowspan"+ this.rowspan +
                            "' rv-placeholder='label' rv-enabled='model.enabled' autofocus></textarea>" +
            "<button type='button' rv-if='spellCheck' id='" + this.domID + "-spellCheck' class='btn btn-sm btn-primary float-right'  rv-enabled='model.enabled'><i class='fas fa-book'></i> Spell Check</button>" +
                "</div>" +
            "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
TextArea.type = 'textarea';

//register dom element for this component
KxGenerator.registerDOMElement(TextArea, 'kx-textarea');