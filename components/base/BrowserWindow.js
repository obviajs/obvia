var BrowserWindow = function(_props)
{
    var _self = this, _win;
    var _defaultParams = {
        tile: "",
        status:"",
        url:"",
        name: "_blank",
        height:500,
        width:600,
        left:400,
        top:200,
        menubar:0,
        status:0,
        titlebar:1,
        location:0,
        toolbar:0,
        resizable:0,
        replace:false,
        ownerDocument: null
    };
    
    this.template = function () {
        this.$el = $("<div/>");
        this.$el.attr('id', this.domID);
        return null;
    };

    this.close = function(){
        if(_win){
            _win.close();
            _win = null;
            BrowserWindow.all.splice(BrowserWindow.all.indexOf(_win), 1);
        }
    }

    _props = extend(false, false, _defaultParams, _props);
    _props.ownerDocument = null;
    var _url = _props.url;
    var _name = _props.name;
    var _width = _props.width;
    var _height = _props.height;
    var _left = _props.left;
    var _top = _props.top;
    var _status = _props.status;
    var _location = _props.location;
    var _toolbar = _props.toolbar;
    var _resizable = _props.resizable;

    Parent.call(this, _props, false, true); 

    this.show = function(){
        if(!_win){
            _win = window.open(_url, _name, "width="+_width+",height="+_height+",top="+_top+",left="+_left+",status="+_status+",location="+_location+",toolbar="+_toolbar+",resizable"+_resizable);     
             BrowserWindow.all.push(_win);
            BrowserWindow.copyStyles(document, _win.document);
            this.ownerDocument = _win.document;
            this.$container = this.$el;       
            this.addComponents(this.components);
            $(_win.document.body).append(this.$el);
        }
    } 

    Object.defineProperty(this, 'window',
    {
        get: function () {
            return _win;
        }
    });

    this.destruct = function (mode=1)
    {
        this.close();
    }
};
BrowserWindow.prototype.ctor = 'BrowserWindow';
BrowserWindow.copyStyles = function(originDoc, destDoc)
{
    var childHead = destDoc.getElementsByTagName("head")[0];
    $(originDoc).find("link").each(
        function(index,element){
            var childLink = destDoc.createElement("link");
            childLink.rel  = "stylesheet";
            childLink.href = element.href;
            childHead.appendChild(childLink);
    });
    $(originDoc).find("style").each(
        function(index,element){
            var childStyle = destDoc.createElement("style");
            childStyle.type = 'text/css';
            childStyle.innerHTML = $(this).html();
            childHead.appendChild(childStyle);
    });
};
BrowserWindow.all = new ArrayEx();