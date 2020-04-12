
var mainContainer = {
    ctor: Container,
    props: {
        id: "mainContainer",
        type: ContainerType.NONE,
        height: "100%",
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
                id: "container",
                type: ContainerType.NONE,
                classes: ["d-flex", "flex-shrink-0", "flex-nowrap"],
                components: [{
                    ctor: SideNav,
                    props: {
                        id: "componentsContainer",
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
                                                            var $elem = oxana.viewStack.mainContainer.dragImage.$el[0];
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
                        id: "workArea",
                        components: [{
                            ctor: Container,
                            props: {
                                id: 'workAreaRow',
                                type: ContainerType.ROW,
                                height: "100%",
                                components: [{
                                    ctor: Container,
                                    props: {
                                        type: ContainerType.COLUMN,
                                        spacing: {
                                            colSpan: 12
                                        },
                                        id: "workAreaColumn",
                                        components: [{
                                            ctor: Container,
                                            props: {
                                                spacing: {
                                                    h: 100
                                                },
                                                id: "workAreaCell",
                                                type: ContainerType.NONE,
                                                components: [{
                                                    ctor: Container,
                                                    props: {
                                                        id: 'workAreaRowL2',
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
                                                                id: "workAreaColumnL2",
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
                        id: "rightSideNav",
                        width: "300",
                        minWidth: "300",
                        classes: ["sidenav", "sidenav_right", "sideNav_side_right", "flex-shrink-0"],
                        components: [
                            {
                                ctor: Container,
                                props: {
                                    id: "rightSideContainer",
                                    components: [
                                        {
                                            ctor: ViewStack,
                                            props: {
                                                id:"propertyEditorViewStack",
                                                type: ContainerType.NONE,
                                                components: [
                                                    {
                                                        ctor: Container,
                                                        props: {
                                                            id: "propertyEditorContainerWrap",
                                                            type: ContainerType.NONE,
                                                            components: [
                                                                {
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
                                                                        id: "propertyEditorContainer",
                                                                        type: ContainerType.NONE,
                                                                        components: [],
                                                                        classes: ["propertyEditor"]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        ctor: Container,
                                                        props: {
                                                            id: "deleteComponentId",
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
                                        }
                                    ]
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