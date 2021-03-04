/**
 * This is a ViewStack component
 * A ViewStack navigator container consists of a collection of child containers stacked on top of each other, 
 * where only one child at a time is visible. When a different child container is selected, 
 * it seems to replace the old one because it appears in the same location. 
 * However, the old child container still exists; it is just invisible.
 * Kreatx 2019
 */

//component definition
var ViewStack = function (_props) {
    let _self = this;
    //we override proxy initialization, because we want to create a child if it is requested
    this.initProxy = function () {
        return new Proxy(this, {
            get: function (target, property, receiver) {
                if (!target.hasOwnProperty(property) && !target.constructor.prototype.hasOwnProperty(property)) {
                    if (target.children && target.children[property])
                        return target.children[property];
                    else {
                        let ind = indexOfObject(_components, "props.id", property);
                        if (ind > -1) {
                            _components[ind].props.display = false;
                            _addComponents([_components[ind]]);
                            return target.children[property];
                        }
                    }
                }
                return Reflect.get(...arguments);
            },
            getOwnPropertyDescriptor(target, property) {
                if (!target.hasOwnProperty(property) && !target.constructor.prototype.hasOwnProperty(property)) {
                    if (target.children && target.children[property])
                        return { configurable: true, enumerable: true };
                    else {
                            let ind = indexOfObject(_components, "props.id", property);
                            if (ind > -1) {
                                _components[ind].props.display = false;
                                _addComponents([_components[ind]]);
                                return { configurable: true, enumerable: true };
                            }
                        }
                }
                return Reflect.getOwnPropertyDescriptor(...arguments);
            }
        });
    };

    Object.defineProperty(this, "selectedIndex", {
        get: function selectedIndex() {
            return _selectedIndex;
        },
        set: function selectedIndex(v) {
            if (_selectedIndex != v) {
                let event = jQuery.Event("change");
                this.$el.trigger(event, [_selectedIndex, v]);
                if (!event.isDefaultPrevented()) {
                    _selectedIndex = v;
                    _renderSelectedChild(_selectedIndex);
                }
            }
        },
        enumerable: true
    });

    this.beforeAttach = function () {

    };

    let _defaultParams = {
        selectedIndex: 0,
        type: ContainerType.NONE
    };

    _props = extend(false, false, _defaultParams, _props);
    let _selectedIndex = _props.selectedIndex;
    let _components = [];

    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["change", "changed"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let r = Container.call(this, _props);
    let _addComponents = this.addComponents.bind(_self);

    let _renderSelectedChild = function (si) {
        let len = _self.csorted.length;
        for (let i = 0; i < len; i++) {
            if (i != si)
                _self.childAtIndex(i).display = false;
            else
                _self.childAtIndex(i).display = true;
        }
        let p;
        let c = _self.childAtIndex(si);
        if (!c) {
            let cmp = _components[si];
            if (cmp) {
                p = _addComponents([cmp]);
            } else {
                p = _addComponents([]);
            }
        }
        return p;
    };

    this.addComponents = function (components) {
        if (components && components.length > 0) {
            _components.splicea(_components.length, 0, components);
        }
        return Promise.resolve(_renderSelectedChild(_selectedIndex));
    };

    Object.defineProperty(this, "components", {
        get: function components() {
            return _components;
        },
        set: function components(v) {
            this.removeAllChildren();
            _components = v;
            this.addComponents(_components);
        },
        enumerable: true,
        configurable: true
    });

    return r;
};
ViewStack.prototype.ctor = 'ViewStack';