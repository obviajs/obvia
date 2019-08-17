/**
 * This is a TokenRenderer Element, the default item renderer for an Autocomplete
 * 
 * Kreatx 2018
 */

//component definition
var TokenRenderer = function(_props)
{
    /*

    this.beforeAttach = function () 
    {
        this.$closeIcon = this.$el.find('#'+ this.domID + '_closeIcon');
        this.$label = this.$el.find('#'+ this.domID + '_label');
    };

    registerEvents: function () {
        return [
            {
                registerTo: this.$closeIcon, events: {
                    'click': this.closeIconClickHandler.bind(this)
                }
            },
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'mousedown' : this.mouseDownHandler.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    },
    closeIconClickHandler: function(){
        if (typeof this.closeiconclickhandler == 'function')
            this.closeiconclickhandler.apply(this, arguments);
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
    afterAttach: function (e) {        
        this.trigger('creationComplete');
    }*/
    this.beforeAttach = function () 
    {
        this.$label = this.$el.find("#"+ this.domID + "_label");
        this.$closeIcon = this.$el.find("#"+ this.domID + "_closeIcon");
    };

    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _value;
        },
        set: function value(v) 
        {
            if(_value != v)
            {
                _value = v;
                if(this.$label)
                    if(v || v===false)
                        this.$label.attr('value', v);
                    else
                        this.$label.removeAttr('value');
            }
        }
    });

    Object.defineProperty(this, "label", 
    {
        get: function label() 
        {
            return _label;
        },
        set: function label(v) 
        {
            if(_label != v)
            {
                _label = v;
                if(this.$label)
                    this.$label.text(v);
            }
        }
    });

    this.template = function () 
    {         
        var xHtml = '<a data-triggers="closeiconclick" class="badge badge-info" id="'+ this.domID + '_closeIcon" href="#" tabindex="-1">×</a>';
        var html = 
            '<div id="'+ this.domID + '" class="badge badge-info" style="font-size: 14px; margin:2px">'+
                (_closeIconSide=="left"?xHtml:"")+    
                '<span id="'+ this.domID + '_label" value="'+(_value!=null && _value!=undefined ? _value:'')+'">'+                      
                (_label!=null ? _label:'')+
                '</span>'+
                (_closeIconSide=="right"?xHtml:"")+      
            '</div>';
        return html;
                            
    };
    var _defaultParams = {
        closeIconSide:"left",
    };
    _props = extend(false, false, _defaultParams, _props);
    var _value = _props.value;
    var _label = _props.label;
    var _self = this;
    var _closeIconSide = _props.closeIconSide;

    var _closeiconclick = _props.closeiconclick;
    _props.closeiconclick = function()
    {
        if (typeof _closeiconclick == 'function')
            _closeiconclick.apply(_self, arguments);
        var e = arguments[0];
        if(!e.isDefaultPrevented()){
        //
        }
    };

    Component.call(this, _props, true);
    var base = this.base;
    this.afterAttach = function(e)
    {
        this.$closeIcon.click(function(evt)
        {
            evt.stopImmediatePropagation();
            $(this).trigger("closeiconclick");
        });
        base.afterAttach.call(this, e);
    }
};
TokenRenderer.prototype.ctor = 'TokenRenderer';