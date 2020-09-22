let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal, modalBody, info, formName, formDescription;

    let imp = {

        "BEGIN_DRAW": function (e) {},

        "END_DRAW": function (e) {
            modal = applet.view;

            applet.addBehaviors(modal, {
                "accept": "SAVE_FORM"
            }, false);

            modalBody = modal.modalDialog.modalContent.modalBody;
            let saveNewButton = modal.modalDialog.modalContent.modalFooter.saveNew;
            info = modalBody.find('info');
            formName = modalBody.find("textField");
            formDescription = modalBody.find("textarea");


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
                let promise = gaiaForm.formsClient.post(data.selectedForm);
                promise.then(function (res) {
                    info.visible = false;
                    modal.hide();
                });
                promise.catch(function (err) {
                    info.visible = true;
                });
            } else {
                info.visible = true;
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
                    info.visible = false;
                    data.selectedForm = new FormProperties();
                    data.workArea.removeAllChildren(0);
                    modal.hide();
                    formName.value = "";
                    formDescription.value = "";
                });
                promise.catch(function (err) {
                    info.visible = true;
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