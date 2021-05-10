import { ArrayUtils } from "/flowerui/lib/ArrayUtils.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;

    let activeComponent;
    let activeContainer;
    let _cmpList = new ArrayEx(data.componentList);

    let propertyEditorViewStack, propertyEditorContainer, fileSelectModal, browseFile, componentsContainer,
        rightSideNav, listHistorySteps, workArea, workAreaColumn, workAreaRowL2,
        cmpSearchTextInput, undoButton, redoButton, duplicateButton, cmpTrash, toggleSideNavLeft, toggleSideNavRight,
        splitHorizontal, splitVertical, uploadIcon, saveLayout, selectBtn, componentList,
        openUploadForms, appLoader, middleNav, desktopPreview, tabletPreview, mobilePreview, footer, removeSearchText;


    let formField;

    let containers = ["Container", "Form", "Header", "Footer"];
    let noNeedFF = ["Button", "Label", "Container", "Link", "Header", "Footer", "Form", "SideNav", "ViewStack", "Calendar", "Tree", "Image", "HRule", "Heading", "Repeater", "RepeaterEx", "DataGrid", "RequiredFieldValidator", "RangeValidator", "RegularExpressionValidator"];
    let nonShownComponent = [];
    let needValidator = ["TextInput", "DateTime", "Amount", "DateTimeCb"];


    let imp = {
        "BEGIN_DRAW": function (e) {
            console.log("APPLET_BEGIN_DRAW");
            let paths = findMember(applet.literal, "id", [], "listHistorySteps", false);
            paths[0].pop();
            let propsListHistorySteps = ObjectUtils.ObjectUtils.getChainValue(applet.literal, paths[0]);
            propsListHistorySteps.dataProvider = app.history.steps;

            paths = findMember(applet.literal, "id", [], "componentList", false);
            paths[0].pop();
            let propsComponentList = ObjectUtils.ObjectUtils.getChainValue(applet.literal, paths[0]);
            propsComponentList.dataProvider = _cmpList;
        },
        "END_DRAW": function (e) {
            appLoader = app.viewStack.mainContainer.appLoader;
            appLoader.hide();

            propertyEditorViewStack = app.viewStack.mainContainer.container.rightSideNav.rightSideContainer.propertyEditorViewStack;
            propertyEditorContainer = propertyEditorViewStack.propertyEditorContainerWrap.propertyEditorContainer;
            fileSelectModal = app.viewStack.mainContainer.container.children.fileSelectModal;
            browseFile = fileSelectModal.modalDialog.modalContent.modalBody.browseFile;
            componentsContainer = app.viewStack.mainContainer.container.componentsContainer;
            middleNav = app.viewStack.mainContainer.nav.middleNav;
            rightSideNav = app.viewStack.mainContainer.container.rightSideNav;
            listHistorySteps = middleNav.listHistorySteps;
            workAreaColumn = app.viewStack.mainContainer.container.workArea.workAreaRow.workAreaColumn;
            workAreaRowL2 = workAreaColumn.workAreaCell.workAreaRowL2;
            workArea = workAreaRowL2.workAreaColumnL2;
            componentList = componentsContainer.componentList;
            footer = app.viewStack.mainContainer.container.workArea.workAreaRow.workAreaColumn.workAreaCell.footer;
            removeSearchText = componentsContainer.container.buttonDel;

            applet.addBehaviors(applet.view, {
                "idChanged": {
                    "UPDATE_BEHAVIOR_BINDINGS": {
                        onPropagation: true
                    }
                }
            }, false);

            applet.addBehaviors(componentList, {
                "rowAdd": "PREPARE_CMP",
            }, false);

            let len = componentList.rowItems.length;
            for (let i = 0; i < len; i++) {
                let currentRow = componentList.rowItems[i];
                applet.addBehaviors(currentRow.component, {
                    "dragstart": "INITIAL_DRAGSTART",
                }, false);
            }

            applet.addBehaviors(propertyEditorContainer, vspewbehaviors, false);

            cmpSearchTextInput = app.viewStack.mainContainer.container.componentsContainer.container.cmpSearchTextInput;
            applet.addBehaviors(cmpSearchTextInput, {
                "keyup": "SEARCH_CMP",
            }, false);

            undoButton = middleNav.undoButton;
            applet.addBehaviors(undoButton, {
                "click": "WA_UNDO",
            }, false);
            redoButton = middleNav.redoButton;
            applet.addBehaviors(redoButton, {
                "click": "WA_REDO",
            }, false);
            duplicateButton = middleNav.duplicateButton;
            applet.addBehaviors(duplicateButton, {
                "click": "DUPLICATE_CMP"
            });
            cmpTrash = app.viewStack.mainContainer.container.rightSideNav.rightSideContainer.propertyEditorViewStack.cmpTrash;
            applet.addBehaviors(cmpTrash, daBehaviors, false);

            toggleSideNavLeft = app.viewStack.mainContainer.nav.leftNav.toggleSideNavLeft;
            applet.addBehaviors(toggleSideNavLeft, {
                "click": "TOGGLE_VISIBILITY_LEFT",
            }, false);
            toggleSideNavRight = app.viewStack.mainContainer.nav.rightNav.toggleSideNavRight;
            applet.addBehaviors(toggleSideNavRight, {
                "click": "TOGGLE_VISIBILITY_RIGHT",
            }, false);

            splitHorizontal = middleNav.splitHorizontal;
            applet.addBehaviors(splitHorizontal, {
                "click": "SPLIT_HOR",
            }, false);

            splitVertical = middleNav.splitVertical;
            applet.addBehaviors(splitVertical, {
                "click": "SPLIT_VERT",
            }, false);

            uploadIcon = middleNav.uploadIcon;
            applet.addBehaviors(uploadIcon, {
                "click": "OPEN_MODAL_FORM_FOR_SAVE"
            }, false);

            openUploadForms = middleNav.openUploadForms;
            applet.addBehaviors(openUploadForms, {
                "click": "OPEN_MODAL_FORMS"
            }, false);

            desktopPreview = middleNav.desktop;
            applet.addBehaviors(desktopPreview, {
                "click": "DESKTOP_PREVIEW"
            }, false);

            mobilePreview = middleNav.mobile;
            applet.addBehaviors(mobilePreview, {
                "click": "MOBILE_PREVIEW"
            }, false);

            tabletPreview = middleNav.tablet;
            applet.addBehaviors(tabletPreview, {
                "click": "TABLET_PREVIEW"
            }, false);

            saveLayout = middleNav.saveLayout;
            applet.addBehaviors(saveLayout, {
                "click": "SAVE_LAYOUT",
            }, false);
            selectBtn = middleNav.selectBtn;
            applet.addBehaviors(selectBtn, {
                "click": "FILE_SELECT_MODAL",
            }, false);

            applet.addBehaviors(browseFile, {
                "change": "FILE_SELECTED",
            }, false);
            applet.addBehaviors(listHistorySteps, {
                "change": "HISTORY_STEP_DETAILS",
            }, false);

            applet.addBehaviors(removeSearchText, {
                "click": {
                    "REMOVE_SEARCH_TEXT": {
                        onPropagation: true
                    }
                }
            }, true);

            //app.behaviors["previewBtn"]["click"] = "PREVIEW";
            applet.addBehaviors(workArea, cmpWaBehaviors, false);
            applet.addBehaviors(footer, cmpWaBehaviors, false);

            applet.addBehaviors(app, {
                "loadLayout": "LOAD_LAYOUT",
                "loadHtml": "LOAD_HTML",
                "keydown": {
                    "WA_UNDO": {
                        filter: KeyboardUtils.test["CTR+Z"],
                        onPropagation: true
                    },
                    "WA_REDO": {
                        filter: KeyboardUtils.test["CTR+Y"],
                        onPropagation: true
                    },
                    "DELETE_CMP": {
                        filter: KeyboardUtils.test["DEL"],
                        onPropagation: true
                    }
                }
            }, false);
        },
        "UPDATE_BEHAVIOR_BINDINGS": {
            do: function (e) {
                console.log("UPDATE_BEHAVIOR_BINDINGS");
                app.behaviors[e.newValueDomId] = app.behaviors[e.oldValueDomId];
                delete app.behaviors[e.oldValueDomId];
            }
            /**
             * catch events thrown by children
             */
        },
        "ALLOW_DROP": function (e) {
            console.log("ALLOW_DROP ", this.domID);
            e.preventDefault();
        },
        "WA_PREVENT_DRAGSTART": {
            description: "Prevent drag start ",
            do: function (e) {
                console.log('WA_PREVENT_DRAGSTART');
                e.preventDefault();
            }
        },
        "TOGGLE_BIN": function (e) {
            console.log("SHOW_BIN : ", propertyEditorViewStack.selectedIndex);
            propertyEditorViewStack.selectedIndex = propertyEditorViewStack.selectedIndex == 0 ? 1 : 0;
            e.preventDefault();
            e.stopPropagation();
        },
        "ADD_COMPONENT": {
            description: "Add component ",
            do: function (e) {
                if (!formField) {
                    formField = data.components["FormField"].literal;
                }
                console.log('CREATED_');
                e.preventDefault();
                let workArea = Component.instances[e.target.id];
                let domID = e.originalEvent.dataTransfer.getData("domID");
                let ctor = e.originalEvent.dataTransfer.getData("ctor");
                let move = e.originalEvent.dataTransfer.getData("move");
                let inst;
                let ret = {
                    track: false
                };
                if (move == "") {
                    console.log("ADD_COMPONENT_ " + domID);
                    let lit = data.components[ctor].literal;
                    if (noNeedFF.indexOf(ctor) == -1 && (workArea.ctor == "Form" || (objectHierarchyGetMatching(workArea, "ctor", "Form", "parent", 1))["match"] != null)) {
                        let ff = extend(true, formField);
                        ff.props.component = lit;
                        lit = ff;
                    }

                    lit = extend(true, lit);
                    lit.props.afterAttach = function (e) {
                        let evt = new jQuery.Event("dropped");
                        this.trigger(evt);
                    };
                    lit.props.draggable = true;
                    if (activeComponent && needValidator.indexOf(activeComponent.ctor) > -1) {
                        lit.props.controlToValidate = activeComponent.id;
                    }
                    // if (nonShownComponent.indexOf(ctor) > -1) {
                    //     if (activeComponent && needValidator.indexOf(activeComponent.ctor) > -1) {
                    //         activeComponent.addComponent(lit);
                    //         //activeComponent.props.components.push(lit);
                    //         workArea = footer;
                    //         lit.props.controlToValidate = activeComponent.id;
                    //     } else {
                    //         console.log(`Selected component can not have validator. Please select another component`);
                    //         return;
                    //     }
                    // } else if (workArea == footer) {
                    //     console.log("Can not add other components at footer except validators.");
                    //     return;
                    // }
                    inst = workArea.addComponent(lit);
                    let classes = inst.classes.slice(0);
                    classes.pushUnique("selected-component");
                    inst.classes = classes;

                    applet.addBehaviors(inst, cmpWaBehaviors, false);
                    let isCont = isContainer.call(inst);
                    if (isCont) {
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
                    inst = Component.instances[domID];
                    let lit = Builder.components[ctor].literal;
                    if (inst.parent && (inst.parent != workArea) && (domID != workArea.domID)) {
                        inst.parent.removeChild(inst, 0);
                        if (inst.ctor == "FormField" && workArea.ctor != "Form") {
                            // inst = inst.children[inst.component.props.id];
                            inst.draggable = true;
                            applet.addBehaviors(inst, cmpWaBehaviors, false);
                            let classes = inst.classes.slice(0);
                            classes.pushUnique("selected-component");
                            inst.classes = classes;
                        } else if (workArea.ctor == "Form" && noNeedFF.indexOf(inst.ctor) == -1) {
                            app.removeBehaviors(inst, cmpWaBehaviors, false);
                            let classes = inst.classes.slice(0);
                            let ind = classes.indexOf("default-component");
                            if (id > -1) {
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
                            applet.addBehaviors(inst, cmpWaBehaviors, false);
                            // if (parents.indexOf(ctor) > -1) {
                            //     applet.addBehaviors(instF, cntBehaviors, false);
                            // }
                        }
                        workArea.addChild(inst);

                        let evt = new jQuery.Event("dropped");
                        inst.trigger(evt);
                    }
                }

            },
            undo: function (e) {
                let ret = arguments[arguments.length - 1];
                ret.parent.removeChild(ret.child.props, 0);

            },
            stopPropagation: true,
        },
        "SELECT_COMPONENT": {
            description: "Select Component",
            do: function (e) {
                console.log("SELECT_COMPONENT " + this.id);
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
                let oeLit = {
                    ctor: ObjectEditor,
                    "props": {
                        id: "objectEditor",
                        instance: this,
                        field: "props"
                    }
                };
                propertyEditorContainer.removeAllChildren();
                propertyEditorContainer.components = [oeLit];
            },
            stopPropagation: true
        },
        "DRAGSTART_COMPONENT": {
            description: "Drag Component",
            do: function (e) {
                console.log("DRAGSTART_COMPONENT", this.domID);
                e.originalEvent.dataTransfer.setData("domID", this.domID);
                e.originalEvent.dataTransfer.setData("ctor", this.ctor);
                e.originalEvent.dataTransfer.setData("move", 1);
                let $elem = app.viewStack.mainContainer.dragImage.$el[0];
                e.originalEvent.dataTransfer.setDragImage($elem, 0, 0);
            }
        },
        "HISTORY_STEP_DETAILS": function (e) {
            console.log("called HISTORY_STEP_DETAILS.");
        },
        "FILE_SELECT_MODAL": function (e) {
            console.log("called FILE_SELECT_MODAL.");
            fileSelectModal.show();
        },

        "OPEN_MODAL_FORMS": function (e) {
            app.appletsMap["formsModal"][0].init().then(() => {
                data.formList.filter();
                console.log("Applet formsModal inited");
                applet.addBehaviors(app.appletsMap["formsModal"][0].view, {
                    "loadLayout": "LOAD_LAYOUT"
                });
            });
        },

        "OPEN_MODAL_FORM_FOR_SAVE": function (e) {
            app.appletsMap["saveForm"][0].init().then(() => {
                console.log('Applet saveForm inited.');
            });
            data.selectedForm.form_literal = workAreaRowL2.literal;
            data.workArea = workArea;
        },

        "FILE_SELECTED": function (e) {
            let jsonMimes = ["application/json", "text/plain"];
            console.log("called FILE_SELECTED.");
            if (browseFile.value.length > 0) {
                readFile(browseFile.value[0]).then(function (resp) {
                        fileSelectModal.hide();
                        let evt;
                        if (browseFile.value[0].type === "text/html") {
                            evt = new jQuery.Event("loadHtml");
                            evt.content = resp.content;
                        } else if (jsonMimes.indexOf(browseFile.value[0].type) > -1) {
                            evt = new jQuery.Event("loadLayout");
                            evt.content = JSON.parse(resp.content);
                        }
                        app.trigger(evt);
                    })
                    .catch(function (resp) {
                        alert(resp.description);
                    });
            }
        },

        "DESKTOP_PREVIEW": function (e) {
            let browser = new BrowserWindow({
                id: "browser",
                components: workAreaRowL2.props.components,
                width: "1000",
                height: "800"
            });
            browser.show();
            browser.render();
        },

        "MOBILE_PREVIEW": function (e) {
            let browser = new BrowserWindow({
                id: "browser",
                components: workAreaRowL2.parent.components,
                width: "400",
                height: "500"
            });
            browser.show();
            browser.render();
        },

        "TABLET_PREVIEW": function (e) {
            let browser = new BrowserWindow({
                id: "browser",
                components: workAreaRowL2.parent.components,
                width: "600",
                height: "800"
            });
            browser.show();
            browser.render();
        },

        "PREPARE_CMP": function (e, r, ra) {
            if (ra) {
                applet.addBehaviors(ra.currentRow.component, {
                    "dragstart": "INITIAL_DRAGSTART",
                }, false);
            }
            console.log("PREPARE_CMP");
        },
        "INITIAL_DRAGSTART": function (e, ra) {
            console.log(arguments);
            e.originalEvent.dataTransfer.setData("domID", e.target.id);
            e.originalEvent.dataTransfer.setData("ctor", ra.currentItem.ctor);
            let $elem = app.viewStack.mainContainer.dragImage.$el[0];
            e.originalEvent.dataTransfer.setDragImage($elem, 0, 0);
        },

        "SEARCH_CMP": function (e) { // filter components
            console.log("search box change");
            let value = e.target.value.toLowerCase();
            if (value.length > 0) {
                this.parent.button.css.display = "none";
                this.parent.buttonDel.css.display = "block";
                //this.parent.buttonDel.css.padding = 0;
            } else {
                this.parent.button.css.display = "block";
                this.parent.button.css.top = 0;
                this.parent.buttonDel.css.display = "none";
            }
            _cmpList.undoAll();
            if (value.length > 0) {
                _cmpList.filter(function (el) {
                    let regEx = new RegExp(`${value}`, "gi");
                    return el.componentNameLabel.toLowerCase().match(regEx);
                });
            }
        },

        "REMOVE_SEARCH_TEXT": function (e) {
            console.log("object");
        },

        "LOAD_HTML": function (e) {
            let body = BrowserUtils.body(e.content);
            body = BrowserUtils.removeScripts(body);
            let dn = $("<div/>").append(body);
            let s = new Scrap();
            let lit = s.visit(dn);
            let evt = new jQuery.Event("loadLayout");
            evt.content = lit;
            app.trigger(evt);
        },

        "LOAD_LAYOUT": function (e) {
            let _cmp = e.content;
            let res = ArrayUtils.objectHierarchyGetMatchingMember(_cmp, "props.id", "workAreaRowL2", "props.components");
            if (res.match) {
                _cmp = res.match;
            }
            workAreaRowL2.removeAllChildren(0);
            for (let i = 0; i < _cmp.props.components.length; i++) {
                let inst = workAreaRowL2.addComponent(_cmp.props.components[i]);
                applet.addBehaviors(inst, cmpWaBehaviors, true);
            }
        },

        "HISTORY_STEP_ADDED": function (e) {
            console.log("called HISTORY_STEP_ADDED.", e.current);
            listHistorySteps.value = e.current;
        },

        "HISTORY_UNDONE": function (e) {
            console.log("called HISTORY_UNDONE.");
            listHistorySteps.value = e.previous;

        },

        "HISTORY_REDONE": function (e) {
            console.log("called HISTORY_REDONE.");
            listHistorySteps.value = e.redone;
        },

        "DELETE_CMP": {
            do: function (e) {
                console.log('delete component', this.id);
                let domID;
                e.preventDefault();
                //if is pressed delete
                if (activeComponent) {
                    if (e.keyCode == 46) {
                        //domId of element who should delete
                        domID = activeComponent.domID;
                    } else {
                        //if drop to delete area
                        domID = e.originalEvent.dataTransfer.getData("domID");
                    }
                    let inst = Component.instances[domID];
                    let c = confirm("Do you want to delete " + inst.id.toUpperCase() + "?");
                    if (c) {
                        inst.parent.removeChild(inst, 2);
                        propertyEditorContainer.components = [];
                    }
                    activeComponent = null;
                } else {
                    alert("Please select component you want to delete.");
                }

            },
            undo: function () {
                //undo
            }
        },

        "TOGGLE_VISIBILITY_LEFT": {
            do: function (e) {
                componentsContainer.toggleVisibility();
            }

        },

        "TOGGLE_VISIBILITY_RIGHT": {
            do: function (e) {
                rightSideNav.toggleVisibility();
            }

        },

        "SPLIT_HOR": {
            //description: "Split selected container horizontally",
            description: "Ndaje horizontalisht",
            do: function (e) {
                let retFromRedoMaybe = arguments[arguments.length - 1];
                if (retFromRedoMaybe.container) {
                    activeContainer = retFromRedoMaybe.container;
                    console.log("called SPLIT_HOR from History(REDO).");
                }
                console.log("Split Selected Container Horizontally");
                let ret = {
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
                                id: 'workArea',
                                classes: ["border", "col"],
                                attr: {
                                    "isWa": true
                                }
                            }
                        }]
                    }
                };
                let newRow2;
                if (activeContainer.ctor == "Form" || (objectHierarchyGetMatching(activeContainer, "ctor", "Form", "parent", 1))["match"] != null) {
                    newRow.props.type = ContainerType.FORM_ROW;
                }
                if (activeContainer.components.length == 0) {
                    newRow2 = extend(true, newRow);
                }
                let newRowInstance;
                if (retFromRedoMaybe.child) {
                    newRowInstance = retFromRedoMaybe.child;
                    activeContainer.addChild(newRowInstance);
                } else {
                    newRowInstance = activeContainer.addComponent(newRow);
                    newRowInstance.attr.isWa = true;
                }

                let newWorkArea = newRowInstance.children[newRowInstance.components[0].props.id];
                applet.addBehaviors(newWorkArea, cmpWaBehaviors, false);
                // app.behaviors[newWorkArea.id]["mousemove"]["WA_RESIZE_EW"] = isMouseMoveEW;
                //{filter: isMouseMoveEw, otherProperties...}

                if (activeContainer.components.length == 1) {
                    let newRowInstance2;
                    if (retFromRedoMaybe.child2) {
                        newRowInstance2 = retFromRedoMaybe.child2;
                        activeContainer.addChild(newRowInstance2);
                    } else {
                        newRowInstance2 = activeContainer.addComponent(newRow2);
                        newRowInstance2.attr.isWa = true;
                    }

                    let newWorkArea2 = newRowInstance2.children[newRowInstance2.components[0].props.id];
                    applet.addBehaviors(newWorkArea2, cmpWaBehaviors, false);
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
                let ret = arguments[arguments.length - 1];
                ret.parent.removeChild(ret.child, 0);
                if (ret.child2) {
                    ret.parent.removeChild(ret.child2, 0);
                }
                childrenAutoHeight(ret.parent);
            }
        },

        "SPLIT_VERT": {
            description: "Split selected container vertically",
            do: function (e) {
                let retFromRedoMaybe = arguments[arguments.length - 1];
                console.log(retFromRedoMaybe);
                if (retFromRedoMaybe.container) {
                    activeContainer = retFromRedoMaybe.container;
                    console.log("called SPLIT_VERT from History(REDO).");
                }
                console.log("Split Selected Container Vertically");
                let ret = {
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
                                    id: 'workArea',
                                    classes: ["border", "col"],
                                    attr: {
                                        "isWa": true
                                    }
                                }
                            },
                            {
                                ctor: Container,
                                props: {
                                    type: ContainerType.COLUMN,
                                    id: 'workArea',
                                    classes: ["border", "col"],
                                    attr: {
                                        "isWa": true
                                    }
                                }
                            }
                        ]
                    }
                };

                let newCell = {
                    ctor: Container,
                    props: {
                        type: ContainerType.COLUMN,
                        id: 'workArea',
                        classes: ["border", "col"],
                        attr: {
                            "isWa": true
                        }
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
                    parent = activeContainer.children[activeContainer.csorted[0]];

                }
                let children_len = parent.components.length;

                if (children_len < 12) {
                    let newInstance;
                    if (retFromRedoMaybe.child) {
                        newInstance = retFromRedoMaybe.child;
                        parent.addChild(newInstance);
                    } else {
                        parent.addComponents(toAdd).then((ra) => {
                            newInstance = ra[0];
                            ret.child = newInstance;
                            newInstance.attr.isWa = true;
                            applet.addBehaviors(newInstance, cmpWaBehaviors, true);
                        });

                    }
                    ret.parent = parent;
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
                let ret = arguments[arguments.length - 1];
                ret.parent.removeChild(ret.child[0], 0);
                //childrenAutoWidth(ret.parent);
            }
        },

        "BECOME_ACTIVE": {
            do: function (e) {
                console.log("Container Became active");
                //this will holde the instance of the component who manifested this behavior (the manifestor)
                if (activeContainer && activeContainer != this && activeContainer.classes.indexOf("active-container") > -1) {
                    let classes = activeContainer.classes.slice(0);
                    let ind = classes.indexOf("active-container");
                    if (id > -1) {
                        classes.splice(ind, 1);
                    }
                    activeContainer.classes = classes;
                }
                let classes = this.classes.slice(0);
                classes.pushUnique("active-container");
                this.classes = classes;
                activeContainer = this;
                if (this.id == "workAreaColumnL2") {
                    //Builder.metaProps.form_name.props.change(data.selectedForm, this);
                    // let oeLit = {
                    //     ctor: ObjectEditor,
                    //     "props": {
                    //         id: "objectEditor",
                    //         instance: data.selectedForm,
                    //         field: "props"
                    //     }
                    // };
                    propertyEditorContainer.components = [];
                }
            },
            stopPropagation: true
        },

        "WA_HOVER": {
            do: function (e) {
                console.log("Container hovered " + this.id);
                //this will hold the instance of the component who manifested this behavior (the manifestor)
                let classes = this.classes.slice(0);
                classes.toggle("hovered");
                this.classes = classes;
            },
            stopPropagation: true
        },

        "IS_WA_RESIZE_NS": {
            do: function (e) {
                console.log("Container Resize NS");

            },
            stopPropagation: true
        },

        "WA_RESIZE": {
            do: function (e) {
                let retFromRedoMaybe = arguments[arguments.length - 1];
                if (retFromRedoMaybe.container) {
                    console.log("called WA_RESIZE from History(REDO).");
                } else
                    console.log("WA_RESIZE");
                let ret = {
                    track: false
                };

                let manifestor = this,
                    dy = e.dy,
                    dx = e.dx;
                containerResize(manifestor, dx, dy);
                ret.description = "Container resize" + (dx ? " dx:" + dx : "") + (dy ? " dy:" + dy : "");
                ret.track = true;
                return ret;
            },
            undo: function (e) {
                console.log("Undo WA_RESIZE ", arguments);
                let manifestor = this,
                    dy = e.dy,
                    dx = e.dx;
                containerResize(manifestor, -1 * dx, -1 * dy);
            },
            stopPropagation: true
        },

        "WA_REMOVE": {
            description: "Container Removed",
            do: function (e) {
                let retFromRedoMaybe = arguments[arguments.length - 1];
                if (retFromRedoMaybe.container) {
                    console.log("called WA_REMOVE from History(REDO).");
                }
                let ret = {
                    track: false
                };
                console.log("Container REMOVE ", arguments);
                let c = true;
                if (this.components.length > 0) {
                    c = confirm("Container has children, still want to remove ?");
                }
                if (c) {
                    if (this.parent.parent.components.length == 1) {
                        if (this.parent.components.length > 2) {
                            let row = this.parent;
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
                            let container = this.parent.parent;
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
                let ret = arguments[arguments.length - 1];
                ret.container.addChild(ret.child);
                if (ret.removeType == "COLUMN") {
                    childrenAutoWidth(ret.container);
                } else {
                    childrenAutoHeight(ret.container);
                }
            },
            stopPropagation: true
        },

        "PREVIEW": {
            do: function (e) {
                let lit = workAreaColumn.literal;
                stripHandle(lit);
                let jsonLayout = JSON.stringify(lit, null, "\t");
                download("workAreaColumn.json.txt", jsonLayout);
            },
            stopPropagation: true
        },

        "SAVE_LAYOUT": {
            do: function (e) {
                let lit = workAreaRowL2.literal;
                stripHandle(lit);
                let jsonLayout = JSON.stringify(lit, null, "\t");
                download("workAreaColumn.json.txt", jsonLayout);
            },
            stopPropagation: true
        },

        "WA_UNDO": {
            do: function (e) {
                console.log("UNDO");
                app.history.undo();
            },
            stopPropagation: false
        },

        "WA_REDO": {
            do: function (e) {
                console.log("REDO");
                app.history.redo();
            },
            stopPropagation: false
        },

        "DUPLICATE_CMP": function (e) {
            if (activeComponent && activeComponent.attr.isCmp) {
                let lit = activeComponent.literal;
                lit = extend(true, lit);
                let inst = activeComponent.parent.addComponent(lit);
                applet.addBehaviors(inst, cmpWaBehaviors, false);
                inst.draggable = true;
                let isCont = isContainer.call(inst);
                if (isCont) {
                    inst.attr.isNotWa = true;
                }
            } else {
                console.log("Nothing to duplicate");
            }
        }
    };


    /**
     * Behavior Filters below
     */
    let isContainer = function (e) {
        return containers.indexOf(this.ctor) > -1;
    };
    let isNotContainer = function (e) {
        return !isContainer.call(this, e);
    };

    let isNotDraggableContainer = function (e) {
        return this.attr.isWa || (containers.indexOf(this.ctor) > -1 && this.draggable == false);
    };

    let isDraggable = function (e) {
        return this.draggable == true && !this.attr.isWa;
    }
    //filter to determine if mousemove is an "WA_RESIZE_NS" behavior
    let debouncedDragNS;
    let d0;

    let isMouseMoveNS = function (e) {
        if (((e.which && e.which == 1) || (e.buttons && e.buttons == 1)) && (this.parent.parent.components.length >= 2 || this.parent.components.length >= 2)) {
            let manifestor = this;
            let classes = manifestor.classes.slice(0);
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
                let p0 = {
                    x: e.pageX,
                    y: e.pageY
                };
                console.log("prior of debounced");
                console.log(p0);
                debouncedDragNS = debounce(function (e) {
                    console.log("debounced");
                    let p1 = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    console.log(p0);
                    console.log(p1);
                    let dy = p1.y - p0.y;
                    let dx = p1.x - p0.x;
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

                    let classes = manifestor.classes.slice(0);
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
            // let i = this.classes.indexOf("ns-resize")
            // if(i>0){
            let classes = this.classes.slice(0);
            classes = classes.difference(["ns-resize", "ew-resize"]);
            //classes.splice(i, 1);
            this.classes = classes;
            //}

        }
    };

    //behavior can cause another behavior (throws custom event, so we may avoid filter functions...)


    //utility functions


    let childrenAutoWidth = function (container) {
        let children_len = container.components.length;
        let colSpan = Math.floor(12 / children_len);
        let delta = 12 - colSpan * children_len;
        let i = 0;
        for (let childID in container.children) {
            ++i;
            if (i == children_len - 1)
                container.children[childID].spacing.colSpan = colSpan + delta;
            else
                container.children[childID].spacing.colSpan = colSpan;
        }
    };

    let childrenAutoHeight = function (container) {
        let children_len = container.components.length;
        let height = Math.floor(100 / children_len);
        let delta = 100 - height * children_len;
        let i = 0;
        for (let childID in container.children) {
            ++i;
            if (i == children_len - 1)
                container.children[childID].spacing.h = height + delta;
            else
                container.children[childID].spacing.h = height;
        }
    };

    let containerResize = function (container, dx, dy) {
        if (dy && !isNaN(dy) && dy != 0 && container.parent.parent.components.length >= 2) {
            let mpi = ArrayUtils.indexOfObject(container.parent.parent.components, "props.id", container.parent.id);
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
            let mpi = ArrayUtils.indexOfObject(container.parent.components, "props.id", container.id);
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
    };

    let noNeedClasses = ["selected-component", "default-component", "border", "active-container"];

    let stripHandle = function (lit) {
        if (lit.props["components"] && Array.isArray(lit.props["components"]))
            for (let i = 0; i < lit.props.components.length; i++) {
                if (lit.props.components[i].props["attr"] && lit.props.components[i].props.attr["handle"]) {
                    lit.props.components[i] = lit.props.components[i].props.components[0];
                }

                if (lit.props.components[i].props["classes"] && lit.props.components[i].props.classes.length > 0) {
                    let diffClasses = lit.props.components[i].props.classes.difference(noNeedClasses);
                    lit.props.components[i].props.classes = diffClasses;
                }

                if (lit.props.components[i].props["components"] && Array.isArray(lit.props.components[i].props["components"]))
                    stripHandle(lit.props.components[i]);
            }
    };

    let daBehaviors = {
        "mouseover": "WA_HOVER",
        "mouseout": "WA_HOVER",
        "drop": {
            "DELETE_CMP": {
                filter: undefined,
                onPropagation: true
            },
            "TOGGLE_BIN": {
                filter: undefined,
                onPropagation: true
            }
        },
        "dragover": "ALLOW_DROP",
        "dragleave": "TOGGLE_BIN"
    };

    let vspewbehaviors = {
        "dragover": "TOGGLE_BIN",
    };

    let cmpWaBehaviors = {
        "mousedown": {
            "WA_PREVENT_DRAGSTART": isNotDraggableContainer,
            "BECOME_ACTIVE": isContainer,
            "SELECT_COMPONENT": (e) => {
                return ((e.which && e.which == 1) || (e.buttons && e.buttons == 1));
            }
        },
        "mouseover": {
            "WA_HOVER": isContainer
        },
        "mouseout": {
            "WA_HOVER": isContainer
        },
        "mousemove": {
            "IS_WA_RESIZE_NS": isMouseMoveNS
        },
        "resize": {
            "WA_RESIZE": isContainer
        },
        "contextmenu": {
            "WA_REMOVE": isContainer
        },
        "drop": {
            "ADD_COMPONENT": isContainer
        },
        "dragover": {
            "ALLOW_DROP": isContainer
        },
        "dragstart": {
            "DRAGSTART_COMPONENT": {
                filter: isDraggable,
                onPropagation: false
            }
        },
        "dropped": "SELECT_COMPONENT"

    };

    return imp;
};
Implementation.ctor = "Implementation";
export {
    Implementation
};