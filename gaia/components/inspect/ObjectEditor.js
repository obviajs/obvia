/**
 * This is a CollectionEditor Definition Element
 * 
 * Kreatx 2018
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var ObjectEditor = function (_props, metaProps, literals) {
    let _self = this, _instance, _field;

    Object.defineProperty(this, "instance",
    {
        get: function instance() {
            return _instance;
        },
        set: function instance(v) {
            if (_instance != v) {
                _instance = v;
                this.addComponents(this.initFields(_instance, _field));
            }
        },
        enumerable:true
    });

    this.initFields = function (inst, fld) {
        let props = (fld != null && fld != "") ? inst[fld] : inst;
        let rows = [];
        if (metaProps[inst.ctor]) {
            
        }
        for (let prop in props) {
            //let propsMeta = ObjectUtils.extend(true, Builder.metaProps[inst.ctor] && Builder.metaProps[inst.ctor][prop] ? Builder.metaProps[inst.ctor][prop] : Builder.metaProps[prop]);
            let propsMeta = metaProps[inst.ctor] && metaProps[inst.ctor][prop] ? metaProps[inst.ctor][prop] : metaProps[prop];
            if (propsMeta && !ObjectUtils.isEmpty(propsMeta)) {
                let propEditor = ObjectUtils.extend(true, literals[propsMeta.ctor]);
                if (propEditor) {
                    let itemEditorLit = propEditor.literal;
                    if (propsMeta.props && typeof propsMeta.props != 'function')
                        itemEditorLit.props = ObjectUtils.extend(false, false, itemEditorLit.props, propsMeta.props);
                    else if (typeof propsMeta.props == 'function')
                        itemEditorLit.props = propsMeta.props.call(inst, this);
                    
                    if (propsMeta.ctor in { "CollectionEditor": 1, "ObjectEditor": 1 }) {
                        itemEditorLit.props.instance = props[prop];
                        itemEditorLit.props.field = null;
                    }
                    let ff = ObjectUtils.extend(true, literals["FormField"].literal);
                    ff.props.id = prop;
                    ff.props.label = propsMeta.label;
                    ff.props.placeholder = propsMeta.label;
                    ff.props.required = propsMeta.required;
                    if (propsMeta.ctor in { "CollectionEditor": 1, "ObjectEditor": 1 } && (propsMeta.targetProps == null)) {
                        ff.props.afterAttach = function (e) {
                            console.log("OE_END_DRAW" + this.id);
                            this.inputLabel.attr["data-toggle"] = "collapse";
                            this.inputLabel.attr["data-target"] = "#" + this.input.domID;
                        };
                    }
                    if (propsMeta.ctor in { "CollectionEditor": 1, "ObjectEditor": 1 }) {
                        if (!itemEditorLit.props.classes) { 
                            itemEditorLit.props.classes = ["collapse"];
                        }else
                            itemEditorLit.props.classes.pushUnique("collapse");
                    }
                    ff.props.component = itemEditorLit;
                    ff.props.component.props.id = ff.props.component.props.id == null ? "input_"+prop : ff.props.component.props.id;
                    if (ff.props.classes)
                        ff.props.classes.pushUnique("mt-3");
                    else
                        ff.props.classes = ["mt-3"];
                    if(!ff.props.component.props.bindingDefaultContext)
                        ff.props.component.props.bindingDefaultContext = props;
                    if (propsMeta.setter && typeof propsMeta.setter == 'function') { 
                        ff.props.component.props[(propEditor.valueField || "value")] = propsMeta.setter.call(inst, this);
                    }else
                        ff.props.component.props[(propEditor.valueField || "value")] = "{?" + prop + "}";
                    ff.props.index = propsMeta.index;
                    rows.push(ff);
                    //rows.push(extend(true, ff));
                } else {
                    console.log("Couldnt find and itemEditor for " + prop + " property");
                }
            } else {
                console.log("Couldnt find metaProps info for " + prop + " property");
            }
        }
        return rows;
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            e.preventDefault();
        }
    };
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            
        }
    };

    let _cmps, _colSpan, _offset, _mb, _mt;
    
    let _defaultParams = {
        type: "",
        "components": [],
        sortChildren: true,
        field: "props"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    this.$container = this.$el;
    _field = _props.field;
    if(_props.instance){
        _instance = _props.instance;
        _props.components = this.initFields(_instance, _field);
    }

    let r = Container.call(this, _props);
    return r;
};
DependencyContainer.getInstance().register("ObjectEditor", ObjectEditor, DependencyContainer.simpleResolve);
ObjectEditor.prototype.ctor = 'ObjectEditor';
export {
    ObjectEditor
};