/**
 * This is a Wizard Component
 * 
 * Kreatx 2020
 */
import {Container} from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var Wizard = function (_props) {
    let _self = this;
    let _viewStack,
        _stepPath, _detailsPath, _nextBtnLabelPath, _previousBtnLabelPath,
        _nextBtnVisibilityPath, _previousBtnVisibilityPath,
        _previousBtn, _nextBtn,
        _steps = new ArrayEx(),
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
                if ((_viewStack.selectedIndex = v) !== false) {
                    _selectedIndex = v;
                    _detailLabel.label = _steps[v].detail;
                    _previousBtn.label = _steps[v].previousBtnLabel;
                    _nextBtn.label = _steps[v].nextBtnLabel;
                    _nextBtn.visible = _steps[v].nextBtnVisibility!=null ?  _steps[v].nextBtnVisibility : true;
                    _previousBtn.visible = _steps[v].previousBtnVisibility!=null ?  _steps[v].previousBtnVisibility : true;
                    _wizardTree.select({
                        "guid": _steps[v]["guid"]
                    });
                }
            }
        },
        enumerable: true
    });

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _viewStack = this.bodyRowCnt.colCnt.wizardCnt.viewStack;
            _stepHeading = this.bodyRowCnt.colCnt.wizardCnt.container_page_top_row.row_container.page_title_container.stepHeading;
            _previousBtn = this.bodyRowCnt.colCnt.wizardCnt.wizardFooter.footerRow.buttonCnt.previous;
            _nextBtn = this.bodyRowCnt.colCnt.wizardCnt.wizardFooter.footerRow.buttonCnt.next;
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
                "stepLabel": ObjectUtils.getChainValue(r, _stepPath),
                "detail": ObjectUtils.getChainValue(r, _detailsPath),
                nextBtnLabel: ObjectUtils.getChainValue(r, _nextBtnLabelPath),
                previousBtnLabel: ObjectUtils.getChainValue(r, _previousBtnLabelPath),                  
                "liComponents": stepCmps,
                nextBtnVisibility: ObjectUtils.getChainValue(r, _nextBtnVisibilityPath),
                previousBtnVisibility: ObjectUtils.getChainValue(r, _previousBtnVisibilityPath)
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
                    css: {"height": "100%"},
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
                                                endDraw: _viewStack_endDraw,
                                                childAdded: _viewStack_endDraw
                                            }
                                        },
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "wizardFooter",
                                                type: ContainerType.NONE,
                                                classes: ["wizard-form-footer"],
                                                components: [{
                                                    ctor: Container,
                                                    props: {
                                                        id: "footerRow",
                                                        type: ContainerType.ROW,
                                                        classes: ["row"],
                                                        components: [
                                                            {
                                                                ctor: Container,
                                                                props: {
                                                                    id: "buttonCnt",
                                                                    type: ContainerType.COLUMN,
                                                                    classes: ["col", "text-right"],
                                                                    components: [
                                                                        {
                                                                            ctor: Button,
                                                                            props: {
                                                                                id: "previous",
                                                                                href: "#",
                                                                                classes: ["btn", "btn-outline-primary"],
                                                                                click: _prev,
                                                                                label: "",
                                                                                components: [{
                                                                                    ctor: Label,
                                                                                    props: {
                                                                                        id: "back",
                                                                                        labelType: LabelType.i,
                                                                                        classes: ["fa", "fa-arrow-left"]
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        {
                                                                        ctor: Button,
                                                                        props: {
                                                                            id: "next",
                                                                            href: "#",
                                                                            classes: ["btn", "btn-outline-primary"],
                                                                            label: "",
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
            else
                _self.trigger("finished");
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

    let _defaultParams = {
        type: ContainerType.CONTAINER,
        stepPath: "attr.step",
        detailsPath: "attr.details",
        nextBtnLabelPath: "attr.nextBtnLabel",
        previousBtnLabelPath: "attr.previousBtnLabel",
        selectedIndex: 0,
        loop: false,
        previousBtnVisibilityPath: "attr.previousBtnVisibility",
        nextBtnVisibilityPath: "attr.nextBtnVisibility"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["beforeChange", "change", "finished"];

    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    _stepPath = _props.stepPath;
    _detailsPath = _props.detailsPath;
    _nextBtnLabelPath = _props.nextBtnLabelPath, _previousBtnLabelPath = _props.previousBtnLabelPath,
    _nextBtnVisibilityPath = _props.nextBtnVisibilityPath, _previousBtnVisibilityPath = _props.previousBtnVisibilityPath;
    _loop = _props.loop;

    fnViewStackDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
};
Wizard.prototype.ctor = 'Wizard';
export {
    Wizard
};