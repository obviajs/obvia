/**
 * This is a CollectionEditor Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var ObjectEditor = function (_props, overrided = false) {
    let _self = this, _value, _instance, _field;

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

    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
            }
        },
        enumerable:true
    });

    var _initDP = function(){
        if(!ObjectEditor.init){
            for(let i=0;i<ObjectEditor.remoteSources.length;i++){
                let r = new ArrayEx(new RemoteArray(ObjectEditor.remoteSources[i].props));
                ObjectEditor.remoteData[ObjectEditor.remoteSources[i].name] = r;
            }
            ObjectEditor.init = true;
        }
    }

    this.initFields = function(inst, fld){

        props = fld!=null && fld!=""?inst[fld]:inst;
        let rows = [];
        _self.removeAllChildren();
        for(let prop in props){
            if(ObjectEditor.metaProps[prop]){
                let propEditor = ObjectEditor.propEditors[ObjectEditor.metaProps[prop].ctor];
                if(propEditor){
                    let itemEditorLit = propEditor.itemEditor;
                    if(ObjectEditor.metaProps[prop].props)
                        itemEditorLit.props = extend(false, false, itemEditorLit.props, ObjectEditor.metaProps[prop].props);
                    
                    if(ObjectEditor.metaProps[prop].ctor in {"CollectionEditor":1, "ObjectEditor":1}){
                        itemEditorLit.props.instance = props[prop];
                        itemEditorLit.props.field = null;
                    }
                    let ff = extend(true, formField);
                    ff.props.label = ObjectEditor.metaProps[prop].label;
                    ff.props.placeholder = ObjectEditor.metaProps[prop].label;
                    ff.props.required = ObjectEditor.metaProps[prop].required;

                    if(ObjectEditor.metaProps[prop].targetProps != undefined)
                    {
                        let targetLit;
                        if(ObjectEditor.metaProps[prop].targetProps.target && ObjectEditor.metaProps[prop].targetProps.target.ctor){
                            targetLit = ObjectEditor.propEditors[ObjectEditor.metaProps[prop].targetProps.target.ctor].itemEditor;
                            targetLit.props = extend(false, false,targetLit.props, ObjectEditor.metaProps[prop].targetProps.target.props);
                        }
                        
                        let anchor = ObjectEditor.metaProps[prop].targetProps.anchor;
                    
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
                    ff.props.index = ObjectEditor.metaProps[prop].index;
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
//Can be a RemoteArray perse...
ObjectEditor.remoteSources = new ArrayEx([{name:"test", description:"Test Remote Source", props:{url:"http://139.162.158.49/rca/index.php", post:{"testKey":"testValue"}, recordsPerPage:5}}]);
ObjectEditor.remoteData = {};

ObjectEditor.componentValueField = "ctor";
ObjectEditor.componentLabelField = "label";
ObjectEditor.remoteData.componentList = [ 
    {
        "label":"Label", "icon":"horizontal-line.png", "ctor": "Label"
    },
    {
        "label":"Heading", "icon":"", "ctor": "Heading"
    },
    {
        "label":"Link", "icon":"", "ctor": "Link"
    },
    {
        "label":"HRule", "icon":"", "ctor": "HRule"
    },
    {
        "label":"Button", "icon":"", "ctor": "Button"
    },
    {
        "label":"TextInput", "icon":"", "ctor": "TextInput"
    },
    {
        "label":"TextArea", "icon":"", "ctor": "TextArea"
    },
    {
        "label":"DateTime", "icon":"", "ctor": "DateTime"
    },
    {
        "label":"DateTimeCb", "icon":"", "ctor": "DateTimeCb"
    },
    {
        "label":"Image", "icon":"", "ctor": "Image"
    },
    {
        "label":"Select", "icon":"drop-down-list.png", "ctor": "Select"
    },
    {
        "label":"DropDown", "icon":"drop-down-list.png", "ctor": "DropDown"
    },
    {
        "label":"Amount", "icon":"", "ctor": "Amount"
    },
    {
        "label":"Tree", "icon":"", "ctor": "Tree"
    },
    {
        "label":"AutoComplete", "icon":"", "ctor": "AutoCompleteEx"
    },
    {
        "label":"AutoBrowse", "icon":"", "ctor": "AutoBrowse"
    },
    {
        "label":"RadioGroup", "icon":"", "ctor": "RadioGroup"
    },
    {
        "label":"Toggle", "icon":"", "ctor": "Toggle"
    },
    {
        "label":"CheckBox", "icon":"", "ctor": "CheckBox"
    },
    {
        "label":"CheckBoxGroup", "icon":"", "ctor": "CheckBoxGroup"
    },
    {
        "label":"Form", "icon":"", "ctor": "Form"
    },
    {
        "label":"Container", "icon":"", "ctor": "Container"
    },
    {
        "label":"ViewStack", "icon":"", "ctor": "ViewStack"
    },
    {
        "label":"Upload", "icon":"", "ctor": "UploadEx"
    },
    {
        "label":"MultiUpload", "icon":"", "ctor": "MultiUpload"
    },
    {
        "label":"Repeater", "icon":"", "ctor": "Repeater"
    },
    {
        "label":"DataGrid", "icon":"", "ctor": "DataGrid"
    },
    {
        "label":"CalendarDay", "icon":"", "ctor": "CalendarDay"
    },
    {
        "label":"CalendarWeek", "icon":"", "ctor": "CalendarWeek"
    }
];
ObjectEditor.metaProps = {
    id: {ctor:"TextInput", label: "Component ID", required:true, index:1},
    name: {ctor:"TextInput", label: "Component Name", required:true, index:2},
    label: {ctor:"TextInput", label: "Label", required:true, index:3},
    visible: {ctor:"Toggle", label: "Visible", index:4},
    enabled: {ctor:"Toggle", label: "Enabled", index:5}, 
    required: {ctor:"Toggle", label: "Required", index:6},
    checked: {ctor:"Toggle", label: "Checked", index:7},
    dataProvider: {ctor:"AutoBrowse", label: "Data Provider", required:true, props:{
        valueField: ObjectEditor.providerValueField,
        labelField: ObjectEditor.providerLabelField,
        dataProvider: ObjectEditor.remoteSources,
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
        }
    }, index:8},
    labelField: {ctor:"AutoCompleteEx", label: "Label Field", required:true, props:{
        valueField: "prop",
        labelField: "description"
    }, index:9},
    valueField: {ctor:"AutoCompleteEx", label: "Value Field", required:true, props:{
        valueField: "prop",
        labelField: "description"
    }, index:10},
    mask: {ctor:"AutoCompleteEx", label: "Data Provider", required:true, props:{
        valueField: ObjectEditor.maskValueField,
        labelField: ObjectEditor.maskLabelField,
        dataProvider: ObjectEditor.masks
    }, index:11},
    inputFormat: {ctor:"TextInput", label: "Input Format", required:true, props:{
        value:'DD/MM/YYYY'
    }, index:12},
    outputFormat: {ctor:"TextInput", label: "Output Format", required:true, props:{
        value:'DD-MM-YYYY'
    }, index:13},
    displayFormat: {ctor:"TextInput", label: "Display Format", required:true, props:{
        value:'DD/MM/YYYY'
    }, index:14},
    multiple: {ctor:"Toggle", label: "Multiple Files", index:15},
    accept:{ctor:"Toggle", label: "Allowed Files", index:16},
    spacing:{ctor:"SpacingEditor", label: "Adjust Spacing", index:17},
    columns:{ctor:"CollectionEditor", label: "Columns", index:18, props:{
            memberType:"DataGridColumn"
        },
        targetProps:{
            target:{
                ctor:"BrowserWindow",
                props:{
                    height:500,
                    width:600,
                    left:800,
                    top:200,
                }
            },anchor:{
                component:{
                    ctor: Button,
                    props: {
                        id: 'anchorBtn',
                        type: "button",
                        label: "Manage Columns",
                        components: [{
                            ctor: Label,
                            props: {
                                id: 'fa',
                                labelType: LabelType.i,
                                classes: ["fas","fa-list"]
                            }
                        }]
                    }
                },
                events:[{
                    event:"click", handler: function(e, oe, itemEditorLit, targetLit){
                        let wl = extend(true, targetLit);
                        wl.props.components = [itemEditorLit];
                        let win = oe.addComponent(wl);
                        win.show();
                    }}
                ]
            }
        }
    },
    dataField: "textLabel",
    headerText: "Pija Preferuar",
    sortInfo:{sortOrder:0, sortDirection:"ASC"},
    sortable:{ctor:"Toggle", label: "Sortable", index:20, props:{
        change: function(){
        }
    }},
    editable:{ctor:"Toggle", label: "Editable", index:21, props:{
        change: function(){
        }
    }},
    itemRenderer:{ctor:"ObjectEditor", label: "Item Renderer", required:true, props:{
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
        }
    },
    targetProps:{
        target:{
            ctor:"BrowserWindow",
            props:{
                height:500,
                width:600,
                left:800,
                top:200,
            }
        },anchor:{
            component:{
                ctor: AutoBrowse,
                props: {
                    id: 'anchorBtn',
                    valueField: ObjectEditor.componentValueField,
                    labelField: ObjectEditor.componentValueField,
                    dataProvider: ObjectEditor.remoteData.componentList,
                    fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}]        
                }
            },
            events:[{
                event:"browse", handler: function(e, oe, itemEditorLit, targetLit){
                    if(this.value && this.value.length>0){
                        e.preventDefault();
                        let wl = extend(true, targetLit);
                        itemEditorLit.props.instance = extend(true, ObjectEditor.propEditors[this.value[0][ObjectEditor.componentValueField]].itemEditor);
                        itemEditorLit.props.field = "props";
                        wl.props.components = [itemEditorLit];
                        let win = oe.addComponent(wl);
                        win.show();
                    }
                }}
            ]
        }
    },
    index:18},
    itemEditor:{ctor:"ObjectEditor", label: "Item Editor", required:false, props:{
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
            console.log(arguments);
        }
    }, 
    targetProps:{
        target:{
            ctor:"BrowserWindow",
            props:{
                height:500,
                width:600,
                left:800,
                top:200,
            }
        },anchor:{
            component:{
                ctor: AutoBrowse,
                props: {
                    id: 'anchorBtn',
                    valueField: ObjectEditor.componentValueField,
                    labelField: ObjectEditor.componentValueField,
                    dataProvider: ObjectEditor.remoteData.componentList,
                    fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}]        
                }
            },
            events:[{
                event:"browse", handler: function(e, oe, itemEditorLit, targetLit){
                    if(this.value && this.value.length>0){
                        e.preventDefault();
                        let wl = extend(true, targetLit);
                        itemEditorLit.props.instance = extend(true, ObjectEditor.propEditors[this.value[0][ObjectEditor.componentValueField]].itemEditor);
                        itemEditorLit.props.field = "props";
                        wl.props.components = [itemEditorLit];
                        let win = oe.addComponent(wl);
                        win.show();
                    }
                }}
            ]
        }
    },
    index:19}
};

ObjectEditor.formField = {
    ctor: FormField,
    props: {
        id: 'formField',
        label: 'Label',
        placeholder: 'Placeholder',
        name: 'formField',
        size: FormFieldSize.SMALL,
        //spacing:{colSpan:2},
        component: {}
    }
};

ObjectEditor.propEditors = {
    "TextInput": {
        itemEditor: {
            "ctor": TextInput,
            "props":{
                id: 'textField'
            }
        },
        set:null,
        get:null,
        valueField:null,
        label:"Text Input",
        icon:"horizontal-line.png"
    },
    "Toggle": {
        itemEditor: {
            "ctor": Toggle,
            "props":{
                id: 'toggle',
                value: true,
                classes:{
                    "self":["switch", "block"]
                }
            }
        },
        set:null,
        get:null,
        valueField:"checked",
        label:"Toogle",
        icon:".png"
    },
    "AutoCompleteEx": {
        itemEditor: {
            "ctor": Toggle,
            "props":{
                id: 'AutoCompleteEx',
                allowNewItem: false,
                value: [],
                multiSelect: false,
                matchType:StringMatchType.STARTS_WITH
            }
        },
        set:null,
        get:null,
        valueField:null,
        label:"AutoComplete",
        icon:".png"
    },
    "AutoBrowse": {
        itemEditor: {
            "ctor": AutoBrowse,
            "props":{
                id: "AutoBrowse",
                labelField: ObjectEditor.providerLabelField,
                valueField: ObjectEditor.providerValueField,
                dataProvider: ObjectEditor.remoteSources,
                classes:["ml-0"],
                fields:[{"field":ObjectEditor.providerValueField, "description":ObjectEditor.providerValueField, "visible":false}, {"field":ObjectEditor.providerLabelField, "description":ObjectEditor.providerLabelField}]
            }
        },
        label:"AutoBrowse",
        icon:".png"
    },
    "SpacingEditor": {
        itemEditor: {
            "ctor": SpacingEditor,
            "props":{
            }
        },
        valueField:null,
        label:"SpacingEditor",
        icon:".png"
    },
    "CollectionEditor":{
        itemEditor: {
            "ctor": CollectionEditor,
            "props":{
            }
        },
        valueField:null,
        label:"CollectionEditor",
        icon:".png"
    },
    "ObjectEditor":{
        itemEditor: {
            "ctor": ObjectEditor,
            "props":{
            }
        },
        valueField:null,
        label:"ObjectEditor",
        icon:".png"
    },
    "BrowserWindow":{
        itemEditor: {
            ctor: BrowserWindow,
            props: {
                id:"window"
            }
        },
        label:"BrowserWindow",
        icon:".png"
    },
    "Label":{
        itemEditor: {
            "ctor": Label,
            "props":{
                id: 'label',
                label:"Click Me"
            }
        },
        label:"Label",
        icon:".png"
    },
    "DataGridCellRenderer":{
        itemEditor: {
            "ctor": DataGridCellRenderer,
            "props":{
                id: 'label',
                label:"Click Me"
            }
        },
        label:"DataGridCellRenderer",
        icon:".png"
    }
};

