/**
 * This is a CollectionEditor Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var ObjectEditor = function (_props, overrided = false) {
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

    var _initDP = function () {
        if (!ObjectEditor.init) {
            for (let i = 0; i < Builder.sources.length; i++) {
                //if(ObjectEditor.source[i].remote)
                let r = new ArrayEx(new RemoteArray(Builder.sources[i].props));
                ObjectEditor.data[Builder.sources[i].name] = r;
            }
            ObjectEditor.init = true;
        }
    };

    this.initFields = function (inst, fld) {
        props = fld != null && fld != "" ? inst[fld] : inst;
        let rows = [];
        for (let prop in props) {
            let propsMeta = extend(true, Builder.metaProps[inst.ctor] && Builder.metaProps[inst.ctor][prop] ? Builder.metaProps[inst.ctor][prop] : Builder.metaProps[prop]);
            if (propsMeta && !Object.isEmpty(propsMeta)) {
                let propEditor = extend(true, Builder.components[propsMeta.ctor]);
                if (propEditor) {
                    let itemEditorLit = propEditor.literal;
                    if (propsMeta.props && typeof propsMeta.props != 'function')
                        itemEditorLit.props = extend(false, false, itemEditorLit.props, propsMeta.props);
                    else if (typeof propsMeta.props == 'function')
                        itemEditorLit.props = propsMeta.props.call(inst, this);
                    
                    if (propsMeta.ctor in { "CollectionEditor": 1, "ObjectEditor": 1 }) {
                        itemEditorLit.props.instance = props[prop];
                        itemEditorLit.props.field = null;
                    }
                    let ff = extend(true, formField);
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
                    if (propsMeta.targetProps != undefined) {
                        let targetLit;
                        if (propsMeta.targetProps.target && propsMeta.targetProps.target.ctor) {
                            if (Builder.components[propsMeta.targetProps.target.ctor]) {
                                targetLit = Builder.components[propsMeta.targetProps.target.ctor].literal;
                                targetLit.props = extend(false, false, targetLit.props, propsMeta.targetProps.target.props);
                            } else { 
                                targetLit = propsMeta.targetProps.target;
                            }
                        }
                        
                        let anchor = propsMeta.targetProps.anchor;
                    
                        let events = {};
                        for (let i = 0; i < anchor.events.length; i++) {
                            let anchorHandler = anchor.events[i].handler;
                            events[anchor.events[i].event] = function (e) {
                                anchorHandler.apply(this, [e, r, itemEditorLit, targetLit]);
                            };
                        }

                        if (anchor.component) {
                            ff.props.component = anchor.component;
                        } else {
                            ff.props.component = itemEditorLit;
                        }
                        for (let evt in events) {
                            ff.props.component.props[evt] = events[evt];
                        }
                    } else {
                        if (propsMeta.ctor in { "CollectionEditor": 1, "ObjectEditor": 1 }) {
                            if (!itemEditorLit.props.classes) { 
                                itemEditorLit.props.classes = ["collapse"];
                            }else
                                itemEditorLit.props.classes.pushUnique("collapse");
                        }
                        ff.props.component = itemEditorLit;
                    }
                    if (ff.props.classes)
                        ff.props.classes.pushUnique("mt-3");
                    else
                        ff.props.classes = ["mt-3"];
                    ff.props.component.props.bindingDefaultContext = props;
                    ff.props.component.props[(propEditor.valueField || "value")] = "{?" + prop + "}";
                    ff.props.index = propsMeta.index;
                    rows.push(extend(true, ff));
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
            if(_props.instance){
                _field = _props.field;
                this.instance = _props.instance;
            }
        }
    };

    let _cmps, _colSpan, _offset, _mb, _mt;
    
    var _defaultParams = {
        type: ContainerType.CONTAINER,
        "components": [],
        sortChildren: true,
        field: "props"
    };
    _props = extend(false, false, _defaultParams, _props);
    _initDP();
    this.$container = this.$el;
    
    let r = Container.call(this, _props);
    return r;
};

ObjectEditor.prototype.ctor = 'ObjectEditor';

ObjectEditor.init = false;
ObjectEditor.masks;
ObjectEditor.maskValueField = "";
ObjectEditor.maskLabelField = "";

ObjectEditor.data = {};
ObjectEditor.data.countries = [{ "value": "1", "text": "Albania" }, { "value": "2", "text": "Greece" }, { "value": "3", "text": "Italy" }];

ObjectEditor.componentValueField = "ctor";
ObjectEditor.componentLabelField = "label";