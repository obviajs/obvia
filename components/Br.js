/**
 * This is a Br Element Component
 * 
 * Kreatx 2018
 */

//component definition
var Br = function(_props)
{
    this.template = function () 
    {        
        return  '<br/>';    
    };

    var _defaultParams = {
    };

    _props = extend(false, false, _defaultParams, _props);
    Component.call(this, _props);
};
Br.prototype.ctor = 'Br';