Builder.metaProps = {
    form_name: {ctor:"TextInput", label: "Form Name", required:true, index:1, props :{
        change: function(){
            this.parent.parent.instance.form_name = this.value;
        }
    }},
    description: {ctor:"TextArea", label: "Form Description", required:false, index:1, props :{
        change: function(){
            this.parent.parent.instance.description = this.value;
        }
    }},
    date_created: {ctor:"Label", label: "Date Created", required:false, index:1, props :{
    }},
    author: {ctor:"Label", label: "Author", required:false, index:1, props :{
    }},
    id: {ctor:"TextInput", label: "Component ID", required:true, index:1, props :{
        change: function(){
            this.parent.parent.instance.id = this.value;
        }
    }},
    name: {ctor:"TextInput", label: "Component Name", required:true, index:2},
    label: {ctor:"TextInput", label: "Label", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.label = this.value;
        }
    }},
    href: {ctor:"TextInput", label: "URL", required:true, index:3, props :{
        change: function(){
            this.parent.parent.instance.href = this.value;
        }
    }},
    target: {ctor:"Select", label:"Target", index:3, props:{
        dataProvider:new ArrayEx(getMembersCollection(LinkTarget, "text", "value")),
        change: function(){
            this.parent.parent.instance.target = this.value;
        }
    }},
    width: {ctor:"TextInput", label: "Width", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.width = this.value;
        }
    }},
    height: {ctor:"TextInput", label: "Height", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.height = this.value;
        }
    }},
    visible: {ctor:"Toggle", label: "Visible", index:4},
    enabled: {ctor:"Toggle", label: "Enabled", index:5}, 
    required: {ctor:"Toggle", label: "Required", index:6},
    checked: {ctor:"Toggle", label: "Checked", index:7},
    dataProvider: {ctor:"AutoBrowse", label: "Data Provider", required:true, props:{
        valueField: Builder.providerValueField,
        labelField: Builder.providerLabelField,
        dataProvider: Builder.sources,
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
    inputFormat: {ctor:"Select", label: "Input Format", required:true, props:{
        dataProvider:new ArrayEx(getMembersCollection(DateTimeFormat, "text", "value")),
        change: function(){
            this.parent.parent.instance.inputFormat = this.value;
        }
    }, index:12},
    outputFormat: {ctor:"Select", label: "Output Format", required:true, props:{
        dataProvider:new ArrayEx(getMembersCollection(DateTimeFormat, "text", "value")),
        change: function(){
            this.parent.parent.instance.outputFormat = this.value;
        }
    }, index:13},
    displayFormat: {ctor:"Select", label: "Display Format", required:true, props:{
        dataProvider:new ArrayEx(getMembersCollection(DateTimeFormat, "text", "value")),
        change: function(){
            this.parent.parent.instance.displayFormat = this.value;
        }
    }, index:14},
    multiple: {ctor:"Toggle", label: "Multiple Files", index:15},
    accept:{ctor:"Toggle", label: "Allowed Files", index:16},
    spacing:{ctor:"SpacingEditor", label: "Adjust Spacing", index:17, props: {
        change: function(){
            let _spacing = this.value; 
            this.parent.parent.instance.spacing.colSpan = _spacing.colSpan;
            this.parent.parent.instance.spacing.offset = _spacing.offset;
            this.parent.parent.instance.spacing.mb = _spacing.mb;
            this.parent.parent.instance.spacing.mt = _spacing.mt;
        }
    }},
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
    input: {
        ctor: "ObjectEditor", label: "Input Properties", index: 7, props: function (oeInst) {
            /**
             * this is not really necessary, just to demonstrate that props can be a function as well
             * this - is the isntance of the object being inspected, oeInst (the first and only param)
             * is the isntance of the ObjectEditor created for inspecting the object being inspected
             */
            let _props = {};
            _props.instance = this.input;
            return _props;
    }},
    rendering:{ctor:"ObjectEditor", label: "Rendering", required:false},
    direction:{ctor:"Select", label:"Direction", props:{
        dataProvider:new ArrayEx([{value:"vertical", text:"Vertical"}, {value:"horizontal", text:"Horizontal"}]),
        change: function(){
            this.parent.parent.instance.direction = this.value;
        }
    }},
    align:{ctor:"Select", label:"Align", props:{
        dataProvider:new ArrayEx(getMembersCollection(Align, "text", "value")),
        change: function(){
            this.parent.parent.instance.align = this.value;
        }
    }},
    headingType:{ctor:"Select", label:"Heading Type", props:{
        dataProvider:new ArrayEx(getMembersCollection(HeadingType, "text", "value")),
        change:function(){
            this.parent.parent.instance.headingType = this.value;           
        }
    }},
    side:{ctor:"Select", label:"Side", props:{
        dataProvider:new ArrayEx(getMembersCollection(SideNavSide, "text", "value")),
        change:function(){
            this.parent.parent.instance.side = this.value;           
        }
    }},
    separator:{ctor:"Toggle", label: "Separator"},
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
                    dataProvider: Builder.componentList,
                    fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}]        
                }
            },
            events:[{
                event:"browse", handler: function(e, oe, itemEditorLit, targetLit){
                    if(this.value && this.value.length>0){
                        e.preventDefault();
                        let wl = extend(true, targetLit);
                        itemEditorLit.props.instance = extend(true, Builder.components[this.value[0][ObjectEditor.componentValueField]].literal);
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
                    dataProvider: Builder.componentList,
                    fields:[{"field":ObjectEditor.componentValueField, "description":ObjectEditor.componentValueField, "visible":false}, {"field":ObjectEditor.componentLabelField, "description":ObjectEditor.componentLabelField}]        
                }
            },
            events:[{
                event:"browse", handler: function(e, oe, itemEditorLit, targetLit){
                    if(this.value && this.value.length>0){
                        e.preventDefault();
                        let wl = extend(true, targetLit);
                        itemEditorLit.props.instance = extend(true, Builder.components[this.value[0][ObjectEditor.componentValueField]].literal);
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

Builder.metaProps.Repeater = {
    components: {
        ctor: "AutoBrowse", label: "Repeated Form", required: true, props: {
            valueField: "form_id",
            labelField: "form_name",
            dataProvider: ObjectEditor.data.forms,
            fields: [{ "field": "form_id", "description": "form_id", "visible": false }, { "field": "form_name", "description": "form_name" }],
            change: function () {
                //propsForm.children["dataProvider"].value
                //get the fields for the selected datProvider and 
                //assign them to the labelField and valueField editor`s dataProvider property
                this.parent.parent.instance.attr.repeated_id_form = this.value.length > 0 ? this.value[0][this.valueField] : undefined;
            }
        }, index: 7
    },
    rendering: {
        ctor: "ObjectEditor", label: "Rendering", required: false, props: {
        }
    }
    
};
Builder.metaProps.DataGridColumn = {
    name: { ctor: "TextInput", label: "Column Name", required: true, index: 1 }
};
Builder.metaProps.TextInput = {
    type: {
        ctor: "Select", label: "Input Type", props: {
            dataProvider: new ArrayEx(getMembersCollection(TextInputType, "text", "value")),
            change: function () {
                this.parent.parent.instance.type = this.value;
            }
        }
    },
    value: {
        ctor: "TextInput", label: "Text", required: true, index: 3, props: {
            change: function () {
                this.parent.parent.instance.value = this.value;
            }
        }
    },
    autocomplete: {
        ctor: "Select", label: "Autocomplete", props: {
            dataProvider: new ArrayEx([{ "value": "off", "text": "Off" }, { "value": "on", "text": "On" }]),
            change: function () {
                this.parent.parent.instance.autocomplete = this.value;
            }
        }
    },
    placeholder: {
        ctor: "TextInput", label: "Placeholder", index: 3, required: false, props: {
            change: function () {
                this.parent.parent.instance.placeholder = this.value;
            }
        }
    }
};

Builder.metaProps.Label = {
    labelType: {ctor: "Select", label: "Label Type", props: {
        dataProvider: new ArrayEx(getMembersCollection(LabelType, "value", "text")),
        change: function(){
            this.parent.parent.instance.labelType = this.value;
        }
    }}
};

Builder.metaProps.Button = {
    type: {
        ctor: "Select", label: "Button Type", props: {
            dataProvider: new ArrayEx(getMembersCollection(ButtonType, "value", "text")),
            change: function () {
                this.parent.parent.instance.type = this.value;
            }
        }
    },
    label: {
        ctor: "TextInput", label: "Value", props: {
            change: function () {
                this.parent.parent.instance.label = this.value;
            }
        }
    }
};

Builder.metaProps.TextArea = {
    value: {
        ctor: "TextInput", label: "Value", props: {
            change: function () {
                this.parent.parent.instance.value = this.value;
            }
        }
    },
    spellCheck: {
        ctor: "Select", label: "Spell Check", props: {
            dataProvider: new ArrayEx([{ "value": "false", "text": "False" }, { "value": "true", "text": "True" }]),
            change: function () {
                this.parent.parent.instance.spellCheck = this.value;
            }
        }
    },
    placeholder: {
        ctor: "TextInput", label: "Placeholder", props: {
            change: function () {
                this.parent.parent.instance.placeholder = this.value;
            }
        }
    }
};

Builder.metaProps.DateTime = {
    value: {
        ctor: "TextInput", label: "Value", props: {
            change: function () {
                this.parent.parent.instance.value = this.value;
            }
        }
    }
};

Builder.metaProps.Image = {
    alt: {ctor: "TextInput", label: "Alt", required:false, props: {
        change: function(){
            this.parent.parent.instance.alt = this.value;
        }
    }},
    src: {ctor: "TextInput", label: "Src", required:true, index: 3, props: {
        change: function(){
            this.parent.parent.instance.src = this.value;
        }
    }}
};

Builder.metaProps.CheckBox = {
    value: {ctor: "TextInput", label: "Value", required:false, prop: {
        change: function(){
            this.parent.parent.instance.value = this.value;
        }
    }}
};

Builder.metaProps.SideNav = {
    width: {ctor:"TextInput", label: "Width", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.width = this.value;
            this.parent.parent.instance.minWidth = this.value;
        }
    }},
};

Builder.metaProps.viewStack = {
    width: {ctor:"TextInput", label: "Width", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.width = this.value;
        }
    }},
    height: {ctor:"TextInput", label: "Height", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.height = this.value;
        }
    }},
};

Builder.metaProps.DateTimeCb = {
    value: {ctor:"TextInput", label: "Value", required:true, index:3, props: {
        change: function(){
            this.parent.parent.instance.value = this.value;
        }
    }},
    mode: {ctor:"Select", label: "Display Mode", props: {
        //dataProvider: new ArrayEx([{value: "date", text: "Date"}, {value: "time", text: "Time"},{value: "datetime", text: "Datetime"}]),
        dataProvider: new ArrayEx(getMembersCollection(DateTimeMode, "text", "value")),
        change: function(){
            this.parent.parent.instance.mode = this.value;
        }
    }}
};

Builder.metaProps.Form = {
    method: {ctor: "Select", label: "Method", props: {
        dataProvider: new ArrayEx([{"value":"GET", "text":"GET"}, {"value":"POST", "text":"POST"}]),
        change: function(){
            this.parent.parent.instance.method = this.value;
        }
    }},
    action: {ctor: "TextInput", label: "Action", props: {
        change: function() {
            this.parent.parent.instance.action = this.value;
        }
    }}
};

Builder.metaProps.Container = {
    type: {
        ctor: "Select", label: "Type", props: {
            dataProvider: new ArrayEx(getMembersCollection(ContainerType, "text", "value")),
            change: function () {
                this.parent.parent.instance.type = this.value;
            }
        }
    },
    role: {
        ctor: "TextInput", label: "Role", props: {
            change: function () {
                this.parent.parent.instance.role = this.value;
            }
        }
    }
};


