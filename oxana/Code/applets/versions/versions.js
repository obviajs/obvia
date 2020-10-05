let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal, selectedEventVersion, dataGrid, diffButton;
    let eventData;


    let imp = {
        "BEGIN_DRAW": async function (e) {
            let paths = findMember(applet.literal, "id", [], "dataGrid", false);
            paths[0].pop();
            let propsVersionsDataGrid = getChainValue(applet.literal, paths[0]);
            let events = new GaiaAPI_events();
        },

        "END_DRAW": function (e) {
            modal = applet.view;
            let modalBody = modal.modalDialog.modalContent.modalBody;

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
    };

    let drawGrid = async function (e) {
        let versionsFormsEvent = new GaiaAPI_events();
        eventData = {
            id_process: CodeEditor.processId,
            form_guid: CodeEditor.formsList,
            field_guid: CodeEditor.formsComponentsList,
        };

        let result = await versionsFormsEvent.loadScriptFileClient.post(eventData);
        let versions = new ArrayEx(result.versions);
        dataGrid.dataProvider.splicea(0, 0, versions);
        modal.modalDialog.modalContent.modalBody.dataGrid.updateDisplayList();
    };

    let selectVersion = async function (e) {
        if (dataGrid.selectedItems.length > 0) {
            selectedEventVersion = dataGrid.selectedItems[0];
            let doc = new GaiaAPI_documents();
            CodeEditor.revisionId = selectedEventVersion.id;
            let eventContent = await doc.getRevisionContentClient.get(selectedEventVersion.id);
            let baseContent = atob(eventContent.content);
            let evt = new jQuery.Event("loadContent");
            evt.content = baseContent;
            modal.trigger(evt);
        } else {
            alert("Nothing selected.");
        }
    };

    return imp;
};

Implementation.ctor = "Implementation";
export {
    Implementation
};