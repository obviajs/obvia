let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let _email, _password, _button;
    let imp = {
        "BEGIN_DRAW": function (e) {
        },
        "END_DRAW": function (e) {
            let itemList = applet.view.find("modalList");
            //_email = applet.view.find("email");
            //_password = app.viewStack.find("password");
            app.addBehaviors(itemList, {
                "rowAdd": "PREPARE_ITEM",
            }, false);
        },
        "PREPARE_ITEM": function (e, r, ra) {
            if (ra) {
                app.addBehaviors(ra.currentRow.form, {
                    "click": "ITEM_SELECT",
                }, false);
            }
            
            console.log("PREPARE_ITEM");
        },
        "ITEM_SELECT": function (e, ra) {
            console.log(arguments);
        },
        
    };
    /**
     * Behavior Filters below
    */
    
    return imp;
};
Implementation.ctor = "Implementation";
export { Implementation };