var Props = function (inst, _props, skip = []) {
    
    let _oc = ["Repeater", "RepeaterEx", "Select", "List"]; 
    
    for (let prop in _props) {
        if (typeof _props[prop] != 'function' && (skip.indexOf(prop) < 0)) {
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
                            for (let i = 0; i < inst.csorted.length;i++) {
                                let component = inst.children[inst.csorted[i]].literal;
                                components.push(component);
                            }
                        }
                        this[prop] = components;
                    }                    
                    break;
                default:
                    if (inst.hasOwnProperty(prop) && inst.propertyIsEnumerable(prop))
                        if (!isObject(inst[prop]) || !Object.isEmpty(inst[prop]))
                            this[prop] = inst[prop];
            }
        }
    }

    this.toJSON = function () {
        let obj = {};
        for (let prop in this) {
            if (typeof this[prop] != 'function') {
                switch (prop) {
                    case "dataProvider":
                        if (this.dataProvider) {
                            let len = this.dataProvider.length;
                            let dpCopy = new window[this.dataProvider.constructor.name](len);
                            for (let i = 0; i < len; i++) {
                                dpCopy[i] = extend(false, false, [], ["currentItem"], this.dataProvider[i]);
                            }
                            obj[prop] = dpCopy;
                        }
                        break;
                    case "rendering":
                        obj[prop] = {};
                        shallowCopy(inst.rendering, obj[prop], ["currentItem"]);
                        break;
                    case "ownerDocument":
                        break;
                    default:
                        if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                            if ((!isObject(this[prop]) || !Object.isEmpty(this[prop])) && (this[prop]==null || !this[prop].$el))
                                obj[prop] = this[prop];
                }
            }
        }
        return obj;
    };
};
