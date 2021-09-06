/**
 * This is an IFrame Element
 * 
 * Kreatx 2018
 */
import { Component } from "/obvia/components/base/Component.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
 
var IFrame = function (_props) {
    
    let _width, _height, _src;
    
    Object.defineProperty(this, "src", {
        get: function src() {
            return _src;
        },
        set: function src(v) {
            if (_src != v) {
                _src = v;
                if (this.$el)
                    this.$el.attr('src', v);
            }
        },
        enumerable: true
    });
 
    Object.defineProperty(this, "height", {
        get: function height() {
            return _height;
        },
        set: function height(v) {
            if (_height != v) {
                _height = v;
                if (this.$el)
                    this.$el.attr('height', v);
            }
        },
        enumerable: true
    });
 
    Object.defineProperty(this, "width", {
        get: function width() {
            return _width;
        },
        set: function width(v) {
            if (_width != v) {
                _width = v;
                if (this.$el)
                    this.$el.attr('width', v);
            }
        },
        enumerable: true
    });
 
    this.beforeAttach = function () {
        if (_props.width) {
            this.width = _props.width;
        }
        if (_props.height) {
            this.height = _props.height;
        }
        if (_props.src) {
            this.src = _props.src;
        }
    }
 
    this.template = function () {
        return '<iframe  id="' + this.domID + '"></iframe>';
    };
    let _defaultParams = {
        width: 0,
        height: 0,
        src: ""
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["load"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
 
    Component.call(this, _props, true);
 
    this.render = function () {
        this.trigger('beginDraw');
        this.trigger('endDraw');
        return Promise.resolve(this);
    };

    this.focus = function () {       
        this.$el[0].contentWindow.focus();
    };

    this.print = function () {
        this.$el[0].contentWindow.focus();
        this.$el[0].contentWindow.print();
    };
};

IFrame.prototype.ctor = 'IFrame';
DependencyContainer.getInstance().register("IFrame", IFrame, DependencyContainer.simpleResolve);
export {
    IFrame
};