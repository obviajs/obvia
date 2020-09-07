/**
 * This is a TFoot Element
 * 
 * Kreatx 2020
 */

//component definition
var TFoot = function (_props, _hideComponents=false) {
   
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
        }
    };
    this.template = function () {
        return "<tfoot id='" + this.domID + "'></tfoot>";
    };

    let _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);

    let r = Parent.call(this, _props, _hideComponents);
    return r;
};
TFoot.prototype.ctor = 'TFoot';