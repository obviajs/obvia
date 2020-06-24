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

        "SAVE_NEW": function (e) {
            e.preventDefault();
            e.stopPropagation();
            ValidationManager.getInstance().validate().then((result) => {
                if (result[0]) {
                    data.workArea.removeAllChildren(0);
                    modal.hide();
                    var gaiaForm = new GaiaAPI_forms();
                    gaiaForm.formsClient.post(data.selectedForm);
                    resetObjectProp(data.selectedForm);
                    modal.modalDialog.modalContent.modalBody.find("textField").value = "";
                    modal.modalDialog.modalContent.modalBody.find("textarea").value = "";

                }
            });
        }
    };

    let resetObjectProp = function (obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (typeof obj[prop] === "number") {
                    obj[prop] = 0;
                } else {
                    obj[prop] = "";
                }
            }
        }
        return obj;
    };

    return imp;

};
Implementation.ctor = "Implementation";
export {
    Implementation
};