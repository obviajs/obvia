/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Button = function(_props)
{  
    //inner component data
    initModel: function () {
        return {
            enabled: true
        }
    },
    
    beforeAttach: function () {
        this.$btn = this.$el.find("button");
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$btn, events: {
                    'mousedown' : this.mouseDownHandler.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;
        this.enabled = true;
        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;
        this.enabled = false;
        return this;
    },
    mouseDownHandler: function () {
        if (typeof this.onmousedown == 'function')
            this.onmousedown.apply(this, arguments);
    },
    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    doubleClickHandler: function () {
        if (typeof this.ondblclick == 'function')
            this.ondblclick.apply(this, arguments);
    },

    template: function () {
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<button rv-type='type' rv-enabled='model.enabled' rv-style='style' class='btn btn-default' rv-html='value'></button>" +
                "</div>";    
    },
    
    render: function () {
        return this.$el;
    }
    
    var _defaultParams = {
        label:"",
        hyperlink:"",
        target:""
    };
    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _labelHtml = _label;
    var _hyperlink = _props.hyperlink;
    var _target = _props.target;

    var base = Component.call(this, _props);
    return this;
};

//component prototype
Button.type = 'button';