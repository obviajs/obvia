let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal;
    let modalBody;
    let info;

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

            let oeLit = {
                ctor: ObjectEditor,
                "props": {
                    id: "objectEditor",
                    instance: selectedForm
                }
            };
            let reqFV = {
                ctor: RequiredFieldValidator,
                props: {
                    controlToValidate: "textField",
                    errorMessage: "Form name is required",
                    setFocusOnError: true
                }
            };

            info = {
                ctor: Label,
                props: {
                    id: "info",
                    label: "The form was not saved",
                    css: {
                        fontSize: "20px",
                        color: "red"
                    },
                    classes: ["toast-error"]
                }
            };

            modalBody.components = [oeLit];
            modalBody.addComponent(reqFV);
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
                    modalBody.addComponent(info);
                });
                promise.catch(function (err) {
                    modalBody.addComponent(info);
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
                    data.selectedForm = new FormProperties();
                    data.workArea.removeAllChildren(0);
                    modal.hide();
                    modal.modalDialog.modalContent.modalBody.find("textField").value = "";
                    modal.modalDialog.modalContent.modalBody.find("textarea").value = "";
                });
                promise.catch(function (err) {
                    modalBody.addComponent(info);
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