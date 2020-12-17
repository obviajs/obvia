/**
 * This is a Td Element
 * 
 * Kreatx 2020
 */

//component definition
var Td = function (_props, _hideComponents=false) {
   
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
        return "<td id='" + this.domID + "'></td>";
    };

    let _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);

    let r = TCell.call(this, _props, _hideComponents);
    return r;
};
Td.prototype.ctor = 'Td';