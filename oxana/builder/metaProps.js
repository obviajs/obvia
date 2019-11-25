Builder.metaProps = {
    id: {ctor:"TextInput", label: "Component ID", required:true, index:1},
    name: {ctor:"TextInput", label: "Component Name", required:true, index:2},
    label: {ctor:"TextInput", label: "Label", required:true, index:3},
    href: {ctor:"TextInput", label: "URL", required:true, index:3},
    target: {ctor:"Select", label:"Target", props:{
        dataProvider:new ArrayEx(getMembersCollection(LinkTarget, "text", "value"))
    }, index:3},
    width: {ctor:"TextInput", label: "Width", required:true, index:3},
    height: {ctor:"TextInput", label: "Height", required:true, index:3},
    visible: {ctor:"Toggle", label: "Visible", index:4},
    enabled: {ctor:"Toggle", label: "Enabled", index:5}, 
    required: {ctor:"Toggle", label: "Required", index:6},
    checked: {ctor:"Toggle", label: "Checked", index:7},
    dataProvider: {ctor:"AutoBrowse", label: "Data Provider", required:true, props:{
        valueField: ObjectEditor.providerValueField,
        labelField: ObjectEditor.providerLabelField,
        dataProvider: ObjectEditor.sources,
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
    rendering:{ctor:"ObjectEditor", label: "Rendering", required:false},
    direction:{ctor:"Select", label:"Direction", props:{
        dataProvider:new ArrayEx([{value:"vertical", text:"Vertical"}, {value:"horizontal", text:"Horizontal"}])
    }},
    align:{ctor:"Select", label:"Align", props:{
        dataProvider:new ArrayEx(getMembersCollection(Align, "text", "value"))
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

Builder.metaProps.Repeater = {
    components:{ctor:"AutoBrowse", label: "Repeated Form", required:true, props:{
        valueField: "form_id",
        labelField: "form_name",
        dataProvider: ObjectEditor.data.forms,
        fields:[{"field":"form_id", "description":"form_id", "visible":false}, {"field":"form_name", "description":"form_name"}],   
        change: function(){
            //propsForm.children["dataProvider"].value
            //get the fields for the selected datProvider and 
            //assign them to the labelField and valueField editor`s dataProvider property
            this.parent.parent.instance.attr.repeated_id_form = this.value.length>0?this.value[0][this.valueField]:undefined; 
        }
    }, index:7}
}
Builder.metaProps.DataGridColumn = {
    name: {ctor:"TextInput", label: "Column Name", required:true, index:1}
}