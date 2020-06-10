/**
 * This is a Loader Element
 * 
 * Kreatx 2018
 */

//component definition
var Loader = function(_props)
{ 
    this.template = function () 
    {
        return  "<div id='" + this.domID + "'>" +
                    "<style>" +
                        ".se-pre-con {" +
                            "position: fixed;" +
                            "left: 0px;" +
                            "top: 0px;" +
                            "width: 100%;" +
                            "height: 100%;" +
                            "z-index: 999999;" +
                            "opacity: 0.9;" +
                            "background: url('"+(Env.getInstance().baseurl)+"/flowerui/lib/dependencies/images/loader.gif')center no-repeat #fff;" +
                        "}" +
                    "</style>"+
                    "<div class='se-pre-con'></div>" +                    
                "</div>";
    };
    var _defaultParams = {
        visible: true
    };

    _props = extend(false, false, _defaultParams, _props);

    Component.call(this, _props);
};

//component prototype
Loader.prototype.ctor = 'Loader';