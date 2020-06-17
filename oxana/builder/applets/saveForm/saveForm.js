let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal;

    let imp = {

        "BEGIN_DRAW": function (e) {},

        "END_DRAW": function (e) {
            modal = applet.view;

            applet.addBehaviors(modal, {
                "accept": "SAVE_FORM"
            }, false);

            let modalBody = modal.modalDialog.modalContent.modalBody;
            let selectedForm = data.selectedForm;

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

            modalBody.components = [oeLit];
            modalBody.addComponent(reqFV);
        },

        "SAVE_FORM": function (e) {
            e.preventDefault();
            e.stopPropagation();
            ValidationManager.getInstance().validate().then((result) => {
                if (result[0]) {
                    var gaiaForm = new GaiaAPI_forms();
                    gaiaForm.formsClient.post(data.selectedForm);
                    modal.hide();
                }
            });
        },
    };

    return imp;
};
Implementation.ctor = "Implementation";
export {
    Implementation
};