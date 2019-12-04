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
                this.initFields(_instance);
            }
        },
        enumerable:true
    });

    var _initDP = function(){
        if(!ObjectEditor.init){
            for(let i=0;i<ObjectEditor.sources.length;i++){
                //if(ObjectEditor.source[i].remote)
                let r = new ArrayEx(new RemoteArray(ObjectEditor.sources[i].props));
                ObjectEditor.data[ObjectEditor.sources[i].name] = r;
            }
            ObjectEditor.init = true;
        }
    }

    this.initFields = function(inst, fld){

        props = fld!=null && fld!=""?inst[fld]:inst;
        let rows = [];
        _self.removeAllChildren();
        for(let prop in props){
            let propsMeta = extend(true, ObjectEditor.metaProps[inst.ctor] && ObjectEditor.metaProps[inst.ctor][prop]?ObjectEditor.metaProps[inst.ctor][prop]:ObjectEditor.metaProps[prop]);
            if(propsMeta && !Object.isEmpty(propsMeta)){
                let propEditor = extend(true, ObjectEditor.components[propsMeta.ctor]);
                if(propEditor){
                    let itemEditorLit = propEditor.literal;
                    if(propsMeta.props)
                        itemEditorLit.props =  extend(false, false, itemEditorLit.props, propsMeta.props);
                    
                    if(propsMeta.ctor in {"CollectionEditor":1, "ObjectEditor":1}){
                        itemEditorLit.props.instance = props[prop];
                        itemEditorLit.props.field = null;
                    }
                    let ff = extend(true, formField);
                    ff.props.label = propsMeta.label;
                    ff.props.placeholder = propsMeta.label;
                    ff.props.required = propsMeta.required;

                    if(propsMeta.targetProps != undefined)
                    {
                        let targetLit;
                        if(propsMeta.targetProps.target && propsMeta.targetProps.target.ctor){
                            targetLit = ObjectEditor.components[propsMeta.targetProps.target.ctor].literal;
                            targetLit.props = extend(false, false,targetLit.props, propsMeta.targetProps.target.props);
                        }
                        
                        let anchor = propsMeta.targetProps.anchor;
                    
                        let events = {};
                        for(let i=0;i<anchor.events.length;i++){
                            let anchorHandler = anchor.events[i].handler;
                            events[anchor.events[i].event] = function(e){
                                anchorHandler.apply(this, [e, _self, itemEditorLit, targetLit]);
                            };
                        }

                        if(anchor.component){
                            ff.props.component = anchor.component;
                        }else{
                            ff.props.component = itemEditorLit;
                        }
                        for(let evt in events){
                            ff.props.component.props[evt] = events[evt];
                        }
                    }else
                    {
                        ff.props.component = itemEditorLit;                       
                    }
                    ff.props.component.props.bindingDefaultContext = props;
                    ff.props.component.props[(propEditor.valueField || "value")] = "{?"+prop+"}";
                    ff.props.index = propsMeta.index;
                    rows.push(extend(true, ff));
                }else{
                    console.log("Couldnt find and itemEditor for " + prop + "property");
                }
            }else{
                console.log("Couldnt find metaProps info for " + prop + "property");
            }
        }
        return _self.addComponents(rows);
    }

    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            _initDP();
            this.$container = this.$el;
            if(_props.instance){
                _field = _props.field;
                _instance = _props.instance;
                this.initFields(_instance, _field);
            }
            e.preventDefault();
        }
    }
    let _cmps, _colSpan, _offset, _mb, _mt;
    
    var _defaultParams = {
        type: ContainerType.CONTAINER,
        "components": [],
        sortChildren: true,
        field: "props"
    };
    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props);
};

ObjectEditor.prototype.ctor = 'ObjectEditor';

ObjectEditor.init = false;
ObjectEditor.providerValueField = "name";
ObjectEditor.providerLabelField = "description";
ObjectEditor.masks;
ObjectEditor.maskValueField = "";
ObjectEditor.maskLabelField = "";

ObjectEditor.data = {};
ObjectEditor.data.countries = [{ "value": "1", "text": "Albania" }, { "value": "2", "text": "Greece" }, { "value": "3", "text": "Italy" }];

ObjectEditor.componentValueField = "ctor";
ObjectEditor.componentLabelField = "label";