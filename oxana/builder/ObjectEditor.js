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
                let propEditor = ObjectEditor.components[ObjectEditor.metaProps[prop].ctor];
                if(propEditor){
                    let itemEditorLit = propEditor.literal;
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
                            targetLit = ObjectEditor.components[ObjectEditor.metaProps[prop].targetProps.target.ctor].literal;
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
ObjectEditor.componentList = [ 
    {
        "label":"Label", "ctor": "Label"
    },
    {
        "label":"Heading", "ctor": "Heading"
    },
    {
        "label":"Link", "ctor": "Link"
    },
    {
        "label":"HRule", "ctor": "HRule"
    },
    {
        "label":"Button", "ctor": "Button"
    },
    {
        "label":"TextInput", "ctor": "TextInput"
    },
    {
        "label":"TextArea", "ctor": "TextArea"
    },
    {
        "label":"DateTime", "ctor": "DateTime"
    },
    {
        "label":"DateTimeCb", "ctor": "DateTimeCb"
    },
    {
        "label":"Image", "ctor": "Image"
    },
    {
        "label":"Select", "icon":"drop-down-list.png", "ctor": "Select"
    },
    {
        "label":"DropDown", "icon":"drop-down-list.png", "ctor": "DropDown"
    },
    {
        "label":"Amount", "ctor": "Amount"
    },
    {
        "label":"Tree", "ctor": "Tree"
    },
    {
        "label":"AutoComplete", "ctor": "AutoCompleteEx"
    },
    {
        "label":"AutoBrowse", "ctor": "AutoBrowse"
    },
    {
        "label":"RadioGroup", "ctor": "RadioGroup"
    },
    {
        "label":"Toggle", "ctor": "Toggle"
    },
    {
        "label":"CheckBox", "ctor": "CheckBox"
    },
    {
        "label":"CheckBoxGroup", "ctor": "CheckBoxGroup"
    },
    {
        "label":"Form", "ctor": "Form"
    },
    {
        "label":"Container", "ctor": "Container"
    },
    {
        "label":"ViewStack", "ctor": "ViewStack"
    },
    {
        "label":"Upload", "ctor": "UploadEx"
    },
    {
        "label":"MultiUpload", "ctor": "MultiUpload"
    },
    {
        "label":"MapLocationPicker", "ctor": "MapLocationPicker"
    },
    {
        "label":"Repeater", "ctor": "Repeater"
    },
    {
        "label":"List", "ctor": "List"
    },
    {
        "label":"DataGrid", "ctor": "DataGrid"
    },
    {
        "label":"CalendarDay", "ctor": "CalendarDay"
    },
    {
        "label":"CalendarWeek", "ctor": "CalendarWeek"
    },
    {
        "label":"CalendarMonth", "ctor": "CalendarMonth"
    },
    {
        "label":"Calendar", "ctor": "Calendar"
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
                    dataProvider: ObjectEditor.componentList,
                    fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}]        
                }
            },
            events:[{
                event:"browse", handler: function(e, oe, itemEditorLit, targetLit){
                    if(this.value && this.value.length>0){
                        e.preventDefault();
                        let wl = extend(true, targetLit);
                        itemEditorLit.props.instance = extend(true, ObjectEditor.components[this.value[0][ObjectEditor.componentValueField]].literal);
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
                    dataProvider: ObjectEditor.componentList,
                    fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}]        
                }
            },
            events:[{
                event:"browse", handler: function(e, oe, itemEditorLit, targetLit){
                    if(this.value && this.value.length>0){
                        e.preventDefault();
                        let wl = extend(true, targetLit);
                        itemEditorLit.props.instance = extend(true, ObjectEditor.components[this.value[0][ObjectEditor.componentValueField]].literal);
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

ObjectEditor.components = {
    "Label":{
        literal: {
            "ctor": Label,
            "props":{
                id: 'label',
                label:"Label"
            }
        },
        label:"Label",
        icon:".png"
    },
    "Heading":{
        literal: {
            "ctor": Heading,
            "props": {
                id: 'heading',
                label: 'Heading',
                headingType: HeadingType.h1,
                align: Align.left,
                classes: [],
                components: []
            }
        },
        label:"Heading",
        icon:".png"
    },
    "Link":{
        literal: {
            "ctor": Link,
            "props":{
                id: 'label',
                label:"Click Me",
                href:"#",
                target:""
            }
        },
        label:"Link",
        icon:".png"
    },
    "HRule":{
        literal: {
            "ctor": HRule,
            "props":{
                id: 'hrule',
                align: "center",
                size: 5,
                width: 1000,
            }
        },
        label:"HRule",
        icon:".png"
    },
    "Button": {
        literal: {
            "ctor": Button,
            "props":{
                id: 'button',
                type: "button",
                value: "",
                label:"Click Me",
                classes: ["btn", "btn-success"]
            }
        },
        label:"Button",
        icon:".png"
    },
    "TextInput": {
        literal: {
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
    "TextArea":{
        literal: {
            "ctor": TextArea,
            "props":{
                id: 'textarea',
                value: ''
            }
        },
        label:"TextArea",
        icon:"horizontal-line.png"
    },
    "DateTime":{
        literal: {
            "ctor": DateTime,
            "props":{
                id: 'datetime',
                inputFormat: 'DD/MM/YYYY',
                outputFormat: 'DD-MM-YYYY',
                displayFormat: 'MM/DD/YYYY',
                value: '2022/02/04'
            }
        },
        label:"DateTime",
        icon:".png"
    },
    "DateTimeCb":{
        literal: {
            "ctor": DateTimeCb,
            props: {
                id: 'dateTimeCb',
                mode: DateTimeMode.DATE_TIME_SECOND,
                versionStyle: '',
                inputFormat: 'DD/MM/YYYY',
                outputFormat: 'DD-MM-YYYY',
                value: '06/06/2019',
                classes:["ml-0"]
            }
        },
        label:"DateTimeSel",
        icon:".png"
    },
    "Image":{
        literal: {
            "ctor": Image,
            "props":{
                id: 'image',
                src: 'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg',
                alt: "Steve Jobs",
                height: 100,
                width: 100        
            }
        },
        label:"Image",
        icon:".png"
    },
    "Select":{
        literal: {
            "ctor": Select,
            "props":{
                id: 'select',
                dataProvider: [{ "value": "1", "text": "Albania" }, { "value": "2", "text": "Greece" }, { "value": "3", "text": "Italy" }],
                labelField: "text",
                valueField: "value",
                value: "2"
            }
        },
        label:"Image",
        icon:".png"
    },
    "DropDown":{
        literal: {
            "ctor": DropDown,
            "props":{
                id: 'dropdown',
                hrefField:"key",
                labelField:"title",
                label:"Click me",
                dataProvider: new ArrayEx([
                    { key: "#",title: "Folder 1"},        
                    { key: "#",title: "Folder 2"},
                    { key: "#",title: "Folder 3"}
                ])
            }
        },
        label:"DropDown",
        icon:".png"
    },
    "Amount":{
        literal: {
            "ctor": Amount,
            "props":{
                id: 'amount',
                currencyList: [{ "id": "1", "text": "EUR" }, { "id": "2", "text": "ALL" }, { "id": "3", "text": "GBP" }],
                value: {
                    "amount": "132323",
                    "currency": "2"
                }
            }
        },
        label:"Amount",
        icon:".png"
    },
    "Tree":{
        literal: {
            "ctor": Tree,
            "props":{
                id: 'tree',
                valueField: "key",
                labelField: "title",
                childrenField: "children",
                dataProvider:new ArrayEx([
                    {title: "Node 1", key: "1"},
                    {title: "Folder 2", key: "2", children: new ArrayEx([
                      {title: "Node 2.1", key: "3", myOwnAttr: "abc"},
                      {title: "Node 2.2", key: "4"}
                    ])}
                  ]),
                expandIcon: "fa-chevron-circle-right",
                collapseIcon: "fa-chevron-circle-down",
            }
        },
        label:"Tree",
        icon:".png"
    },
    "AutoCompleteEx": {
        literal: {
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
        literal: {
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
    "RadioGroup": {
        literal: {
            "ctor": RadioGroup,
            "props":{
                id: 'radiogroup',
                dataProvider: [
                    { "id": "1", "text": "Option 1", "enabled":true, "buttonClass": []}, 
                    { "id": "2", "text": "Option 2", "enabled":true, "buttonClass": []},
                    { "id": "3", "text": "Option 3", "enabled":false, "buttonClass": []}
                ],
                valueField: 'id',
                labelField: 'text',
                classesField: "buttonClass",
                defaultClasses: ['btn btn-xs btn-default'],
                selectedClasses: ['btn btn-xs btn-success'],
                enabledField: "enabled",
                checkedField: "checked",
                value: [{ "id": "2", "text": "Option 2", "enabled":true}]
            }
        },
        label:"RadioGroup",
        icon:".png"
    },
    "CheckBox": {
        literal: {
            "ctor": CheckBox,
            "props":{
                id: 'checkBoxField',
                label: 'CheckBox Label',
                value: "1",
                checked:false
            }
        },
        label:"CheckBox",
        icon:".png"
    },
    "Toggle": {
        literal: {
            "ctor": Toggle,
            "props":{
                id: 'toggle',
                value: true,
                checked:false,
                classes:{
                    "self":["switch", "block"],
                    "span":["slider"]
                }
            }
        },
        set:null,
        get:null,
        valueField:"checked",
        label:"Toogle",
        icon:".png"
    },
    "CheckBoxGroup":{
        literal: {
            "ctor": CheckBoxGroup,
            "props":{
                id: 'checkBoxGroupLonely1',
                dataProvider: [
                    { "id": "1", "text": "Option 1", "buttonClass": ['btn btn-xs btn-default'], "enabled":true, "checked":false},
                    { "id": "2", "text": "Option 2", "buttonClass": ['btn btn-xs btn-default'], "enabled":true, "checked":false},
                    { "id": "3", "text": "Option 3", "buttonClass": ['btn btn-xs btn-success'], "enabled":true, "checked":true},
                    { "id": "4", "text": "Option 4", "buttonClass": ['btn btn-xs btn-default'], "enabled":true, "checked":false}
                ],
                valueField: "id",
                labelField: "text",
                classesField: "buttonClass",
                defaultClasses: ['btn btn-xs btn-default'],
                selectedClasses: ['btn btn-xs btn-success'],
                enabledField: "enabled",
                checkedField: "checked",
                value: [{ "id": "3", "text": "Option 3", "buttonClass": ['btn btn-xs btn-success'], "enabled":true}]
            }
        },
        label:"CheckBoxGroup",
        icon:".png"
    },  
    "Form":{
        literal: {
            "ctor": Form,
            "props":{
                id: 'form',
                formName: 'My Form',
                action:"",
                components: [],
                classes:["default-cnt"]
            }
        },
        label:"Form",
        icon:".png"
    },
    "Container":{
        literal: {
            ctor: Container,
            props: {
                id: 'container',
                type: ContainerType.NONE,
                classes:["default-component","default-cnt"]
            }
        },
        label:"Container",
        icon:".png"
    },
    "ViewStack":{
        literal: {
            ctor: ViewStack,
            props: {
                id: 'viewStack',
                classes:["default-component","default-cnt"]
            }
        },
        label:"ViewStack",
        icon:".png"
    },
    "UploadEx":{
        literal: {
            ctor: UploadEx,
            props: {
                id: 'upload',
                multiple: true
            }
        },
        label:"UploadEx",
        icon:".png"
    },
    "MultiUpload":{
        literal: {
            ctor: MultiUpload,
            props: {
                id: 'multiUpload',
            }
        },
        label:"MultiUpload",
        icon:".png"
    },
    "MapLocationPicker":{
        literal: {
            ctor: MapLocationPicker,
            props: {
                id: 'map',
                value: {
                    latitude: 41.1533,
                    longitude: 20.1683
                },
                zoomLevel: 7
            }
        },
        label:"MapLocationPicker",
        icon:".png"
    },
    "Repeater":{
        literal: {
            ctor: Repeater,
            props: {
                id: 'repeater',
            }
        },
        label:"Repeater",
        icon:".png"
    },
    "List":{
        iteral: {
            ctor: List,
            props: {
                id: 'list',
                multiselect: true,
                dataProvider: new ArrayEx([
                    { "id": "1", "text": "Option 1", "buttonClass": ["btn-default"]},
                    { "id": "2", "text": "Option 2", "buttonClass": ["btn-default"]},
                    { "id": "3", "text": "Option 3", "buttonClass": ["btn-default"]},
                    { "id": "4", "text": "Option 4", "buttonClass": ["btn-default"]}
                ]),
                valueField: "id",
                classesField: "buttonClass",
                defaultClasses: ["btn-default"],
                selectedClasses: ["btn-success"],    
                value:[{ "id": "1"}],      
                components: [{
                    ctor: Button,
                    props: {
                        id: 'button',
                        type: "button",
                        value: "{id}",
                        label: "{text}",
                        classes: "{buttonClass}"
                    }
                }]
            }
        },
        label:"List",
        icon:".png"
    },
    "DataGrid":{
        literal: {
            ctor: DataGrid,
            props: {
                id: 'dataGrid',
                columns:new ArrayEx([])
            }
        },
        label:"DataGrid",
        icon:".png"
    },
    "CalendarDay":{
        literal: {
            ctor: CalendarDay,
            props: {
                id: 'calendarDay',
            }
        },
        label:"CalendarDay",
        icon:".png"
    },
    "CalendarWeek":{
        literal: {
            ctor: CalendarWeek,
            props: {
                id: 'calendarWeek',
            }
        },
        label:"CalendarWeek",
        icon:".png"
    },      
    "SpacingEditor": {
        literal: {
            "ctor": SpacingEditor,
            "props":{
            }
        },
        valueField:null,
        label:"SpacingEditor",
        icon:".png"
    },
    "CollectionEditor":{
        literal: {
            "ctor": CollectionEditor,
            "props":{
            }
        },
        valueField:null,
        label:"CollectionEditor",
        icon:".png"
    },
    "ObjectEditor":{
        literal: {
            "ctor": ObjectEditor,
            "props":{
            }
        },
        valueField:null,
        label:"ObjectEditor",
        icon:".png"
    },
    "BrowserWindow":{
        literal: {
            ctor: BrowserWindow,
            props: {
                id:"window"
            }
        },
        label:"BrowserWindow",
        icon:".png"
    },   
    "DataGridCellRenderer":{
        literal: {
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

