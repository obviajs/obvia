/**
 * This is a HRule Element Component
 * 
 * Kreatx 2018
 */

import {Component} from "/obvia/components/base/Component.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var HRule = function (_props)
{
    
    Object.defineProperty(this, "height", 
    {
        get: function height() 
        {
            return _height;
        },
        set: function height(v) 
        {
            if(_height != v)
            {
                _height = v;
                if(this.$el)
                {
                    this.$el.css('height', v+"px");
                }
            }
        },
        enumerable:true
    });
  
    Object.defineProperty(this, "align", 
    {
        get: function align() 
        {
            return _align;
        },
        set: function align(v) 
        {
            if(_align != v)
            {
                _align = v;
                if(this.$el)
                    this.$el.attr('align', v);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "width", 
    {
        get: function width() 
        {
            return _width;
        },
        set: function width(v) 
        {
            if(_width != v)
            {
                _width = v;
                if(this.$el)
                {
                    this.$el.css('width', v+"px");
                }
            }
        },
        enumerable: true
    });


    this.template = function () 
    {        
        return  '<hr id="' + this.domID + '" align="'+_align +'" style="height:'+_height +'px width="'+_width +'px"" >';    
    };

    let _defaultParams = {
        width:0,
        height:0,
        align:"center" //="left|center|right"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _width = _props.width;
    let _height = _props.height;
    let _align = _props.align;
   
    Component.call(this, _props);
};
DependencyContainer.getInstance().register("HRule", HRule, DependencyContainer.simpleResolve);
HRule.prototype.ctor = 'HRule';
export {
    HRule
};