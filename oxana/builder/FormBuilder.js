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

Builder.initComponentList();

var _cmpList = new ArrayEx(Builder.componentList);

var _DOMMutationHandler = function (e) {
    //Google translate will add font/font/text nodes to the translated label
    if (e.mutation.addedNodes.length > 0 && e.mutation.addedNodes[0].childNodes.length > 0 && e.mutation.addedNodes[0].childNodes[0].childNodes.length > 0) {
        this.label = e.mutation.addedNodes[0].childNodes[0].childNodes[0].data;
    }
};

var oxana = new App({
    style: appStyle
});

let selectedForm = new FormProperties();
let formField;

var noNeedFF = ["Button", "Label", "Container", "Link", "Header", "Footer", "Form", "SideNav", "ViewStack", "Calendar", "Tree", "Image", "HRule", "Heading", "Repeater", "RepeaterEx"];
var dpCmpSelect = [];

var mainContainer = {
    ctor: Container,
    props: {
        id: "MainContainer",
        type: ContainerType.NONE,
        props: {
            height: "100%",
        },
        components: [{
            ctor: Container,
            props: {
                id: "dragImage",
                css: {
                    position: "absolute",
                    top: "-1000px",
                    width: "50px",
                    height: "50px"
                },
                type: ContainerType.NONE,
                label: "Dragging"
            }
        },
        {
            ctor: Nav,
            props: {
                id: "nav",
                height: 48,
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
                                spacing: {
                                    colSpan: 1
                                },
                                css: {
                                    marginLeft: "250px"
                                },
                                type: ContainerType.NONE,
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: "toggleVisibilityButtonLeft",
                                        labelType: LabelType.i,
                                        classes: ["fas", "fa-bars", "navIcons"],
                                        css: {
                                            float: "right",
                                            marginTop: "15px"
                                        }
                                    }
                                }]
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "undoRedo",
                                classes: ["col-sm-6"],
                                css: {
                                    marginLeft: "0",
                                    marginRight: "0"
                                },
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: "undoButton",
                                        labelType: LabelType.i,
                                        label: "",
                                        classes: ["fas", "fa-arrow-left", "navIcons"],
                                    }
                                },
                                {
                                    ctor: DropDown,
                                    props: {
                                        id: "listHistorySteps",
                                        classes: ["fas", "fas-sort-down", "btn-default", "navIcons"],
                                        labelField: "description",
                                        dataProvider: oxana.history.steps
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
                                        id: "saveLayout",
                                        labelType: LabelType.i,
                                        label: "",
                                        classes: ["fa", "fa-save", "navIcons"]
                                    }
                                },
                                {
                                    ctor: Label,
                                    props: {
                                        id: "selectBtn",
                                        labelType: LabelType.i,
                                        label: "",
                                        classes: ["fas", "fa-folder-open", "navIcons"]
                                    }
                                },
                                {
                                    ctor: Label,
                                    props: {
                                        id: "uploadIcon",
                                        labelType: LabelType.i,
                                        label: "",
                                        classes: ["fas", "fa-cloud-upload-alt", "navIcons"]
                                    }
                                }
                                ]
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "toggleVisibilityRightSideNav",
                                spacing: {
                                    colSpan: 1
                                },
                                css: {
                                    marginRight: "100px"
                                },
                                type: ContainerType.NONE,
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: "toggleVisibilityButtonRight",
                                        labelType: LabelType.i,
                                        classes: ["fas", "fa-bars", "navIcons"],
                                        css: {
                                            marginTop: "15px",
                                            float: "left",
                                            padding: "0"
                                        }
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
                                id: 'container',
                                type: ContainerType.COLUMN,
                                spacing: {
                                    colSpan: 12
                                },
                                css: {
                                    paddingRight: "8px"
                                },
                                "components": [{
                                    ctor: Container,
                                    props: {
                                        id: "container",
                                        type: ContainerType.NONE,
                                        classes: ["inner-addon right-addon"],
                                        components: [{
                                            ctor: TextInput,
                                            props: {
                                                id: "SearchComponents",
                                                type: "text",
                                                placeholder: "Search Components",
                                                classes: [
                                                    "search-term"
                                                ]
                                            }
                                        },
                                        {
                                            ctor: "Button",
                                            props: {
                                                id: "button",
                                                type: "button",
                                                label: "",
                                                classes: [
                                                    "btn"
                                                ],
                                                components: [{
                                                    ctor: Label,
                                                    props: {
                                                        id: "i",
                                                        label: "",
                                                        type: LabelType.i,
                                                        classes: [
                                                            "fa",
                                                            "fa-search"
                                                        ],
                                                        css: {
                                                            marginTop: "0"
                                                        }
                                                    }
                                                }]
                                            }
                                        }

                                        ]
                                    }
                                },
                                {
                                    ctor: Container,
                                    props: {
                                        id: "container_1",
                                        spacing: {
                                            h: 100
                                        },
                                        components: [{
                                            ctor: Repeater,
                                            props: {
                                                id: "componentList",
                                                dataProvider: _cmpList,
                                                rendering: {
                                                    direction: 'horizontal'
                                                },
                                                components: [{
                                                    ctor: Container,
                                                    props: {
                                                        id: 'component',
                                                        // spacing: {
                                                        //     m: 1
                                                        // },
                                                        //label: "{label}",
                                                        draggable: true,
                                                        dragstart: function (e, ra) {
                                                            console.log(arguments);
                                                            e.originalEvent.dataTransfer.setData("domID", e.target.id);
                                                            e.originalEvent.dataTransfer.setData("ctor", ra.currentItem.ctor);
                                                            var $elem = Component.instances["dragImage"].$container[0];
                                                            $(document.body).append($elem);
                                                            e.originalEvent.dataTransfer.setDragImage($elem, 0, 0);
                                                        },
                                                        classes: ["border", "comp_side"],
                                                        css: {
                                                            borderRadius: '5px',
                                                            margin: "2px 2px"
                                                        },
                                                        width: 130,
                                                        height: 80,
                                                        type: ContainerType.NONE,
                                                        components: [{
                                                            ctor: Label,
                                                            props: {
                                                                id: "Component Label",
                                                                label: "{label}",
                                                                css: {
                                                                    fontSize: "15px",
                                                                    marginTop: "20px",
                                                                    fontWeight: "bold"
                                                                }
                                                            }
                                                        }]
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
                                height: "100%",
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
                                        label: "Field Properties",
                                        css: {
                                            marginLeft: "0"
                                        },
                                        classes: ["sideRight_label"]
                                    }
                                },
                                {
                                    ctor: HRule,
                                    props: {
                                        id: "hr",
                                        width: 600,
                                        align: "center",
                                        css: {
                                            margin: 0
                                        }
                                    }
                                },
                                {
                                    ctor: Container,
                                    props: {
                                        id: "propertyEditorWindow",
                                        classes: ["sideNav_left_container"],
                                        components: []
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
                                classes: ["deleteTrash"],
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: "deleteTrashIcon",
                                        labelType: LabelType.i,
                                        classes: ["fas", "fa-trash", "trash-icon"]
                                    }
                                }]
                            }
                        }
                        ]
                    }
                    },
                    {
                        ctor: Modal,
                        props: {
                            id: 'fileSelectModal',
                            size: ModalSize.LARGE,
                            title: 'Select File',
                            components: [
                                {
                                    ctor: UploadEx,
                                    props: {
                                        id: "browseFile",
                                        multiple: false,
                                        showProgress: false
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
};

oxana.components.splicea(oxana.components.length, 0, [{
    ctor: ViewStack,
    props: {
        type: ContainerType.NONE,
        components: [mainContainer]
    }
}]);

var daBehaviors = {
    "mouseover": "WA_HOVER",
    "mouseout": "WA_HOVER",
    "drop": "DELETE_CMP",
    "dragover": "ALLOW_DROP",
};

var waBehaviors = {
    "click": "BECOME_ACTIVE",
    "mousedown": "WA_PREVENT_DRAGSTART",
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

var cmpBehaviors = {
    "mousedown": {
        "SELECT_COMPONENT": isSelectComponent
    },
    "dragstart": "DRAGSTART_COMPONENT",
    "dropped": "SELECT_COMPONENT"
};

oxana.behaviors["SearchComponents"]["keyup"] = "SEARCH_CMP";

oxana.behaviors["undoButton"]["click"] = "WA_UNDO";

oxana.behaviors["redoButton"]["click"] = "WA_REDO";

oxana.behaviors["deleteComponentId"] = daBehaviors;

oxana.behaviors["toggleVisibilityButtonLeft"]["click"] = "TOGGLE_VISIBILITY_LEFT";

oxana.behaviors["toggleVisibilityButtonRight"]["click"] = "TOGGLE_VISIBILITY_RIGHT";

oxana.behaviors["splitHorizontal"]["click"] = "SPLIT_HOR";

oxana.behaviors["splitVertical"]["click"] = {
    "SPLIT_VERT": null,
};

oxana.behaviors["saveLayout"]["click"] = "SAVE_LAYOUT";

oxana.behaviors["selectBtn"]["click"] = "FILE_SELECT_MODAL";

oxana.behaviors["previewBtn"]["click"] = "PREVIEW";

oxana.behaviors["browseFile"]["change"] = "FILE_SELECTED";

oxana.behaviors["listHistorySteps"]["change"] = "HISTORY_STEP_DETAILS";

oxana.behaviors["workArea"] = waBehaviors;

oxana.behaviors[oxana.rootID]["keydown"] = {
    "WA_UNDO": isKeyCombUndo,
    "WA_REDO": isKeyCombRedo,
    "DELETE_CMP": isKeyDeletePress
};
oxana.behaviorimplementations["ALLOW_DROP"] = function (e) {
    console.log("ALLOW_DROP ", this.domID);
    e.preventDefault();
};
oxana.behaviorimplementations["WA_PREVENT_DRAGSTART"] = {
    description: "Prevent drag start ",
    do: function (e) {
        console.log('WA_PREVENT_DRAGSTART');
        e.preventDefault();
    }
};

let containers = ["Container", "Form"];

oxana.behaviorimplementations["ADD_COMPONENT"] = {
    description: "Add component ",
    do: function (e) {
        if (!formField) { 
            formField = Builder.components["FormField"].literal;
        }
        console.log('CREATED_');
        e.preventDefault();
        var workArea = Component.instances[Component.domID2ID[e.target.id]];
        var domID = e.originalEvent.dataTransfer.getData("domID");
        var ctor = e.originalEvent.dataTransfer.getData("ctor");
        var move = e.originalEvent.dataTransfer.getData("move");
        let inst;
        var ret = {
            track: false
        };
        if (move == "") {
            console.log("ADD_COMPONENT_ " + domID);
            let lit = Builder.components[ctor].literal;
            if (noNeedFF.indexOf(ctor) == -1 && (workArea.ctor == "Form" || (objectHierarchyGetMatching(workArea, "ctor", "Form", "parent", 1))["match"] !=null)) {
                var ff = extend(true, formField);
                ff.props.component = lit;
                lit = ff;
            }

            lit = extend(true, lit);
            lit.props.afterAttach = function (e) {
                var evt = new jQuery.Event("dropped");
                this.trigger(evt);
            };
            lit.props.draggable = true;
            if (isObject(lit.props.classes))
                lit.props.classes["self"].push("selected-component");
            else {
                lit.props.classes = !Array.isArray(lit.props.classes) ? [] : lit.props.classes;
                lit.props.classes.push("selected-component");
            }
            inst = workArea.addComponent(lit);
            addBehaviors(inst, cmpBehaviors, false);
            if (containers.indexOf(inst.ctor) > -1) { 
                addBehaviors(inst, waBehaviors, false);
                inst.attr.isNotWa = true;
            }
            inst.attr.isCmp = true;
            ret.child = lit;
            ret.parent = workArea;
            ret.container = workArea;
            ret.track = true;
            return ret;
        } else {

            console.log("MOVED_", domID, workArea.domID);
            var _id = Component.domID2ID[domID] ? Component.domID2ID[domID] : domID;
            var _idSurrogate = Component.surrogates[domID] && Component.domID2ID[Component.surrogates[domID]] ? Component.domID2ID[Component.surrogates[domID]] : null;
            _id = _idSurrogate ? _idSurrogate : _id;
            inst = Component.instances[_id];
            let lit = Builder.components[ctor].literal;
            if (inst.parent && (inst.parent != workArea) && (domID != workArea.domID)) {
                inst.parent.removeChild(inst, 0);
                if (inst.ctor == "FormField" && workArea.ctor != "Form") {
                    // inst = inst.children[inst.component.props.id];
                    inst.draggable = true;
                    addBehaviors(inst, cmpBehaviors, false);
                    let classes = inst.classes.slice(0);
                    classes.pushUnique("selected-component");
                    inst.classes = classes;
                } else if (workArea.ctor == "Form" && noNeedFF.indexOf(inst.ctor) == -1) {
                    removeBehaviors(inst, cmpBehaviors, false);
                    let classes = inst.classes.slice(0);
                    let ind = classes.indexOf("default-component");
                    if(id > -1){
                        classes.splice(ind, 1);
                    }
                    ind = classes.indexOf("selected-component");
                    if (ind > -1)
                        classes.splice(ind, 1);
                    inst.classes = classes;
                    inst.draggable = false;
                    let ff = extend(true, formField);
                    ff.props.component = inst.literal;
                    ff.props.draggable = true;
                    ff.props.classes = !Array.isArray(ff.props.classes) ? [] : ff.props.classes;
                    ff.props.classes.push("selected-component");
                    inst = workArea.addComponent(ff);
                    //inst.addChild(inst);
                    //inst = instF;
                    addBehaviors(inst, cmpBehaviors, false);
                    // if (parents.indexOf(ctor) > -1) {
                    //     addBehaviors(instF, cntBehaviors, false);
                    // }
                }
                workArea.addChild(inst);
                var evt = new jQuery.Event("dropped");
                inst.trigger(evt);
            }
        }

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
        console.log("SELECT_COMPONENT "+this.id);
        //this will hold the instance of the component who manifested this behavior (the manifestor)
        if (activeComponent && activeComponent != this && ((isObject(activeComponent.classes) && activeComponent.classes["self"].indexOf("selected-component")) || activeComponent.classes.indexOf("selected-component") > -1)) {
            let classes = isObject(activeComponent.classes) ? activeComponent.classes["self"].slice(0) : activeComponent.classes.slice(0);
            let ind = classes.indexOf("selected-component");
            if (ind > -1)
                classes.splice(ind, 1);
            classes.pushUnique("default-component");
            if (isObject(activeComponent.classes))
                activeComponent.classes["self"] = classes;
            else
                activeComponent.classes = classes;
        }
        let classes = isObject(this.classes) ? this.classes["self"].slice(0) : this.classes.slice(0);
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
        pew.removeAllChildren();
        pew.components = [oeLit];
    },
    stopPropagation: true
};

oxana.behaviorimplementations["DRAGSTART_COMPONENT"] = {
    description: "Drag Component",
    do: function (e) {
        console.log("DRAGSTART_COMPONENT", this.domID);
        e.originalEvent.dataTransfer.setData("domID", this.domID);
        e.originalEvent.dataTransfer.setData("ctor", this.ctor);
        e.originalEvent.dataTransfer.setData("move", 1);
        let $elem = Component.instances["dragImage"].$container[0];
        $(document.body).append($elem);
        e.originalEvent.dataTransfer.setDragImage($elem, 0, 0);
    }
};
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
                oxana.trigger(evt);
            })
            .catch(function (resp) {
                alert(resp.description);
            });
    }
};

oxana.behaviorimplementations["SEARCH_CMP"] = function (e) {
    console.log("search box change");
    let value = e.target.value.toLowerCase();
    _cmpList.undoAll();
    if (value.length > 0) {
        _cmpList.filter(function (el) {
            let regEx = new RegExp(`${value}`, "gi");
            return el.label.toLowerCase().match(regEx);
        });
    }
};

oxana.behaviors[oxana.id]["loadLayout"] = "LOAD_LAYOUT";
oxana.behaviorimplementations["LOAD_LAYOUT"] = function (e) {
    let _cmp = JSON.parse(e.content);
    let res = objectHierarchyGetMatchingMember(_cmp, "props.id", "workArea", "props.components");
    if (res.match) { 
        _cmp = res.match;
    }
    Component.instances["workArea"].removeAllChildren(0);
    for (let i = 0; i < _cmp.props.components.length; i++)
    {
        let inst = Component.instances["workArea"].addComponent(_cmp.props.components[i]);
        let was = objectHierarchyGetMatchingMember(inst, "attr.isWa", true, "children", true);
        for (let wi = 0; wi < was.length; wi++)
        {
            addBehaviors(was[wi].match, waBehaviors, false);
        }
        let cmps = objectHierarchyGetMatchingMember(inst, "attr.isCmp", true, "children", true);
        for (let ci = 0; ci < cmps.length; ci++)
        {
            addBehaviors(cmps[ci].match, cmpBehaviors, false);
        }
    }
};

function addBehaviors(cmp, behaviors, recurse = true) {
    for (let b in behaviors) {
        oxana.behaviors[cmp.id][b] = behaviors[b];
    }
    if (recurse) {
        for (let cid in cmp.children) {
            addBehaviors(cmp.children[cid], behaviors);
        }
    }
}

function removeBehaviors(cmp, behaviors, recurse = true) {
    if (oxana.behaviors[cmp.id] != null)
        for (let b in behaviors) {
            delete oxana.behaviors[cmp.id][b];
        }
    if (recurse) {
        for (let cid in cmp.children) {
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
    do: function (e) {
        console.log('delete component', this.id);
        let domID;
        e.preventDefault();
        //if is pressed delete
        if (activeComponent) {
            if (e.keyCode == 46) {
                //domId of element who should delete
                domID = activeComponent.id;
            } else {
                //if drop to delete area
                domID = e.originalEvent.dataTransfer.getData("domID");
            }
            var _id = Component.domID2ID[domID] ? Component.domID2ID[domID] : domID;
            var _idSurrogate = Component.surrogates[domID] && Component.domID2ID[Component.surrogates[domID]] ? Component.domID2ID[Component.surrogates[domID]] : null;
            _id = _idSurrogate ? _idSurrogate : _id;
            let inst = Component.instances[_id];
            let pew = Component.instances["propertyEditorWindow"];
            
            let c = confirm("Do you want to delete " + _id.toUpperCase() + "?");
            if (c) {

                inst.parent.removeChild(inst, 2);
                let oeLit = {
                    ctor: ObjectEditor,
                    "props": {
                        id: "objectEditor",
                        instance: selectedForm,
                        field: "props"
                    }
                };
                pew.components = [oeLit];
            }
            activeComponent = null;
        } else {
            alert("Please select component you want to delete.");
        }

    },
    undo: function () {
        //undo
    }
}

oxana.behaviorimplementations["TOGGLE_VISIBILITY_LEFT"] = {
    do: function (e) {
        var cmp = Component.instances["controlsWindow"];
        cmp.toggleVisibility();
    }

};

oxana.behaviorimplementations["TOGGLE_VISIBILITY_RIGHT"] = {
    do: function (e) {
        var cmp = Component.instances["RightSideNav"];
        cmp.toggleVisibility();
    }

};

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
        let newRow = {
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
                        classes: ["border"],
                        attr: {"isWa": true}
                    }
                }]
            }
        };
        var newRow2;
        if (activeContainer.ctor == "Form" || (objectHierarchyGetMatching(activeContainer, "ctor", "Form", "parent", 1)) ["match"] != null) { 
            newRow.props.type = ContainerType.FORM_ROW;
        }
        if (activeContainer.components.length == 0) {
            newRow2 = extend(true, newRow);
        }
        var newRowInstance;
        if (retFromRedoMaybe.child) {
            newRowInstance = retFromRedoMaybe.child;
            activeContainer.addChild(newRowInstance);
        } else {
            newRowInstance = activeContainer.addComponent(newRow);
            newRowInstance.attr.isWa = true;
        }
           
        var newWorkArea = newRowInstance.children[newRowInstance.components[0].props.id];
        oxana.behaviors[newWorkArea.id] = waBehaviors;
        // oxana.behaviors[newWorkArea.id]["mousemove"]["WA_RESIZE_EW"] = isMouseMoveEW;
        //{filter: isMouseMoveEw, otherProperties...}

        if (activeContainer.components.length == 1) {
            var newRowInstance2;
            if (retFromRedoMaybe.child2) {
                newRowInstance2 = retFromRedoMaybe.child2;
                activeContainer.addChild(newRowInstance2);
            } else { 
                newRowInstance2 = activeContainer.addComponent(newRow2);
                newRowInstance2.attr.isWa = true;
            }

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
        console.log(retFromRedoMaybe);
        if (retFromRedoMaybe.container) {
            activeContainer = retFromRedoMaybe.container;
            console.log("called SPLIT_VERT from History(REDO).");
        }
        console.log("Split Selected Container Vertically");
        var ret = {
            track: false
        };
        let newRow = {
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
                            colSpan: 6,
                            h: 100
                        },
                        id: 'workArea',
                        classes: ["border"],
                        attr: {"isWa": true}
                    }
                },
                {
                    ctor: Container,
                    props: {
                        type: ContainerType.COLUMN,
                        spacing: {
                            colSpan: 6,
                            h: 100
                        },
                        id: 'workArea',
                        classes: ["border"],
                        attr: {"isWa": true}
                    }
                }]
            }
        };
  
        let newCell = {
            ctor: Container,
            props: {
                type: ContainerType.COLUMN,
                spacing: {
                    colSpan: 12,
                    h: 100
                },
                id: 'workArea',
                classes: ["border"],
                attr: {"isWa": true}
            }
        };
        let toAdd = [newCell];
        let parent = activeContainer.parent;
        let notWa = false;
        if (activeContainer.attr.isNotWa && activeContainer.components.length == 0) {
            notWa = true;
            newRow.props.type = ContainerType.FORM_ROW;
            toAdd = [newRow];
            parent = activeContainer;
        } else if (activeContainer.attr.isNotWa) { 
            alert("Select an Existing Column to split Vertically.");
            return;
        }
        let children_len = parent.components.length;

        if (children_len < 12) {
            let newInstance;
            if (retFromRedoMaybe.child) {
                newInstance = retFromRedoMaybe.child;
                parent.addChild(newInstance);
            } else {
                newInstance = parent.addComponents(toAdd);
                newInstance[0].attr.isWa = true;
            }
                
            let row = notWa ? newInstance[0] : activeContainer.parent;
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
            let classes = activeContainer.classes.slice(0);
            let ind = classes.indexOf("active-container");
            if(id > -1){
                classes.splice(ind, 1);
            }
            activeContainer.classes = classes;
        }
        var classes = this.classes.slice(0);
        classes.pushUnique("active-container");
        this.classes = classes;
        activeContainer = this;
        if (this.id == "workArea")
        {
            let pew = Component.instances["propertyEditorWindow"];
            let oeLit = {
                ctor: ObjectEditor,
                "props": {
                    id: "objectEditor",
                    instance: selectedForm,
                    field: "props"
                }
            };
            pew.components = [oeLit];
        }
    },
    stopPropagation: true
};

oxana.behaviorimplementations["WA_HOVER"] = {
    do: function (e) {
        console.log("Container hovered " + this.id);
        //this will hold the instance of the component who manifested this behavior (the manifestor)
        let classes = this.classes.slice(0);
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
        stripHandle(lit);
        var jsonLayout = JSON.stringify(lit, null, "\t");
        download("snowCrash.json.txt", jsonLayout);
    },
    stopPropagation: true
};

oxana.behaviorimplementations["SAVE_LAYOUT"] = {
    do: function (e) {
        var workArea = Component.instances["snowCrash"];
        var lit = workArea.literalLite;
        stripHandle(lit);
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

oxana.behaviorimplementations["END_DRAW"] = new ArrayEx(oxana.behaviorimplementations["END_DRAW"], function (e) {
    _initDP();
    Component.instances["controlsWindow"].show();
});
oxana.eventTypes.splicea(oxana.eventTypes.length, 0, ["resize", "dropped"]);
oxana.registerBehaviors();
oxana.renderPromise().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});

/**
 * Behavior Filters below
*/
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
            debouncedDragNS = debounce(function (e) {
                console.log("debounced");
                var p1 = {
                    x: e.pageX,
                    y: e.pageY
                };
                console.log(p0);
                console.log(p1);
                var dy = p1.y - p0.y;
                var dx = p1.x - p0.x;
                let evt = new jQuery.Event("resize");
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
        let classes = this.classes.slice(0);
        classes = classes.difference(["ns-resize", "ew-resize"]);
        //classes.splice(i, 1);
        this.classes = classes;
        //}

    }
}

//behavior can cause another behavior (throws custom event, so we may avoid filter functions...)

function isKeyDeletePress(e) {
    if (e.keyCode == 46) {
        console.log("delete pressed");
        e.preventDefault();
        e.stopPropagation();
        return true;
    }
}

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
function _initDP() {
    Builder.data = {};
    Builder.masks;
    Builder.maskValueField = "";
    Builder.maskLabelField = "";

    Builder.componentValueField = "ctor";
    Builder.componentLabelField = "label";
    
    Builder.providerValueField = "dataview_id";
    Builder.providerLabelField = "description";
    
    let api_dv_dataviews = new GaiaAPI_DV_dataviews();
    let api_dv_forms = new GaiaAPI_DV_forms();

    let raDvs = new RemoteArray(
        {
            recordsPerPage: 10,
            fetchPromise: function (p) {
                let dvInp = new dvInput();
                dvInp.tableData = new tableData({
                    currentRecord: p.startPage * p.recordsPerPage,
                    recordsPerPage: p.recordsPerPage
                });
                return api_dv_dataviews.dataview_pid_2Client.post(dvInp);
            }
        }
    );

    Builder.sources = new ArrayEx(raDvs);   
    
    let raFrms = new RemoteArray(
        {
            recordsPerPage: 10,
            fetchPromise: function (p) {
                let dvInp = new dvInput();
                dvInp.tableData = new tableData({
                    currentRecord: p.startPage * p.recordsPerPage,
                    recordsPerPage: p.recordsPerPage
                });
                return api_dv_forms.dataview_pid_1Client.post(dvInp);
            }
        }
    );

    Builder.sources = new ArrayEx(raDvs);         
    Builder.forms = new ArrayEx(raFrms);
    
    Promise.all([Builder.forms.init(), Builder.sources.init()]).then(function (result) { 
        Builder.initComponentLiterals();
        Builder.initMetaProps();
    }); 
}

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

        let ha = container.parent.parent.$el.height();
        let s = dy / Math.abs(dy);
        let ha_rel = Math.floor(Math.abs(dy * 100 / ha)) * s;
        container.parent.spacing.h = container.parent.spacing.h - ha_rel;

        let sibling_id = container.parent.parent.components[mpi].props.id;
        container.parent.parent.children[sibling_id].spacing.h += ha_rel;
    }
    if (dx && !isNaN(dx) && dx != 0 && container.parent.components.length >= 2) {
        let mpi = indexOfObject(container.parent.components, "props.id", container.id);
        if (mpi == container.parent.components.length - 1) {
            dx = -dx;
            --mpi;
        } else
            ++mpi;

        let wa = container.parent.$el.width();
        let s = dx / Math.abs(dx);
        let wa_rel = Math.floor(Math.abs(dx * 12 / wa)) * s;
        container.spacing.colSpan = container.spacing.colSpan - wa_rel;

        let sibling_id = container.parent.components[mpi].props.id;
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