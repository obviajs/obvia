//Template literal for global App style
const appStyle = `
.ew-resize {cursor: ew-resize !important;}
.ns-resize {cursor: ns-resize !important;}
.selected-component {
    border: 1px black solid !important;
    border-right: 10px black solid !important;
    padding-bottom: 10px;
}
.default-component {
    border: 1px grey solid;
    border-right: 10px grey solid;
    padding-bottom: 10px;
}
.default-cnt{
    min-height:50px
}
.active-container{
    border: 1px dashed #3987d9 !important;
}
`;

var _DOMMutationHandler = function (e) {
    //Google translate will add font/font/text nodes to the translated label
    if (e.mutation.addedNodes.length > 0 && e.mutation.addedNodes[0].childNodes.length > 0 && e.mutation.addedNodes[0].childNodes[0].childNodes.length > 0) {
        this.label = e.mutation.addedNodes[0].childNodes[0].childNodes[0].data;
    }
};

var oxana = new App({
    style: appStyle
});


let formField = Builder.components["FormField"].literal;

var parents = ["Container", "Form"];
var noNeedFF = ["Button", "Label", "Container"];
var dpCmpSelect = [];

let mainContainer = {
    ctor: Container,
    props: {
        id: "MainContainer",
        type: ContainerType.NONE,
        components: [{
                ctor: Nav,
                props: {
                    id: "nav",
                    height: 40,
                    classes: ["nav"],
                    components: [{
                        ctor: Container,
                        props: {
                            id: "containerIcons",
                            type: ContainerType.ROW,
                            classes: ["col-sm-12"],
                            components: [{
                                    ctor: Container,
                                    props: {
                                        id: "toggleVisibilityLeftSideNav",
                                        classes: ["col-sm-3"],
                                        components: [{
                                            ctor: Label,
                                            props: {
                                                id: "toggleVisibilityButtonLeft",
                                                labelType: LabelType.i,
                                                classes: ["fas", "fa-bars", "navIcons"]
                                            }
                                        }]
                                    }
                                },
                                {
                                ctor: Container,
                                props: {
                                    id: "undoRedo",
                                    classes: ["col-sm-6"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "undoButton",
                                                labelType: LabelType.i,
                                                label: "",
                                                classes: ["fas", "fa-arrow-left", "navIcons"]
                                            }
                                        },
                                        {
                                            ctor: Label,
                                            props: {
                                                id: "redoButton",
                                                labelType: LabelType.i,
                                                label: "",
                                                classes: ["fas", "fa-arrow-right", "navIcons"]
                                            }
                                        },
                                        {
                                            ctor: Label,
                                            props: {
                                                id: "splitHorizontal",
                                                labelType: LabelType.i,
                                                label: "",
                                                classes: ["fas", "fa-columns fa-rotate-270", "navIcons"]
                                            }
                                        },
                                        {
                                            ctor: Label,
                                            props: {
                                                id: "splitVertical",
                                                labelType: LabelType.i,
                                                label: "",
                                                classes: ["fas", "fa-columns", "navIcons"]
                                            }
                                        },
                                        {
                                            ctor: Label,
                                            props: {
                                                id: "saveButtonLabel",
                                                labelType: LabelType.i,
                                                label: "",
                                                classes: ["fa", "fa-save", "navIcons"]
                                            }
                                        },
                                        {
                                            ctor: Label,
                                            props: {
                                                id: "loadIcon",
                                                labelType: LabelType.i,
                                                label: "",
                                                classes: ["fas", "fa-folder-open", "navIcons"]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                ctor: Container,
                                props: {
                                    id: "toggleVisibilityRightSideNav",
                                    classes: ["col-sm-3"],
                                    components: [{
                                        ctor: Label,
                                        props: {
                                            id: "toggleVisibilityButtonRight",
                                            labelType: LabelType.i,
                                            classes: ["fas", "fa-bars", "navIcons"]
                                        }

                                    }]
                                }
                            }
                        ]
                        }
                    }
                ]
                }
            },
            {
                ctor: Container,
                props: {
                    id: "SideNavRightContainer",
                    type: ContainerType.NONE,
                    classes: ["d-flex", "flex-shrink-0", "flex-nowrap"],
                    components: [{
                            ctor: SideNav,
                            props: {
                                id: "controlsWindow",
                                width: "350",
                                minWidth: "350", 
                                classes: ["sidenav", "sideNav_side_left"],
                                components: [{
                                    ctor: Container,
                                    props: {
                                        id: '',
                                        type: ContainerType.COLUMN,
                                        spacing: {
                                            colSpan: 12
                                        },
                                        components: [{
                                                ctor: TextInput,
                                                props: {
                                                    id: "input",
                                                    placeholder: "Search Components",
                                                    type: "text",
                                                    classes: ["form-control", "searchComponents"]
                                                }
                                            },
                                            {
                                                ctor: Container,
                                                props: {
                                                    spacing: {
                                                        h: 100
                                                    },
                                                    components: [{
                                                        ctor: Repeater,
                                                        props: {
                                                            id: "componentList",
                                                            dataProvider: Builder.componentList,
                                                            rendering: {
                                                                direction: 'horizontal'
                                                            },
                                                            components: [{
                                                                ctor: Container,
                                                                props: {
                                                                    id: 'component',
                                                                    spacing: {
                                                                        m: 0.999
                                                                    },
                                                                    label: "{label}",
                                                                    draggable: true,
                                                                    dragstart: function (e, ra) {
                                                                        console.log(arguments);
                                                                        e.originalEvent.dataTransfer.setData("domID", e.target.id);
                                                                        e.originalEvent.dataTransfer.setData("ctor", ra.currentItem.ctor);
                                                                    },
                                                                    classes: ["border", "comp_side"],
                                                                    width: 120,
                                                                    height: 80,
                                                                    type: ContainerType.NONE
                                                                }
                                                            }]
                                                        }
                                                    }]
                                                }
                                            }
                                        ]
                                    }
                                }]
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "WorkArea",
                                components: [{
                                    ctor: Container,
                                    props: {
                                        id: '',
                                        type: ContainerType.ROW,
                                        height: 628,
                                        components: [{
                                            ctor: Container,
                                            props: {
                                                type: ContainerType.COLUMN,
                                                spacing: {
                                                    colSpan: 12
                                                },
                                                id: "snowCrash",
                                                components: [{
                                                    ctor: Container,
                                                    props: {
                                                        spacing: {
                                                            h: 100
                                                        },
                                                        type: ContainerType.NONE,
                                                        components: [{
                                                            ctor: Container,
                                                            props: {
                                                                id: '',
                                                                type: ContainerType.ROW,
                                                                spacing: {
                                                                    h: 100
                                                                },
                                                                components: [{
                                                                    ctor: Container,
                                                                    props: {
                                                                        type: ContainerType.COLUMN,
                                                                        spacing: {
                                                                            colSpan: 12,
                                                                            h: 100
                                                                        },
                                                                        id: 'workArea',
                                                                        classes: ["border"]

                                                                    }
                                                                }]
                                                            }
                                                        }]
                                                    }
                                                }]
                                            }
                                        }]
                                    }
                                }]
                            }
                        },
                        {
                            ctor: SideNav,
                            props: {
                                id: "RightSideNav",
                                width: "300",
                                minWidth: "300",
                                classes: ["sidenav", "sidenav_right", "sideNav_side_right", "flex-shrink-0"],
                                components: [{
                                    ctor: Container,
                                    props: {
                                        id: "container",
                                        components: [{
                                                ctor: Label,
                                                props: {
                                                    id: "label",
                                                    label: "Form Properties",
                                                    classes: ["sideRight_label"]
                                                }
                                            },
                                            {
                                                ctor: HRule,
                                                props: {
                                                    id: "hr",
                                                    width: 600,
                                                    align: "center"
                                                }
                                            },
                                            {
                                                ctor: Container,
                                                props: {
                                                    id: "propertyEditorWindow",
                                                    classes: ["sideNav_left_container"],
                                                    components: [{
                                                            ctor: Label,
                                                            props: {
                                                                id: "label",
                                                                label: "Form Name *",
                                                                classes: ["formName"]
                                                            }
                                                        },
                                                        {
                                                            ctor: TextInput,
                                                            props: {
                                                                id: "textinput",
                                                                type: "text",
                                                                placeholder: "Form Name",
                                                                classes: ["form-control", "formName_input"]
                                                            }
                                                        },
                                                    ]
                                                }
                                            }
                                        ]

                                    }
                                },
                                {
                                    ctor: Container,
                                    props: {
                                        id: "deleteComponentId",
                                        spacing: {
                                            colSpan: 12,
                                            h: 10,
                                        },
                                        classes:["deleteTrash"],
                                        components: [{
                                            ctor: Label,
                                            props: {
                                                id: "deleteTrashIcon",
                                                classes: [""],
                                                labelType: LabelType.i,
                                                classes: ["fas", "fa-trash", "trash-icon"]
                                            }
                                        }] 
                                    }
                                }
                            ]
                            }
                        }
                    ]
                }
            }
        ]
    }
}

oxana.components = [{
    ctor: ViewStack,
    props: {
        components: [mainContainer]
    }
}];

var waBehaviors = {
    "click": "BECOME_ACTIVE",
    "mouseover": "WA_HOVER",
    "mouseout": "WA_HOVER",
    "mousemove": {
        "IS_WA_RESIZE_NS": isMouseMoveNS
    },
    "resize": "WA_RESIZE",
    "contextmenu": "WA_REMOVE",
    "drop": "ADD_COMPONENT",
    "dragover": "ALLOW_DROP",
};
var cntBehaviors = {
    "drop": "ADD_COMPONENT",
    "dragover": "ALLOW_DROP"
};
var cmpBehaviors = {
    "mousedown": {
        "SELECT_COMPONENT": isSelectComponent
    },
    "dragstart": "DRAGSTART_COMPONENT",
    "dropped": "SELECT_COMPONENT"
};

oxana.behaviors["deleteComponentId"] = {};
oxana.behaviors["deleteComponentId"]["mouseover"] = "DELETE_CMP";

oxana.behaviors["toggleVisibilityButtonLeft"] = {};
oxana.behaviors["toggleVisibilityButtonLeft"]["click"] = "TOGGLE_VISIBILITY_LEFT";

oxana.behaviors["toggleVisibilityButtonRight"] = {};
oxana.behaviors["toggleVisibilityButtonRight"]["click"] = "TOGGLE_VISIBILITY_RIGHT";

oxana.behaviors["splitHorizontal"] = {};
oxana.behaviors["splitHorizontal"]["click"] = "SPLIT_HOR";

oxana.behaviors["splitVertical"] = {};
oxana.behaviors["splitVertical"]["click"] = "SPLIT_VERT";

oxana.behaviors["saveLayout"] = {};
oxana.behaviors["saveLayout"]["click"] = "SAVE_LAYOUT";

oxana.behaviors["selectBtn"] = {};
oxana.behaviors["selectBtn"]["click"] = "FILE_SELECT_MODAL";

oxana.behaviors["previewBtn"] = {};
oxana.behaviors["previewBtn"]["click"] = "PREVIEW";

oxana.behaviors["browseFile"] = {};
oxana.behaviors["browseFile"]["change"] = "FILE_SELECTED";

oxana.behaviors["listHistorySteps"] = {};
oxana.behaviors["listHistorySteps"]["change"] = "HISTORY_STEP_DETAILS";

oxana.behaviors["workArea"] = waBehaviors;

oxana.behaviors[oxana.rootID]["keydown"] = {
    "WA_UNDO": isKeyCombUndo,
    "WA_REDO": isKeyCombRedo,
};
oxana.behaviorimplementations["ALLOW_DROP"] = function (e) {
    console.log("ALLOW_DROP ", this.domID);
    e.preventDefault();
}
oxana.behaviorimplementations["ADD_COMPONENT"] = {
    description: "Ndaje horizontalisht",
    do: function (e) {
        console.log('CREATED_');
        e.preventDefault();
        var workArea = Component.instances[Component.domID2ID[e.target.id]];
        var domID = e.originalEvent.dataTransfer.getData("domID");
        var ctor = e.originalEvent.dataTransfer.getData("ctor");
        var move = e.originalEvent.dataTransfer.getData("move");
        let inst;
        if (move == "") {
            console.log("ADD_COMPONENT_ " + domID);
            let lit = ObjectEditor.components[ctor].literal;
            if (workArea.ctor == "Form" && noNeedFF.indexOf(ctor) == -1) {
                var ff = extend(true, formField);
                ff.props.component = lit;
                lit = ff;
            }
            lit = extend(true, lit);
            lit.props.draggable = true;
            if (isObject(lit.props.classes))
                lit.props.classes["self"].push("selected-component");
            else {
                lit.props.classes = !Array.isArray(lit.props.classes) ? [] : lit.props.classes;
                lit.props.classes.push("selected-component");
            }
            //var hnd = extend(true, handle);
            //hnd.props.components = [lit];
            //var inst = workArea.addComponent(hnd);
            //  inst.width = inst.children[lit.props.id].$el.width() + 10;
            inst = workArea.addComponent(lit);
            addBehaviors(inst, cmpBehaviors, false);
            if (parents.indexOf(ctor) > -1) {
                addBehaviors(inst, cntBehaviors, false);
            }
        } else {
            console.log("MOVED_", domID, workArea.domID);
            var _id = Component.domID2ID[domID] ? Component.domID2ID[domID] : domID;
            var _idSurrogate = Component.surrogates[domID] && Component.domID2ID[Component.surrogates[domID]] ? Component.domID2ID[Component.surrogates[domID]] : null;
            _id = _idSurrogate ? _idSurrogate : _id;
            inst = Component.instances[_id];
            if (inst.parent && (inst.parent != workArea) && (domID != workArea.domID)) {
                inst.parent.removeChild(inst, 0);
                if (inst.ctor == "FormField" && workArea.ctor != "Form") {
                    inst = inst.children[inst.component.props.id];
                    inst.draggable = true;
                    addBehaviors(inst, cmpBehaviors, false);
                    var classes = inst.classes.slice(0);
                    classes.pushUnique("selected-component");
                    inst.classes = classes;
                } else if (workArea.ctor == "Form" && noNeedFF.indexOf(inst.ctor) == -1) {
                    removeBehaviors(inst, cmpBehaviors, false);
                    inst.toggle = false;
                    var classes = inst.classes.slice(0);
                    classes.toggle("default-component");
                    let ind = classes.indexOf("selected-component");
                    if (ind > -1)
                        classes.splice(ind, 1);
                    inst.classes = classes;
                    inst.draggable = false;
                    var ff = extend(true, formField);
                    ff.props.draggable = true;
                    ff.props.classes = !Array.isArray(ff.props.classes) ? [] : ff.props.classes;
                    ff.props.classes.push("selected-component");
                    let instF = workArea.addComponent(ff);
                    instF.addChild(inst);
                    inst = instF;
                    addBehaviors(inst, cmpBehaviors, false);
                }
                workArea.addChild(inst);
            }
        }
        var evt = new jQuery.Event("dropped");
        inst.trigger(evt);
    },
    undo: function () {},
    stopPropagation: true,
};
var activeComponent;

function isSelectComponent(e) {
    if (((e.which && e.which == 1) || (e.buttons && e.buttons == 1))) {
        return true;
    }
}
oxana.behaviorimplementations["SELECT_COMPONENT"] = {
    description: "Select Component",
    do: function (e) {
        console.log("SELECT_COMPONENT");
        //this will hold the instance of the component who manifested this behavior (the manifestor)
        if (activeComponent && activeComponent != this && ((isObject(activeComponent.classes) && activeComponent.classes["self"].indexOf("selected-component")) || activeComponent.classes.indexOf("selected-component") > -1)) {
            activeComponent.toggle = false;
            var classes = isObject(activeComponent.classes) ? activeComponent.classes["self"].slice(0) : activeComponent.classes.slice(0);
            let ind = classes.indexOf("selected-component");
            if (ind > -1)
                classes.splice(ind, 1);
            classes.pushUnique("default-component");
            if (isObject(activeComponent.classes))
                activeComponent.classes["self"] = classes;
            else
                activeComponent.classes = classes;
        }
        var classes = isObject(this.classes) ? this.classes["self"].slice(0) : this.classes.slice(0);
        classes.pushUnique("selected-component");
        if (isObject(this.classes))
            this.classes["self"] = classes;
        else
            this.classes = classes;
        activeComponent = this;
        let pew = Component.instances["propertyEditorWindow"];
        let oeLit = {
            ctor: ObjectEditor,
            "props": {
                id: "objectEditor",
                instance: this,
                field: "props"
            }
        };
        if (pew.window) {
            let objectEditor = Component.instances[pew.components["0"].props.id];
            objectEditor.instance = this;

        } else {
            pew.removeAllChildren();
            pew.components = [oeLit];
        }
        pew.show();

    },
    stopPropagation: true
}

oxana.behaviorimplementations["DRAGSTART_COMPONENT"] = {
    description: "Drag Component",
    do: function (e) {
        console.log("DRAGSTART_COMPONENT", this.domID);
        e.originalEvent.dataTransfer.setData("domID", this.domID);
        e.originalEvent.dataTransfer.setData("ctor", this.ctor);
        e.originalEvent.dataTransfer.setData("move", 1);
    }
}
oxana.behaviorimplementations["HISTORY_STEP_DETAILS"] = function (e) {
    console.log("called HISTORY_STEP_DETAILS.");
};
oxana.behaviorimplementations["FILE_SELECT_MODAL"] = function (e) {
    console.log("called FILE_SELECT_MODAL.");
    Component.instances["fileSelectModal"].show();
};
oxana.behaviorimplementations["FILE_SELECTED"] = function (e) {
    console.log("called FILE_SELECTED.");
    if (Component.instances["browseFile"].value.length > 0) {
        readFile(Component.instances["browseFile"].value[0]).then(function (resp) {
                Component.instances["fileSelectModal"].hide();
                var evt = new jQuery.Event("loadLayout");
                evt.content = resp.content;
                oxana.root.trigger(evt);
            })
            .catch(function (resp) {
                alert(resp.description);
            });
    }
};
oxana.behaviors[oxana.rootID]["loadLayout"] = "LOAD_LAYOUT";
oxana.behaviorimplementations["LOAD_LAYOUT"] = function (e) {
    var _cmp = JSON.parse(e.content);
    Component.instances["workArea"].removeAllChildren(0);
    if (_cmp.props.id == "workArea") {
        for (var i = 0; i < _cmp.props.components.length; i++) {
            var inst = Component.instances["workArea"].addComponent(_cmp.props.components[i]);
            addBehaviors(inst, waBehaviors);
        }
    } else {
        var inst = Component.instances["workArea"].addComponent(_cmp);
        addBehaviors(inst, waBehaviors);
    }

};

function addBehaviors(cmp, behaviors, recurse = true) {
    if (oxana.behaviors[cmp.id] == null)
        oxana.behaviors[cmp.id] = {};
    for (var b in behaviors) {
        oxana.behaviors[cmp.id][b] = behaviors[b];
    }
    if (recurse) {
        for (var cid in cmp.children) {
            addBehaviors(cmp.children[cid], behaviors);
        }
    }
}

function removeBehaviors(cmp, behaviors, recurse = true) {
    if (oxana.behaviors[cmp.id] != null)
        for (var b in behaviors) {
            delete oxana.behaviors[cmp.id][b];
        }
    if (recurse) {
        for (var cid in cmp.children) {
            removeBehaviors(cmp.children[cid], behaviors);
        }
    }
}
oxana.behaviorimplementations["HISTORY_STEP_ADDED"] = function (e) {
    console.log("called HISTORY_STEP_ADDED.", e.current);
    Component.instances["listHistorySteps"].value = e.current;

};
oxana.behaviorimplementations["HISTORY_UNDONE"] = function (e) {
    console.log("called HISTORY_UNDONE.");
    Component.instances["listHistorySteps"].value = e.previous;

};

oxana.behaviorimplementations["HISTORY_REDONE"] = function (e) {
    console.log("called HISTORY_REDONE.");
    Component.instances["listHistorySteps"].value = e.redone;
};

oxana.behaviorimplementations["DELETE_CMP"] = {
    do: function(e) {
        console.log('hello');
    }
}

oxana.behaviorimplementations["TOGGLE_VISIBILITY_LEFT"] = {
    do: function(e){
        var cmp = Component.instances["controlsWindow"];
        cmp.toggleVisibility();
    }
    
};

oxana.behaviorimplementations["TOGGLE_VISIBILITY_RIGHT"] = {
    do: function(e){
        var cmp = Component.instances["RightSideNav"];
        cmp.toggleVisibility();
    }
    
}

var activeContainer;
oxana.behaviorimplementations["SPLIT_HOR"] = {
    //description: "Split selected container horizontally",
    description: "Ndaje horizontalisht",
    do: function (e) {
        var retFromRedoMaybe = arguments[arguments.length - 1];
        if (retFromRedoMaybe.container) {
            activeContainer = retFromRedoMaybe.container;
            console.log("called SPLIT_HOR from History(REDO).");
        }
        console.log("Split Selected Container Horizontally");
        var ret = {
            track: false
        };
        var newRow = {
            ctor: Container,
            props: {
                id: '',
                type: ContainerType.ROW,
                spacing: {
                    h: 100,
                    m: "auto"
                },
                components: [{
                    ctor: Container,
                    props: {
                        type: ContainerType.COLUMN,
                        spacing: {
                            colSpan: 12,
                            h: 100
                        },
                        id: 'workArea',
                        classes: ["border"]
                    }
                }]
            }
        };
        var newRow2;
        if (activeContainer.components.length == 0) {
            newRow2 = extend(true, newRow);
        }
        var newRowInstance;
        if (retFromRedoMaybe.child) {
            newRowInstance = retFromRedoMaybe.child;
            activeContainer.addChild(newRowInstance);
        } else
            newRowInstance = activeContainer.addComponent(newRow);
        var newWorkArea = newRowInstance.children[newRowInstance.components[0].props.id];
        oxana.behaviors[newWorkArea.id] = waBehaviors;
        // oxana.behaviors[newWorkArea.id]["mousemove"]["WA_RESIZE_EW"] = isMouseMoveEW;
        //{filter: isMouseMoveEw, otherProperties...}

        if (activeContainer.components.length == 1) {
            var newRowInstance2;
            if (retFromRedoMaybe.child2) {
                newRowInstance2 = retFromRedoMaybe.child2;
                activeContainer.addChild(newRowInstance2);
            } else
                newRowInstance2 = activeContainer.addComponent(newRow2);

            var newWorkArea2 = newRowInstance2.children[newRowInstance2.components[0].props.id];
            oxana.behaviors[newWorkArea2.id] = waBehaviors;
            ret.child2 = newRowInstance2;
        }

        ret.child = newRowInstance;
        ret.parent = activeContainer;
        ret.container = activeContainer;
        ret.track = true;
        childrenAutoHeight(activeContainer);
        return ret;
    },
    undo: function () {
        console.log("Undo SPLIT_HOR ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /** 
         * what if every component generates its undo action for every action called on its instance
         */
        /**
         * ret.container = container;
                    ret.child = this.parent; */
        var ret = arguments[arguments.length - 1];
        ret.parent.removeChild(ret.child, 0);
        if (ret.child2) {
            ret.parent.removeChild(ret.child2, 0);
        }
        childrenAutoHeight(ret.parent);
    }
};

oxana.behaviorimplementations["SPLIT_VERT"] = {
    description: "Split selected container vertically",
    do: function (e) {
        var retFromRedoMaybe = arguments[arguments.length - 1];
        console.log(retFromRedoMaybe, "aaaaaaaaaaaaaaaa");
        if (retFromRedoMaybe.container) {
            activeContainer = retFromRedoMaybe.container;
            console.log("called SPLIT_VERT from History(REDO).");
        }
        console.log("Split Selected Container Vertically");
        var ret = {
            track: false
        };
        var newCell = {
            ctor: Container,
            props: {
                type: ContainerType.COLUMN,
                spacing: {
                    colSpan: 12,
                    h: 100
                },
                id: 'workArea',
                classes: ["border"]
            }
        };
        var toAdd = [newCell];
        var parent = activeContainer.parent;
        var children_len = parent.components.length;


        if (children_len < 12) {
            var newInstance;
            if (retFromRedoMaybe.child) {
                newInstance = retFromRedoMaybe.child;
                parent.addChild(newInstance);
            } else
                newInstance = parent.addComponents(toAdd);
            var row = activeContainer.parent;
            children_len = row.components.length;

            var colSpan = Math.floor(12 / children_len);
            var delta = 12 - colSpan * children_len;
            var i = 0;
            for (var childID in row.children) {
                ++i;
                if (i == children_len - 1)
                    row.children[childID].spacing.colSpan = colSpan + delta;
                else
                    row.children[childID].spacing.colSpan = colSpan;
                var workArea = row.children[childID];
                //var workArea = cell.children[cell.components[0].props.id];
                oxana.behaviors[workArea.id] = waBehaviors;
            }
            ret.parent = parent;
            ret.child = newInstance;
            ret.container = activeContainer.parent;
            ret.track = true;
        } else {
            alert("You may have up to 12 columns for each row.");
        }
        return ret;
    },
    undo: function () {
        console.log("Undo SPLIT_VERT ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /** 
         * what if every component generates its undo action for every action called on its instance
         */
        /**
         * ret.container = container;
                    ret.child = this.parent; */
        var ret = arguments[arguments.length - 1];
        ret.parent.removeChild(ret.child, 0);
        childrenAutoWidth(ret.parent);
    }
};


oxana.behaviorimplementations["BECOME_ACTIVE"] = {
    do: function (e) {
        console.log("Container Became active");
        //this will holde the instance of the component who manifested this behavior (the manifestor)
        if (activeContainer && activeContainer != this && activeContainer.classes.indexOf("active-container") > -1) {
            activeContainer.toggle = false;
            var classes = activeContainer.classes.slice(0);
            classes.toggle("active-container");
            activeContainer.classes = classes;
        }
        this.toggle = false;
        var classes = this.classes.slice(0);
        classes.pushUnique("active-container");
        this.classes = classes;
        activeContainer = this;
    },
    stopPropagation: true
};

oxana.behaviorimplementations["WA_HOVER"] = {
    do: function (e) {
        console.log("Container hovered " + this.id);
        //this will hold the instance of the component who manifested this behavior (the manifestor)
        this.toggle = false;
        var classes = this.classes.slice(0);
        classes.toggle("hovered");
        this.classes = classes;
    },
    stopPropagation: true
};

oxana.behaviorimplementations["IS_WA_RESIZE_NS"] = {
    do: function (e) {
        console.log("Container Resize NS");

    },
    stopPropagation: true
};
oxana.behaviorimplementations["WA_RESIZE"] = {
    do: function (e) {
        var retFromRedoMaybe = arguments[arguments.length - 1];
        if (retFromRedoMaybe.container) {
            console.log("called WA_RESIZE from History(REDO).");
        } else
            console.log("WA_RESIZE");
        var ret = {
            track: false
        };

        var manifestor = this,
            dy = e.dy,
            dx = e.dx;
        containerResize(manifestor, dx, dy);
        ret.description = "Container resize" + (dx ? " dx:" + dx : "") + (dy ? " dy:" + dy : "");
        ret.track = true;
        return ret;
    },
    undo: function (e) {
        console.log("Undo WA_RESIZE ", arguments);
        var manifestor = this,
            dy = e.dy,
            dx = e.dx;
        containerResize(manifestor, -1 * dx, -1 * dy);
    },
    stopPropagation: true
};
oxana.behaviorimplementations["WA_REMOVE"] = {
    description: "Container Removed",
    do: function (e) {
        var retFromRedoMaybe = arguments[arguments.length - 1];
        if (retFromRedoMaybe.container) {
            console.log("called WA_REMOVE from History(REDO).");
        }
        var ret = {
            track: false
        };
        console.log("Container REMOVE ", arguments);
        var c = true;
        if (this.components.length > 0) {
            c = confirm("Container has children, still want to remove ?");
        }
        if (c) {
            if (this.parent.parent.components.length == 1) {
                if (this.parent.components.length > 2) {
                    var row = this.parent;
                    row.removeChild(this);
                    childrenAutoWidth(row);
                    ret.track = true;
                    ret.container = row;
                    ret.child = this;
                    ret.removeType = "COLUMN";
                } else {

                }
                console.log("column ", this.parent.components.length);
                //this.parent.components
            } else {
                if (this.parent.parent.components.length > 2) {
                    var container = this.parent.parent;
                    container.removeChild(this.parent, 0);
                    childrenAutoHeight(container);
                    ret.track = true;
                    ret.container = container;
                    ret.child = this.parent;
                    ret.removeType = "ROW";
                } else {

                }
                console.log("row ", this.parent.parent.components.length);
            }

        }
        e.preventDefault();
        return ret;
    },
    undo: function () {
        console.log("Undo WA_REMOVE ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /** 
         * what if every component generates its undo action for every action called on its instance
         */
        /**
         * ret.container = container;
                   ret.child = this.parent; */
        var ret = arguments[arguments.length - 1];
        ret.container.addChild(ret.child);
        if (ret.removeType == "COLUMN") {
            childrenAutoWidth(ret.container);
        } else {
            childrenAutoHeight(ret.container);
        }
    },
    stopPropagation: true
};

oxana.behaviorimplementations["PREVIEW"] = {
    do: function (e) {
        var workArea = Component.instances["snowCrash"];
        var lit = workArea.literal;
        stripHandle(lit)
        var jsonLayout = JSON.stringify(lit, null, "\t");
        download("snowCrash.json.txt", jsonLayout);
    },
    stopPropagation: true
};

oxana.behaviorimplementations["SAVE_LAYOUT"] = {
    do: function (e) {
        var workArea = Component.instances["snowCrash"];
        var lit = workArea.literal;
        stripHandle(lit)
        var jsonLayout = JSON.stringify(lit, null, "\t");
        download("snowCrash.json.txt", jsonLayout);
    },
    stopPropagation: true
};

oxana.behaviorimplementations["WA_UNDO"] = {
    do: function (e) {
        console.log("UNDO");
        oxana.history.undo();
    },
    stopPropagation: false
};
oxana.behaviorimplementations["WA_REDO"] = {
    do: function (e) {
        console.log("REDO");
        oxana.history.redo();
    },
    stopPropagation: false
};

oxana.behaviorimplementations["APP_LOADED"] = new ArrayEx(oxana.behaviorimplementations["APP_LOADED"], function (e) {
    Component.instances["controlsWindow"].show();
});
oxana.eventTypes.splicea(oxana.eventTypes.length, 0, ["resize", "dropped"])
oxana.registerBehaviors();
oxana.init();


//filter to determine if mousemove is an "WA_RESIZE_NS" behavior
var debouncedDragNS;
var d0;

function isMouseMoveNS(e) {
    if (((e.which && e.which == 1) || (e.buttons && e.buttons == 1)) && (this.parent.parent.components.length >= 2 || this.parent.components.length >= 2)) {
        var manifestor = this;
        var classes = manifestor.classes.slice(0);
        classes = classes.difference(["ns-resize", "ew-resize"]);

        if (d0 && !debouncedDragNS) {
            if (Math.abs(d0.y - e.pageY) > Math.abs(d0.x - e.pageX)) {
                classes.pushUnique("ns-resize");
            } else {
                classes.pushUnique("ew-resize");
            }
            manifestor.classes = classes;
        }
        d0 = {
            x: e.pageX,
            y: e.pageY
        };

        if (!debouncedDragNS) {
            var p0 = {
                x: e.pageX,
                y: e.pageY
            };
            console.log("prior of debounced");
            console.log(p0);
            debouncedDragNS = debounce(function (evt) {
                console.log("debounced");
                var p1 = {
                    x: evt.pageX,
                    y: evt.pageY
                };
                console.log(p0);
                console.log(p1);
                var dy = p1.y - p0.y;
                var dx = p1.x - p0.x;
                var evt = new jQuery.Event("resize");
                if (dy != 0 && manifestor.parent.parent.components.length >= 2) {
                    dy = -dy;
                    evt.dy = dy;
                }
                if (dx != 0 && manifestor.parent.components.length >= 2) {
                    dx = -dx;
                    evt.dx = dx;
                }
                if (dx != 0 || dy != 0)
                    manifestor.trigger(evt);
                console.log("Vertical drag of :", dy, manifestor.$el.height());

                debouncedDragNS = null;

                var classes = manifestor.classes.slice(0);
                classes = classes.difference(["ns-resize", "ew-resize"]);
                //classes.splice(i, 1);
                manifestor.classes = classes;
            }, 500);
        }
        debouncedDragNS(e);
        return true;
        //{qualifies, extraArgs}
        // extraArgs array with additional arguments to be passed to the behavior implementation/do
    } else {
        // var i = this.classes.indexOf("ns-resize")
        // if(i>0){
        var classes = this.classes.slice(0);
        classes = classes.difference(["ns-resize", "ew-resize"]);
        //classes.splice(i, 1);
        this.classes = classes;
        //}

    }
}

//behavior can cause another behavior (throws custom event, so we may avoid filter functions...)

function isKeyCombUndo(e) {
    if ((e.keyCode == 90 || e.keyCode == 122) && ((Env.getInstance().current == EnvType.MAC && e.metaKey && !e.shiftKey) || e.ctrlKey)) {
        console.log("KeyCombination CTR+Z Here");
        e.preventDefault();
        e.stopPropagation();
        return true;
    }
}

function isKeyCombRedo(e) {
    if (((e.keyCode == 89 || e.keyCode == 121) && e.ctrlKey) || ((Env.getInstance().current == EnvType.MAC && e.metaKey && e.shiftKey) && (e.keyCode == 90 || e.keyCode == 122))) {
        console.log("KeyCombination CTR+Y Here");
        e.preventDefault();
        e.stopPropagation();
        return true;
    }
}

//utility functions
function childrenAutoWidth(container) {
    var children_len = container.components.length;
    var colSpan = Math.floor(12 / children_len);
    var delta = 12 - colSpan * children_len;
    var i = 0;
    for (var childID in container.children) {
        ++i;
        if (i == children_len - 1)
            container.children[childID].spacing.colSpan = colSpan + delta;
        else
            container.children[childID].spacing.colSpan = colSpan;
    }
}

function childrenAutoHeight(container) {
    var children_len = container.components.length;
    var height = Math.floor(100 / children_len);
    var delta = 100 - height * children_len;
    var i = 0;
    for (var childID in container.children) {
        ++i;
        if (i == children_len - 1)
            container.children[childID].spacing.h = height + delta;
        else
            container.children[childID].spacing.h = height;
    }
}

function containerResize(container, dx, dy) {
    if (dy && !isNaN(dy) && dy != 0 && container.parent.parent.components.length >= 2) {
        var mpi = indexOfObject(container.parent.parent.components, "props.id", container.parent.id);
        if (mpi == container.parent.parent.components.length - 1) {
            dy = -dy;
            --mpi;
        } else
            ++mpi;

        var ha = container.parent.parent.$el.height();
        var s = dy / Math.abs(dy);
        var ha_rel = Math.floor(Math.abs(dy * 100 / ha)) * s;
        container.parent.spacing.h = container.parent.spacing.h - ha_rel;

        var sibling_id = container.parent.parent.components[mpi].props.id;
        container.parent.parent.children[sibling_id].spacing.h += ha_rel;
    }
    if (dx && !isNaN(dx) && dx != 0 && container.parent.components.length >= 2) {
        var mpi = indexOfObject(container.parent.components, "props.id", container.id);
        if (mpi == container.parent.components.length - 1) {
            dx = -dx;
            --mpi;
        } else
            ++mpi;

        var wa = container.parent.$el.width();
        var s = dx / Math.abs(dx);
        var wa_rel = Math.floor(Math.abs(dx * 12 / wa)) * s;
        container.spacing.colSpan = container.spacing.colSpan - wa_rel;

        var sibling_id = container.parent.components[mpi].props.id;
        container.parent.children[sibling_id].spacing.colSpan += wa_rel;
    }
}

function stripHandle(lit) {
    if (lit.props["components"] && Array.isArray(lit.props["components"]))
        for (var i = 0; i < lit.props.components.length; i++) {
            if (lit.props.components[i].props["attr"] && lit.props.components[i].props.attr["handle"]) {
                lit.props.components[i] = lit.props.components[i].props.components[0];
            }
            if (lit.props.components[i].props["components"] && Array.isArray(lit.props.components[i].props["components"]))
                stripHandle(lit.props.components[i]);
        }
}