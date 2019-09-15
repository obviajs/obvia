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
        props = inst[fld];
        let rows = [];
        _self.removeAllChildren();
        for(let prop in props){
            if(ObjectEditor.metaProps[prop]){
                let propEditor = ObjectEditor.propEditors[ObjectEditor.metaProps[prop].constructor];
                if(propEditor){
                    var itemEditorLit = propEditor.itemEditor;
                    if(ObjectEditor.metaProps[prop].props)
                        itemEditorLit.props = extend(false, false, itemEditorLit.props, ObjectEditor.metaProps[prop].props);
                    
                    itemEditorLit.props.bindingDefaultContext = inst;
                    itemEditorLit.props[(propEditor.valueField || "value")] = "{"+prop+"}";
                    let ff = extend(true, formField);
                    ff.props.label = ObjectEditor.metaProps[prop].label;
                    ff.props.placeholder = ObjectEditor.metaProps[prop].label;
                    ff.props.required = ObjectEditor.metaProps[prop].required;
                    ff.props.component = itemEditorLit;
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

ObjectEditor.metaProps = {
    id: {constructor:"TextInput", label: "Component ID", required:true, index:1},
    name: {constructor:"TextInput", label: "Component Name", required:true, index:2},
    label: {constructor:"TextInput", label: "Label", required:true, index:3},
    visible: {constructor:"Toggle", label: "Visible", index:4},
    enabled: {constructor:"Toggle", label: "Enabled", index:5}, 
    required: {constructor:"Toggle", label: "Required", index:6},
    checked: {constructor:"Toggle", label: "Checked", index:7},
    dataProvider: {constructor:"AutoBrowse", label: "Data Provider", required:true, props:{
        valueField: ObjectEditor.providerValueField,
        labelField: ObjectEditor.providerLabelField,
        dataProvider: ObjectEditor.remoteSources,
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
        }
    }, index:8},
    labelField: {constructor:"AutoCompleteEx", label: "Label Field", required:true, props:{
        valueField: "prop",
        labelField: "description"
    }, index:9},
    valueField: {constructor:"AutoCompleteEx", label: "Value Field", required:true, props:{
        valueField: "prop",
        labelField: "description"
    }, index:10},
    mask: {constructor:"AutoCompleteEx", label: "Data Provider", required:true, props:{
        valueField: ObjectEditor.maskValueField,
        labelField: ObjectEditor.maskLabelField,
        dataProvider: ObjectEditor.masks
    }, index:11},
    inputFormat: {constructor:"TextInput", label: "Input Format", required:true, props:{
        value:'DD/MM/YYYY'
    }, index:12},
    outputFormat: {constructor:"TextInput", label: "Output Format", required:true, props:{
        value:'DD-MM-YYYY'
    }, index:13},
    displayFormat: {constructor:"TextInput", label: "Display Format", required:true, props:{
        value:'DD/MM/YYYY'
    }, index:14},
    multiple: {constructor:"Toggle", label: "Multiple Files", index:15},
    accept:{constructor:"Toggle", label: "Allowed Files", index:16},
    spacing:{constructor:"SpacingEditor", label: "Adjust Spacing", index:17}
};

ObjectEditor.formField = {
    constructor: FormField,
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
            "constructor": TextInput,
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
            "constructor": Toggle,
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
            "constructor": Toggle,
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
            "constructor": AutoBrowse,
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
            "constructor": SpacingEditor,
            "props":{
            }
        },
        valueField:null
    }
};