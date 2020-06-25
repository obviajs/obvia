let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal, modalBody;

    let imp = {

        "BEGIN_DRAW": function (e) {},

        "END_DRAW": function (e) {
            modal = applet.view;

            applet.addBehaviors(modal, {
                "accept": "SAVE_FORM"
            }, false);

            modalBody = modal.modalDialog.modalContent.modalBody;
            let saveNewButton = modal.modalDialog.modalContent.modalFooter.saveNew;
            let selectedForm = data.selectedForm;

            applet.addBehaviors(saveNewButton, {
                "click": "SAVE_NEW"
            }, false);

        },

        "SAVE_FORM": async function (e) {
            e.preventDefault();
            e.stopPropagation();
            let result = await ValidationManager.getInstance().validate();
            if (result[0]) {
                var gaiaForm = new GaiaAPI_forms();
                let promise = gaiaForm.formsClient.post(data.selectedForm)
                promise.then(function (res) {
                    modal.hide();
                });
                promise.catch(function (err) {
                    modalBody.find('info').visible = true;
                });
            }
        },

        "SAVE_NEW": async function (e) {
            e.preventDefault();
            e.stopPropagation();
            let result = await ValidationManager.getInstance().validate();
            if (result[0]) {
                var gaiaForm = new GaiaAPI_forms();
                let promise = gaiaForm.formsClient.post(data.selectedForm);
                promise.then(function (res) {
                    modalBody.find('info').visible = false;
                    data.selectedForm = new FormProperties();
                    data.workArea.removeAllChildren(0);
                    modal.hide();
                    modal.modalDialog.modalContent.modalBody.find("textField").value = "";
                    modal.modalDialog.modalContent.modalBody.find("textarea").value = "";
                });
                promise.catch(function (err) {
                    modalBody.find('info').visible = true;
                });
            }
        }
    };

    return imp;

};
Implementation.ctor = "Implementation";
export {
    Implementation
};