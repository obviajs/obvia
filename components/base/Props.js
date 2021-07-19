
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var Props = function (inst, _props, skip = []) {
    let _dskip = ["props", "children"];
    if (skip) {
        skip.splicea(skip.length, 0, _dskip);
    } else
        skip = _dskip;
    let _oc = ["Repeater", "RepeaterEx", "Select", "List", "AutoCompleteEx"]; 
    var _props = Object.getOwnPropertyDescriptors(inst);
    for (let prop in _props) {
        if ((skip.indexOf(prop) < 0) && _props[prop].enumerable && typeof inst[prop] != 'function' && inst.hasOwnProperty(prop) && (inst[prop]==null || !inst[prop].jquery)) {
            let bindingExp = inst.getBindingExpression && inst.getBindingExpression(prop);
            if (!bindingExp) {
                switch (prop) {
                    case "component":
                        let component = {};
                        if (inst.input) {
                            component.ctor = inst.input.ctor; //_component.ctor;
                            component.props = inst.input.props;
                        } else
                            component = inst.component;
                        this[prop] = component;
                        break;
                    case "components":
                        if (_oc.indexOf(inst.ctor) > -1) {
                            this[prop] = inst.components;
                        } else {
                            let components = [];
                            if (inst.csorted) {
                                for (let i = 0; i < inst.csorted.length; i++) {
                                    let component = inst.children[inst.csorted[i]].literal;
                                    components.push(component);
                                }
                            }
                            this[prop] = components;
                        }
                        break;
                    default:
                        if (!ObjectUtils.isObject(inst[prop]) || !ObjectUtils.isEmpty(inst[prop]))
                            this[prop] = inst[prop];
                }
            } else
                this[prop] = bindingExp.expression;
        }
    }
    let _jskip = ["ownerDocument", "input", "inputLabel", "currentItem", "currentRow"];
    this.toJSON = function () {
        let obj = {};
        for (let prop in this) {
            if ((_jskip.indexOf(prop) < 0) && typeof this[prop] != 'function' &&  (inst[prop]==null || !this[prop].jquery)) {
                switch (prop) {
                    case "dataProvider":
                        if (this.dataProvider) {
                            let len = this.dataProvider.length;
                            let dpCopy = new window[this.dataProvider.constructor.name](len);
                            for (let i = 0; i < len; i++) {
                                dpCopy[i] = extend(false, false, [], ["currentItem", "currentRow"], this.dataProvider[i]);
                            }
                            obj[prop] = dpCopy;
                        }
                        break;
                    case "rendering":
                        obj[prop] = {};
                        ObjectUtils.shallowCopy(inst.rendering, obj[prop], ["currentItem", "currentRow"]);
                        break;
                    default:
                        if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                            if (!ObjectUtils.isObject(this[prop]) || !ObjectUtils.isEmpty(this[prop]) || this[prop]==null)
                                obj[prop] = this[prop];
                                
                }
            }
        }
        return obj;
    };
};
export {
    Props
};