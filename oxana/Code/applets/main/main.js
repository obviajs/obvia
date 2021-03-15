let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;

    let formId, componentLabel;

    let ideContainer, sideNav, cmCnt, cmCollapse, componentModelTree, todosCnt, todosCollapse, todosRepeater, code, collapseBtn, deployBtn, versionsBtn, removeBtn, uploadBtn, todoComponent, todoItem, modal, dataGrid, diffButton, formsList, formsComponentsList, eventsList, behaviorsDropEdit;
    let _processForms = data.processForms;
    let imp = {
        "BEGIN_DRAW": async function (e) {
            console.log("APPLET_BEGIN_DRAW");

            let paths = findMember(applet.literal, "id", [], "todosRepeater", false);
            paths[0].pop();
            let propsTodosRepeater = getChainValue(applet.literal, paths[0]);
            propsTodosRepeater.dataProvider = new ArrayEx([]);

            paths = findMember(applet.literal, "id", [], "forms", false);
            paths[0].pop();
            let formsDataProvider = getChainValue(applet.literal, paths[0]);
            formsDataProvider.dataProvider = _processForms;

            paths = findMember(applet.literal, "id", [], "behaviorsDropEdit", false);
            paths[0].pop();
            let behaviorsDataProvider = getChainValue(applet.literal, paths[0]);
            behaviorsDataProvider.dataProvider = _processForms;
        },
        "END_DRAW": function (e) {
            modal = app.container.mainContainer.versionSelectModal;
            ideContainer = app.container.mainContainer.ideContainer;
            collapseBtn = ideContainer.buttonsSide.myCollapseBtn;
            versionsBtn = ideContainer.buttonsSide.versionsBtn;
            deployBtn = ideContainer.buttonsSide.deployBtn;
            removeBtn = ideContainer.buttonsSide.removeBtn;
            uploadBtn = ideContainer.buttonsSide.uploadBtn;
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
            behaviorsDropEdit = app.container.mainContainer.mainNav.behaviorsDropEdit;

            applet.addBehaviors(collapseBtn, {
                "click": {
                    "SIDE_NAV_TOGGLE_VISIBILITY": {
                        onPropagation: true
                    }
                }
            }, false);

            applet.addBehaviors(code, {
                "endDraw": "FOCUS_EDITOR"
            }, false);

            applet.addBehaviors(code, {
                "changes": "CHANGES_MADE"
            }, false);

            applet.addBehaviors(eventsList, {
                "change": "INIT_BEHAVIOR_CODE"
            }, false)

            applet.addBehaviors(formsList, {
                "change": "PROCESS_FORMS_COMPONENTS"
            }, false);

            applet.addBehaviors(formsComponentsList, {
                "change": "EVENTS_LIST"
            }, false);

            applet.addBehaviors(versionsBtn, {
                click: {
                    "SHOW_VERSIONS": {
                        onPropagation: true
                    }
                }
            }, false);

            applet.addBehaviors(uploadBtn, {
                "click": {
                    "UPLOAD_EVENT": {
                        onPropagation: true
                    }
                }
            }, false);

            applet.addBehaviors(removeBtn, {
                click: "DELETE_EVENT"
            }, false);

            applet.addBehaviors(deployBtn, {
                "click": {
                    "DEPLOY_EVENT": {
                        onPropagation: true
                    }
                }
            });


            applet.addBehaviors(todosRepeater, {
                "rowAdd": "TODOS"
            }, false);

            applet.addBehaviors(componentModelTree, {
                "click": "COMPONENT_MODEL_TREE_CLICK"
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

        "FOCUS_EDITOR": function (e) {
            code.cmInst.focus();
            code.content = "//Choose an event to begin with (F11 to go fullscreen)";
            formsComponentsList.attr.disabled = true;
            eventsList.attr.disabled = true;

        },

        "INIT_BEHAVIOR_CODE": async function (e) {
            let ex_tem = `function form_${formId}_${componentLabel}_${eventsList.value} (e) {
            //your code here;
        }`;

            CodeEditor.eventId = this.value;
            code.content = ex_tem;
        },


        "PROCESS_FORMS_COMPONENTS": async function (e) {
            let form_guid = this.value;
            CodeEditor.form_guid = form_guid;
            let gaiaForm = new GaiaAPI_forms();
            let form = await gaiaForm.formsClient.get(form_guid);
            formId = form[0].form_id;
            let cmInstance = Component.fromLiteral(form[0].form_literal);
            formsComponentsList.dataProvider.splicea(0, formsComponentsList.dataProvider.length, new ArrayEx());
            eventsList.dataProvider.splicea(0, eventsList.dataProvider.length, new ArrayEx());
            cmInstance.render().then(function (instance) {
                let cmDp = initComponentModel(instance.workAreaColumnL2);
                let frmsDP = initComponentList(instance.workAreaColumnL2.children);
                componentModelTree.dataProvider = cmDp;
                formsComponentsList.dataProvider.splicea(0, 0, frmsDP);
                formsComponentsList.attr.disabled = false;
            });
        },

        'EVENTS_LIST': async function (e) {
            CodeEditor.formsList = formsList.value;
            CodeEditor.formsComponentsList = formsComponentsList.value;
            let dpEvents = new ArrayEx();
            let events = new GaiaAPI_events();
            let eventsForm = await events.events_cteClient.get(CodeEditor.processId, CodeEditor.form_guid);
            eventsList.dataProvider.splicea(0, eventsList.dataProvider.length, new ArrayEx());
            for (let i = 0; i < this.dataProvider.length; i++) {
                if (this.dataProvider[i].field_guid === this.value) {
                    componentLabel = this.dataProvider[i].label;
                }
            }
            let eventList = eventsForm.dedupe("eventType");
            let objEvents = {};
            for (let i = 0; i < eventList.result.length; i++) {
                objEvents = {
                    eventType: eventList.result[i].eventtype,
                    eventId: eventList.result[i].frontendevent_id
                };
                dpEvents.push(objEvents);
            }
            eventsList.dataProvider.splicea(0, 0, dpEvents);
            eventsList.attr.disabled = false;
        },


        "SHOW_VERSIONS": function (e) {
            app.appletsMap["versions"].init().then(() => {
                applet.addBehaviors(app.appletsMap["versions"].view, {
                    "loadContent": "LOAD_CONTENT"
                });
            });
        },

        "LOAD_CONTENT": function (e) {
            if (e.content) {
                code.content = e.content;
            }
        },

        "UPLOAD_EVENT": async function (e) {
            if (code.errors.length == 0) {
                // let id_form = formsList.value;
                // let fields_id = new GaiaAPI_forms();
                // let field_id = await fields_id.getFormFieldsClient.get(id_form);
                let apiEvents = new GaiaAPI_events();
                let event = {
                    form_guid: formsList.value,
                    field_guid: formsComponentsList.value,
                    content: code.content,
                    behavior_name: `form_${formId}_${componentLabel}_${eventsList.value}`,
                    id_process: CodeEditor.processId,
                    file_name: `form_${formId}_${componentLabel}_${eventsList.value}`,
                    event_id: CodeEditor.eventId
                };
                let result = await apiEvents.saveScriptFileClient.post(event);
                CodeEditor.revisionId = result.versions[0].id;
                console.log(result);
            } else {
                console.log("Your code contains errors. Fix them and then save");
            }
        },

        "DELETE_EVENT": function (e) {
            console.log("DELETE_EVENT");
        },

        "DEPLOY_EVENT": async function (e) {
            if (code.errors.length > 0) {
                console.log("Your code contains errors. Fix them and then save");
            } else {
                let deployEvent = new GaiaAPI_events();
                let eventToDeploy = await deployEvent.deployScriptFileClient.post(CodeEditor.revisionId, CodeEditor.processId);
                console.log(eventToDeploy);
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
                "field_guid": cmInstance[cid].guid,
                "forms_literal": cmInstance[cid]
            };
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