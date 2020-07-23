let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;

    let ideContainer, sideNav, cmCnt, cmCollapse, componentModelTree, todosCnt, todosCollapse, todosRepeater, code, collapseBtn, deployBtn, todoComponent, todoItem, modal, dataGrid, diffButton;

    let imp = {
        "BEGIN_DRAW": function (e) {
            console.log("APPLET_BEGIN_DRAW");
            let paths = findMember(applet.literal, "id", [], "componentModelTree", false);
            paths[0].pop();
            let propsComponentTree = getChainValue(applet.literal, paths[0]);
            propsComponentTree.dataProvider = new ArrayEx([]);

            paths = findMember(applet.literal, "id", [], "todosRepeater", false);
            paths[0].pop();
            let propsTodosRepeater = getChainValue(applet.literal, paths[0]);
            propsTodosRepeater.dataProvider = new ArrayEx([]);

            paths = findMember(applet.literal, "id", [], "dataGrid", false);
            paths[0].pop();
            let dataGridDataProvider = getChainValue(applet.literal, paths[0]);
            dataGridDataProvider.dataProvider = new ArrayEx([]);
        },
        "END_DRAW": function (e) {
            modal = app.container.mainContainer.versionSelectModal;
            ideContainer = app.container.mainContainer.ideContainer;
            collapseBtn = app.container.mainContainer.mainNav.myCollapseBtn;
            deployBtn = app.container.mainContainer.mainNav.deployBtn;
            sideNav = ideContainer.mySideNav;
            cmCnt = sideNav.cmCnt;
            cmCollapse = cmCnt.cmCollapse;
            componentModelTree = cmCnt.componentModelTree;
            todosCnt = sideNav.todosCnt;
            todosCollapse = todosCnt.todosCollapse;
            todosRepeater = todosCnt.todosRepeater;
            code = ideContainer.myCode;

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

            applet.addBehaviors(todosRepeater, {
                "rowAdd": "TODOS"
            });

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

    return imp;

};
Implementation.ctor = "Implementation";
export {
    Implementation
};