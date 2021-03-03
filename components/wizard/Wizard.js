/**
 * This is a Wizard Component
 * 
 * Kreatx 2020
 */
var Wizard = function (_props) {
    let _self = this;
    let _viewStack, _stepPath, _detailsPath, _steps = new ArrayEx(),
        _selectedIndex, _detailLabel, _wizardTree, _loop;

    Object.defineProperty(this, "viewStack", {
        get: function viewStack() {
            return _viewStack;
        }
    });

    Object.defineProperty(this, "selectedIndex", {
        get: function selectedIndex() {
            return _selectedIndex;
        },
        set: function selectedIndex(v) {
            if (_selectedIndex != v && v >= 0 && v < _steps.length) {
                let e = jQuery.Event("beforeChange");
                e.newValue = v;
                e.oldValue = _selectedIndex;
                this.$el.trigger(e);
                if (!e.isDefaultPrevented()) {
                    _selectedIndex = v;
                    _stepHeading.label = _steps[v].stepLabel;
                    _detailLabel.label = _steps[v].detail;
                    _viewStack.selectedIndex = v;
                    _wizardTree.select({
                        "guid": _steps[v]["guid"]
                    });
                    this.$el.trigger("change");
                }
            }
        },
        enumerable: true
    });

    let _defaultParams = {
        type: ContainerType.CONTAINER,
        stepPath: "attr.step",
        detailsPath: "attr.details",
        selectedIndex: 0,
        loop: true
    };

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _viewStack = this.bodyRowCnt.colCnt.wizardCnt.viewStack;
            _stepHeading = this.bodyRowCnt.colCnt.wizardCnt.container_page_top_row.row_container.page_title_container.stepHeading;
            _detailLabel = _stepHeading.detailLabel;
            _wizardTree = this.stepsRowCnt.colCnt.wizardTree;
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            _self.selectedIndex = _props.selectedIndex;
        }
    };

    let _viewStack_endDraw = function (e) {
        let arr = [],
            len = this.components.length;
        for (let i = 0; i < len; i++) {
            let r = this.components[i].props;
            let o = {
                "stepLabel": getChainValue(r, _stepPath),
                "detail": getChainValue(r, _detailsPath),
                "liComponents": stepCmps
            };
            arr.push(o);
        }
        _steps.splicea(0, _steps.length, arr);
    };

    let _cmps;
    let stepCmps = [{
            ctor: Link,
            props: {
                id: "link",
                label: "{?detail}"
            }
        },
        {
            ctor: Label,
            props: {
                labelType: LabelType.span,
                classes: ["step-no"],
                label: "{?stepLabel}"
            }
        }
    ];

    let fnViewStackDelayInit = function () {
        _cmps = [{
                ctor: Container,
                props: {
                    id: "stepsRowCnt",
                    type: ContainerType.ROW,
                    classes: ["row"],
                    components: [{
                        ctor: Container,
                        props: {
                            id: "colCnt",
                            type: ContainerType.COLUMN,
                            classes: ["col-12"],
                            components: [{
                                ctor: Tree,
                                props: {
                                    id: "wizardTree",
                                    classes: ["wizard-steps"],
                                    selectedClasses: ["current-step"],
                                    componentsField: "liComponents",
                                    dataProvider: _steps
                                }
                            }]
                        }
                    }]
                }
            },
            {
                ctor: Container,
                props: {
                    id: "bodyRowCnt",
                    type: ContainerType.NONE,
                    classes: ["row"],
                    components: [{
                        ctor: Container,
                        props: {
                            id: "colCnt",
                            type: ContainerType.NONE,
                            classes: ["col-12"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "wizardCnt",
                                    type: ContainerType.NONE,
                                    classes: ["wizard-form-wrapper"],
                                    components: [{
                                            ctor: Container,
                                            props: {
                                                id: "container_page_top_row",
                                                type: ContainerType.NONE,
                                                classes: ["page-top-row"],
                                                components: [{
                                                    ctor: Container,
                                                    props: {
                                                        id: "row_container",
                                                        type: ContainerType.ROW,
                                                        components: [{
                                                            ctor: Container,
                                                            props: {
                                                                id: "page_title_container",
                                                                type: ContainerType.NONE,
                                                                classes: ["col-6"],
                                                                components: [{
                                                                    ctor: Heading,
                                                                    props: {
                                                                        id: "stepHeading",
                                                                        headingType: HeadingType.h3,
                                                                        components: [{
                                                                            ctor: Label,
                                                                            props: {
                                                                                id: "detailLabel",
                                                                                labelType: LabelType.span
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
                                            ctor: ViewStack,
                                            props: {
                                                id: "viewStack",
                                                selectedIndex: 0,
                                                enabled: true,
                                                components: _props.components,
                                                endDraw: _viewStack_endDraw
                                            }
                                        },
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "wizard_footer",
                                                type: ContainerType.NONE,
                                                classes: ["wizard-form-footer"],
                                                components: [{
                                                    ctor: Container,
                                                    props: {
                                                        id: "row-footer",
                                                        type: ContainerType.ROW,
                                                        classes: ["row"],
                                                        components: [{
                                                                ctor: Container,
                                                                props: {
                                                                    id: "col-footer",
                                                                    type: ContainerType.COLUMN,
                                                                    classes: ["col-6"],
                                                                    components: [{
                                                                        ctor: Button,
                                                                        props: {
                                                                            id: "left-arrow",
                                                                            href: "#",
                                                                            classes: ["btn", "btn-outline-primary"],
                                                                            click: _prev,
                                                                            label: "Kthehu",
                                                                            components: [{
                                                                                ctor: Label,
                                                                                props: {
                                                                                    id: "back",
                                                                                    labelType: LabelType.i,
                                                                                    classes: ["fa", "fa-arrow-left"]
                                                                                }
                                                                            }]
                                                                        }
                                                                    }]
                                                                }
                                                            },
                                                            {
                                                                ctor: Container,
                                                                props: {
                                                                    id: "text-right",
                                                                    type: ContainerType.COLUMN,
                                                                    classes: ["col-6", "text-right"],
                                                                    components: [{
                                                                        ctor: Button,
                                                                        props: {
                                                                            id: "next",
                                                                            href: "#",
                                                                            classes: ["btn", "btn-outline-primary"],
                                                                            label: "Tjetra",
                                                                            click: _next,
                                                                            components: [{
                                                                                ctor: Label,
                                                                                props: {
                                                                                    id: "arrow",
                                                                                    labelType: LabelType.i,
                                                                                    classes: ["fa", "fa-arrow-right"]
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
                                        }

                                    ]
                                }
                            }]
                        }
                    }]
                }
            }
        ];
    };

    let _next = function () {
        if (_selectedIndex < _steps.length - 1) {
            _self.selectedIndex += 1;
        } else {
            if (_loop)
                _self.selectedIndex = 0;
        }
    };

    let _prev = function () {
        if (_selectedIndex == 0) {
            if (_loop)
                _self.selectedIndex = _steps.length - 1;
        } else {
            _self.selectedIndex -= 1;
        }
    };

    _props = extend(false, false, _defaultParams, _props);
    _stepPath = _props.stepPath;
    _detailsPath = _props.detailsPath;
    _loop = _props.loop;

    fnViewStackDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
};
Wizard.prototype.ctor = 'Wizard';