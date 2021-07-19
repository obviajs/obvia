import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { CSSUtils } from "/obvia/lib/CSSUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var BrowserWindow = function (_props) {
    let _self = this,
        _win;
    let _defaultParams = {
        tile: "",
        status: "",
        url: "",
        name: "_blank",
        height: 500,
        width: 600,
        left: 400,
        top: 200,
        menubar: 0,
        status: 0,
        titlebar: 1,
        location: 0,
        toolbar: 0,
        resizable: 0,
        replace: false,
        ownerDocument: null
    };

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {}
    };

    this.template = function () {
        _win = window.open(_url, _name, "width=" + _width + ",height=" + _height + ",top=" + _top + ",left=" + _left + ",status=" + _status + ",location=" + _location + ",toolbar=" + _toolbar + ",resizable" + _resizable);
        _win.addEventListener('beforeunload', function (e) {
            _self.removeAllChildren();
            _win = null;
            BrowserWindow.all.splice(BrowserWindow.all.indexOf(_self), 1);
            _self.$el.remove();
            delete e['returnValue'];
            _self.trigger("beforeunload");
        });
        BrowserWindow.all.push(this);
        CSSUtils.copyStyles(document, _win.document);
        this.ownerDocument = _win.document;

        this.$el = $("<div/>");
        this.$el.attr('id', this.domID);
        this.appendTo = $(_win.document.body);
        return null;
    };

    this.close = function () {
        if (_win) {
            _win.close();
            _win = null;
            BrowserWindow.all.splice(BrowserWindow.all.indexOf(this), 1);
        }
    };

    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _props.ownerDocument = null;
    let _url = _props.url;
    let _name = _props.name;
    let _width = _props.width;
    let _height = _props.height;
    let _left = _props.left;
    let _top = _props.top;
    let _status = _props.status;
    let _location = _props.location;
    let _toolbar = _props.toolbar;
    let _resizable = _props.resizable;

    let r = Parent.call(this, _props, false, true);

    this.show = function () {
        if (!this.parent) {
            this.appendTo.append(this.$el);
        }
        if (!_win || _win.closed) {
            let c = _win && _win.closed;
        } else {
            _win.focus();
        }
    };

    Object.defineProperty(this, 'window', {
        get: function () {
            return _win;
        }
    });

    this.destruct = function (mode = 1) {
        this.close();
    };
    return r;
};
DependencyContainer.getInstance().register("BrowserWindow", BrowserWindow, DependencyContainer.simpleResolve);
BrowserWindow.prototype.ctor = 'BrowserWindow';
BrowserWindow.all = new ArrayEx();
export {
    BrowserWindow
};