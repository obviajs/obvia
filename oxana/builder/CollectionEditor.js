/**
 * This is a CollectionEditor Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var CollectionEditor = function (_props, overrided = false) {
    var _self = this;
    var _defaultParams = {
        type: ContainerType.NONE,
        "components": []
    };
    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props);
    let _value;
};
CollectionEditor.prototype.ctor = 'CollectionEditor';
