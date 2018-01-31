/**
 * This is a Trippleswitch component
 * 
 * Kreatx 2018
 */

//component definition
var Trippleswitch = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        var mappings = {
            'btnLeft': 'btn btn-success',
            'btnMiddle': 'btn btn-warning',
            'btnRight': 'btn btn-danger',
            'default': 'btn btn-default'
        };

        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
            options: this.dataProvider,
            value: this.value,

            mappings: mappings,
            btnLeft: (this.value == "1") ? mappings['btnLeft'] : mappings['default'],
            btnMiddle: (this.value == "-1" || this.value == "" || this.value == undefined) ? mappings['btnMiddle'] : mappings['default'],
            btnRight: (this.value == "0") ? mappings['btnRight'] : mappings['default'],

            handleClick: this.handleClick.bind(this),

            enabled: true
        }
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

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        var model = this.getModel();
        this.value = value;

        if (this.value == "1") {
            model.btnLeft = model.mappings.btnLeft;
            model.btnRight = model.mappings.default;
            model.btnMiddle = model.mappings.default;
        } else if (this.value == "0") {
            model.btnRight = model.mappings.btnRight;
            model.btnLeft = model.mappings.default;
            model.btnMiddle = model.mappings.default;
        } else {
            model.btnLeft = model.mappings.default;
            model.btnRight = model.mappings.default;
            model.btnMiddle = model.mappings.btnMiddle;
        }   
        
        this.$el.trigger('change');
        return this;    
    },

    handleClick: function (btn) {
        var model = this.getModel();

        //check clicked, uncheck others
        model.btnLeft = (btn == 'btnLeft') ? model.mappings[btn] : model.mappings['default'];
        model.btnMiddle = (btn == 'btnMiddle') ? model.mappings[btn] : model.mappings['default'];
        model.btnRight = (btn == 'btnRight') ? model.mappings[btn] : model.mappings['default'];

        this.value = (btn == 'btnLeft') ? "1" :
            (btn == 'btnRight') ? "0" : "-1"; 
        
        this.$el.trigger('change');
    },

    template: function () {
        return  "<div id='" + this.id + "'>" +
                    "<div class='col-lg-" + this.colspan + "' id='" + this.fieldName + "-block' resizable' style='padding-bottom: 10px;'>" +
                        "<label rv-style='versionStyle' rv-for='fieldName'>{label} <span rv-if='required'>*</span></label>" +
                        "<br>" +
                        "<div class='btn btn-group' role='group' style='padding:0'>" +
                            "<button type='button' rv-enabled='enabled' rv-on-click='handleClick' data-on-click='btnLeft' rv-class='btnLeft'>{options.left}</button> " +
                            "<button type='button' rv-enabled='enabled' rv-on-click='handleClick' data-on-click='btnMiddle' rv-class='btnMiddle'>{options.middle}</button>" +
                            "<button type='button' rv-enabled='enabled' rv-on-click='handleClick' data-on-click='btnRight' rv-class='btnRight'>{options.right}</button>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Trippleswitch.type = 'trippleswitch';

//register dom element for this component
KxGenerator.registerDOMElement(Trippleswitch, 'kx-trippleswitch');