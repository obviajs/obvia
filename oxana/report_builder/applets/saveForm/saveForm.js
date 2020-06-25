let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let modal;

    let imp = {

        "BEGIN_DRAW": function (e) {
        },

        "END_DRAW": function (e) {
            modal = applet.view;
            
            app.addBehaviors(modal, {
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
            modalBody.components = [oeLit];
        },

        "SAVE_FORM": function(e) {
            e.preventDefault();
            e.stopPropagation();
            var gaiaForm = new GaiaAPI_forms();
            gaiaForm.formsClient.post(data.selectedForm);
        },
    };
    
    return imp;
};
Implementation.ctor = "Implementation";
export { Implementation };