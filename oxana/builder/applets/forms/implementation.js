let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;
    let _email, _password, _button;
    let imp = {
        "BEGIN_DRAW": function (e) {
        },
        "END_DRAW": function (e) {
            //_email = applet.view.find("email");
            //_password = app.viewStack.find("password");
        }
        
    };
    /**
     * Behavior Filters below
    */
    
    return imp;
};
Implementation.ctor = "Implementation";
export { Implementation };