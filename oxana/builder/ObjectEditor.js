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
                    var itemEditorLit = propEditor.itemEditor;
                    if(ObjectEditor.metaProps[prop].props)
                        itemEditorLit.props = extend(false, false, itemEditorLit.props, ObjectEditor.metaProps[prop].props);
                    
                    itemEditorLit.props.bindingDefaultContext = inst;
                    itemEditorLit.props[(propEditor.valueField || "value")] = "{"+prop+"}";
                    if(ObjectEditor.metaProps[prop].ctor == "CollectionEditor"){
                        itemEditorLit.props.instance = props[prop];
                    }
                    let ff = extend(true, formField);
                    ff.props.label = ObjectEditor.metaProps[prop].label;
                    ff.props.placeholder = ObjectEditor.metaProps[prop].label;
                    ff.props.required = ObjectEditor.metaProps[prop].required;

                    if(ObjectEditor.metaProps[prop].targetProps != undefined)
                    {
                        
                        let winLit = {
                            ctor: BrowserWindow,
                            props: {
                                id:"propertyEditorWindow",
                                components: [itemEditorLit],
                                height:ObjectEditor.metaProps[prop].targetProps.height,
                                width:ObjectEditor.metaProps[prop].targetProps.width,
                                left:ObjectEditor.metaProps[prop].targetProps.left,
                                top:ObjectEditor.metaProps[prop].targetProps.top
                            }
                        };
                        ObjectEditor.metaProps[prop].targetProps.anchorComponent.props.click = function(e){
                            let wl = extend(true, winLit);
                            let win = _self.addComponent(wl);
                            win.show();
                        }

                        ff.props.component = ObjectEditor.metaProps[prop].targetProps.anchorComponent;
                    }else
                    {
                        ff.props.component = itemEditorLit;
                    }
                    ff.props.index = ObjectEditor.metaProps[prop].index;
                    rows.push(ff);
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

ObjectEditor.componentValueField = "label";
ObjectEditor.componentLabelField = "ctor";
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
            target:"_blank", anchorComponent:{
                ctor: Button,
                props: {
                    id: 'anchorBtn',
                    type: "button",
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
            height:500,
            width:600,
            left:800,
            top:200,
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
    itemRenderer:{ctor:"AutoBrowse", label: "Item Renderer", required:false, props:{
        valueField: ObjectEditor.providerValueField,
        labelField: ObjectEditor.providerLabelField,
        dataProvider: ObjectEditor.remoteSources,
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
        }
    }, index:18},
    itemEditor:{ctor:"AutoBrowse", label: "Item Editor", required:false, props:{
        valueField: ObjectEditor.componentValueField,
        labelField: ObjectEditor.componentLabelField,
        dataProvider: ObjectEditor.remoteData.componentList,
        fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}],
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
            console.log(arguments);
        }
    }, index:19}
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
        valueField:null
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
        valueField:"checked"
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
        valueField:null
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
        }
    },
    "SpacingEditor": {
        itemEditor: {
            "ctor": SpacingEditor,
            "props":{
            }
        },
        valueField:null
    },
    "CollectionEditor":{
        itemEditor: {
            "ctor": CollectionEditor,
            "props":{
            }
        },
        valueField:null
    }
};

