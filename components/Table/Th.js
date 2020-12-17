/**
 * This is a Th Element
 * 
 * Kreatx 2020
 */

//component definition
var Th = function (_props, _hideComponents=false) {
   
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
        return "<th id='" + this.domID + "'></th>";
    };

    let _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);

    let r = TCell.call(this, _props, _hideComponents);
    return r;
};
Th.prototype.ctor = 'Th';