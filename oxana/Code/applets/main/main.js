let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;

    let ideContainer, sideNav, cmCnt, cmCollapse, componentModelTree, todosCnt, todosCollapse, todosRepeater, code, collapseBtn, deployBtn, todoComponent, todoItem, modal, dataGrid, diffButton, formsList, formsComponentsList, eventsList;
    let _processForms = new ArrayEx(data.processForms);
    let imp = {
        "BEGIN_DRAW": async function (e) {
            console.log("APPLET_BEGIN_DRAW");

            let paths = findMember(applet.literal, "id", [], "todosRepeater", false);
            paths[0].pop();
            let propsTodosRepeater = getChainValue(applet.literal, paths[0]);
            propsTodosRepeater.dataProvider = new ArrayEx([]);

            paths = findMember(applet.literal, "id", [], "dataGrid", false);
            paths[0].pop();
            let dataGridDataProvider = getChainValue(applet.literal, paths[0]);
            dataGridDataProvider.dataProvider = new ArrayEx([]);

            paths = findMember(applet.literal, "id", [], "forms", false);
            paths[0].pop();
            let formsDataProvider = getChainValue(applet.literal, paths[0]);
            formsDataProvider.dataProvider = _processForms;
        },
        "END_DRAW": function (e) {
            modal = app.container.mainContainer.versionSelectModal;
            ideContainer = app.container.mainContainer.ideContainer;
            collapseBtn = ideContainer.buttonsSide.myCollapseBtn;
            deployBtn = ideContainer.buttonsSide.deployBtn;
            sideNav = ideContainer.mySideNav;
            cmCnt = sideNav.cmCnt;
            cmCollapse = cmCnt.cmCollapse;
            componentModelTree = cmCnt.componentModelTree;
            todosCnt = sideNav.todosCnt;
            todosCollapse = todosCnt.todosCollapse;
            todosRepeater = todosCnt.todosRepeater;
            code = ideContainer.myCode;
            formsList = app.container.mainContainer.mainNav.forms;
            formsComponentsList = app.container.mainContainer.mainNav.formsComponentsList;
            eventsList = app.container.mainContainer.mainNav.eventsList;

            applet.addBehaviors(collapseBtn, {
                "click": {
                    "SIDE_NAV_TOGGLE_VISIBILITY": {
                        onPropagation: true
                    }
                }
            }, false);

            applet.addBehaviors(code, {
                "changes": "CHANGES_MADE"
            }, false);

            applet.addBehaviors(formsList, {
                "change": "PROCESS_FORMS_COMPONENTS"
            }, false);

            applet.addBehaviors(formsComponentsList, {
                "change": "EVENTS_LIST"
            }, false);

            applet.addBehaviors(todosRepeater, {
                "rowAdd": "TODOS"
            }, false);

            applet.addBehaviors(componentModelTree, {
                "click": "COMPONENT_MODEL_TREE_CLICK"
            }, false);

            applet.addBehaviors(modal, {
                "displayListUpdated": "DRAW_GRID"
            }, false);

            applet.addBehaviors(modal, {
                "accept": "SELECT_VERSION"
            }, false);
            dataGrid = modal.modalDialog.modalContent.modalBody.dataGrid;
            applet.addBehaviors(dataGrid, {
                "rowDblClick": "SELECT_VERSION"
            }, false);
            diffButton = modal.modalDialog.modalContent.modalFooter.diffButton;
            applet.addBehaviors(diffButton, {
                "click": "DIFF_WITH_SELECT"
            }, false);

            componentModelTree.afterAttach = function () {
                cmCollapse.href = "#" + this.domID;
            };

            todosRepeater.afterAttach = function () {
                todosCollapse.href = "#" + this.domID;
            };

            componentModelTree.afterAttach();
            todosRepeater.afterAttach();

        },

        "TODOS": function (e, r, ra) {
            if (ra) {
                applet.addBehaviors(ra.currentRow.todoItem, {
                    "click": "TODO_ITEM_CLICK"
                });
            }
        },

        "PROCESS_FORMS_COMPONENTS": async function (e) {
            let form_id = this.value;
            let gaiaForm = new GaiaAPI_forms();
            let form = await gaiaForm.formsClient.get(form_id);
            let cmInstance = Component.fromLiteral(form[0].form_literal);
            formsComponentsList.dataProvider.splicea(0, formsComponentsList.dataProvider.length, new ArrayEx());
            cmInstance.renderPromise().then(function (instance) {
                let cmDp = initComponentModel(instance.workAreaColumnL2);
                let frmsDP = initComponentList(instance.workAreaColumnL2.children);
                componentModelTree.dataProvider = cmDp;
                formsComponentsList.dataProvider.splicea(0, 0, frmsDP);
            });
        },

        'EVENTS_LIST': function (e) {
            console.log("here");
        },


        "SIDE_NAV_TOGGLE_VISIBILITY": {
            do: function (e) {
                sideNav.toggleVisibility();
            }
        },

        "CHANGES_MADE": {
            do: function (e) {
                _debouncedHandler(e.cmInst);
            }
        },

        "TODO_ITEM_CLICK": {
            do: function (e, ra) {
                todoItemClick(e, ra);
            }
        },

        "COMPONENT_MODEL_TREE_CLICK": {
            do: function (e) {
                componentModelTree_click(e);
            }
        },

        "DRAW_GRID": {
            do: function (e) {
                drawGrid(e);
            }
        },

        "SELECT_VERSION": {
            do: function (e) {
                selectVersion(e);
            }
        },

        "DIFF_BUTTON": {
            do: function (e) {
                diffWithSelected(e);
            }
        }
    };

    let _debouncedHandler = debounce(function (cmInst) {
        let todos = new ArrayEx([]);
        let len = cmInst.lineCount();
        for (let i = 0; i < len; i++) {
            let lnTokens = cmInst.getLineTokens(i);
            let lenInner = lnTokens.length;
            for (let j = 0; j < lenInner; j++) {
                if (lnTokens[j].type == "comment") {

                    let abvr = (lnTokens[j].string.substr(0, 6)).toUpperCase();
                    let commentType;
                    switch (abvr) {
                        case "//TODO":
                            commentType = 1;
                            break;
                        case "//NOTE":
                            commentType = 2;
                            break;
                        case "//ATTN":
                            commentType = 3;
                            break;
                            //case "//FIXME": commentType = 4; break;
                        default:
                            continue;
                    }
                    let comment = lnTokens[j].string.substr(7, lnTokens[j].string.length);
                    todos.push({
                        "line": i,
                        "commentType": commentType,
                        "comment": comment
                    });
                }
            }
            // todosRepeater.dataProvider = todos;
            console.log(todos);
        }
        todosRepeater.dataProvider = todos;
    }, 500);

    let todoItemClick = function (e, ra) {
        code.cmInst.focus();
        code.cmInst.scrollIntoView({
            line: ra.currentItem.line,
            ch: 0
        }, 200);
        code.cmInst.setCursor({
            line: ra.currentItem.line,
            ch: 0
        });
    };

    let componentModelTree_click = function (e) {
        let rpp = 10;
        let _raVersions = new RemoteArray({
            url: "https://api.myjson.com/bins/7eax0",
            post: {
                "testKey": "testValue"
            },
            recordsPerPage: rpp,
            method: "GET"
        });
        let _dpVersions = new ArrayEx(_raVersions);
        _dpVersions.on("propertyChange", function (e) {
            if (e.property == "length") {
                if (e.newValue > 0) {
                    modal.modalDialog.modalContent.modalBody.dataGrid.dataProvider = _dpVersions;
                    modal.show();
                } else {
                    //create default function
                }
            }
        });
    };

    let drawGrid = function (e) {
        modal.modalDialog.modalContent.modalBody.dataGrid.updateDisplayList();
    };

    let selectedEventVersion;

    let selectVersion = function (e) {
        if (modal.modalDialog.modalContent.modalBody.dataGrid.selectedItems.length > 0) {
            selectedEventVersion = modal.modalDialog.modalContent.modalBody.dataGrid.selectedItems[0];
        } else {
            alert("Nothing selected.");
        }
    };

    let diffWithSelected = function (e) {

    };

    function initComponentModel(cmInstance) {
        let nonDisplayEvents = ["beginDraw", "endDraw", "init", "beforeAttach", "afterAttach", "DOMMutation"];
        let dp = new ArrayEx();
        let node = {};
        node.nodeType = 1; //component
        node.label = cmInstance.props.id;
        node.ctor = cmInstance.ctor;
        node.children = new ArrayEx();

        for (let i = 0; i < cmInstance.events.length; i++) {
            for (let evt in cmInstance.events[i].events) {
                if (nonDisplayEvents.indexOf(evt) == -1) {
                    let cNode = {
                        "nodeType": 2,
                        "label": evt,
                        "iconClasses": ["fas", "fa-code"]
                    };
                    node.children.push(cNode);
                }
            }

        }

        for (let cid in cmInstance.children) {
            node.children.splicea(node.children.length, 0, initComponentModel(cmInstance.children[cid]));
        }
        dp.push(node);
        return dp;
    }

    function initComponentList(cmInstance) {
        let dp = new ArrayEx();
        let node = {};
        for (let cid in cmInstance) {
            node = {
                "ctor": cmInstance[cid].id,
                "label": cid,
                "forms_literal": cmInstance[cid]
            }
            dp.push(node);
        }
        return dp;
    }

    return imp;

};
Implementation.ctor = "Implementation";
export {
    Implementation
};