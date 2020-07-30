let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal, selectedEventVersion, dataGrid, diffButton;


    let imp = {
        "BEGIN_DRAW": function (e) {},

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

    let drawGrid = function (e) {
        modal.modalDialog.modalContent.modalBody.dataGrid.updateDisplayList();
    };

    let selectVersion = function (e) {
        if (modal.modalDialog.modalContent.modalBody.dataGrid.selectedItems.length > 0) {
            selectedEventVersion = modal.modalDialog.modalContent.modalBody.dataGrid.selectedItems[0];
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