/**
 * This is a TrippleSwitch component
 * 
 * Kreatx 2018
 */

//component definition
var TrippleSwitch = KxGenerator.createComponent({
    //component data
    initModel: function () {
        var mappings = {
            'btnLeft': 'btn btn-success',
            'btnMiddle': 'btn btn-warning',
            'btnRight': 'btn btn-danger',
            'default': 'btn btn-default'
        }

        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            mappings: {
                'btnLeft': 'btn btn-success',
                'btnMiddle': 'btn btn-warning',
                'btnRight': 'btn btn-danger',
                'default': 'btn btn-default'
            },
            btnLeft: (this.value == "1") ? mappings['btnLeft'] : mappings['default'],
            btnMiddle: (this.value == "-1" || this.value == "" || this.value == undefined) ? mappings['btnMiddle'] : mappings['default'],
            btnRight: (this.value == "0") ? mappings['btnRight'] : mappings['default'],

            enabled: true
        }
    },

    beforeAttach: function () {
        this.$btnLeft = this.$el.find("#btnLeft-" + this.domID);
        this.$btnMiddle = this.$el.find("#btnMiddle-" + this.domID);
        this.$btnRight = this.$el.find("#btnRight-" + this.domID);
    },

    registerEvents: function(){
        return [
            {
                registerTo: this.$el, events: { 'afterAttach': this.afterAttach.bind(this) }
            },
            {
                registerTo: this.$btnLeft, events: { 
                    'click': function() { 
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        args.splice(1, 0, 'btnLeft');
                        this.handleClick.apply(this, args);
                    }  
                }
            },
            {
                registerTo: this.$btnMiddle, events: { 
                    'click': function() { 
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        args.splice(1, 0, 'btnMiddle');
                        this.handleClick.apply(this, args);
                    }
                }    
            },
            {
                registerTo: this.$btnRight, events: { 
                    'click': function() { 
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        args.splice(1, 0, 'btnRight');
                        this.handleClick.apply(this, args);
                    }
                }    
            }
        ]
    },

    afterAttach: function(e) {
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
        
        this.trigger('change');
        
        return this;    
    },

    handleClick: function (e, btn) {
        var model = this.getModel();
    
        //check clicked, uncheck others
        model.btnLeft = (btn == 'btnLeft') ? model.mappings[btn] : model.mappings['default'];
        model.btnMiddle = (btn == 'btnMiddle') ? model.mappings[btn] : model.mappings['default'];
        model.btnRight = (btn == 'btnRight') ? model.mappings[btn] : model.mappings['default'];

        this.value = (btn == 'btnLeft') ? "1" :
            (btn == 'btnRight') ? "0" : "-1"; 
        
        this.trigger('change');
    },

    template: function () {
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<div class='col-lg-" + this.colspan + "' id='" + this.domID + "-block' resizable' style='padding-bottom: 10px;'>" +
                        "<label rv-style='versionStyle' rv-for='fieldName'>{label} <span rv-if='required'>*</span></label>" +
                        "<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
                        "<br>" +
                        "<div class='btn btn-group' role='group' style='padding:0'>" +
                            "<button type='button' rv-enabled='model.enabled' id='btnLeft-" + this.domID + "' rv-class='model.btnLeft'>{dataProvider.left}</button> " +
                            "<button type='button' rv-enabled='model.enabled' id='btnMiddle-" + this.domID + "' rv-class='model.btnMiddle'>{dataProvider.middle}</button>" +
                            "<button type='button' rv-enabled='model.enabled' id='btnRight-" + this.domID + "' rv-class='model.btnRight'>{dataProvider.right}</button>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
TrippleSwitch.type = 'trippleswitch';

//register dom element for this component
KxGenerator.registerDOMElement(TrippleSwitch, 'kx-trippleswitch');