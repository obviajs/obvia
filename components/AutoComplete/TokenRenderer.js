/**
 * This is a TokenRenderer Element, the default item renderer for an Autocomplete
 * 
 * Kreatx 2018
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { Label, LabelType } from "/obvia/components/Label.js";
import { Link } from "/obvia/components/Link/Link.js";

var TokenRenderer = function (_props) {
    let _self = this,
        _value, _label, _closeIconSide, _link, _span;

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _link = this.linkCmp;
            _span = this.labelCmp;
        }
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.value)
                _value = _props.value;
            if (_props.label)
                _label = _props.label;
        }
    };

    let _closeIconClick = function (e) {
        _self.trigger("closeiconclick");
    };

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if (_span)
                    if (v || v === false)
                        _span.attr.value = v;
                    else
                        delete _span.attr.value;
            }
        }
    });

    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (_span)
                    _span.label = v;
            }
        }
    });

    //"font-size: 14px; margin:2px"
    let _defaultParams = {
        closeIconSide: "left",
        components: [],
        "type": "",
        classes: ["badge", "badge-info"],
        css: {
            "font-size": "14px",
            "height": "100%",
            "align-items": "center"
        }
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    _props.attr["data-triggers"] = "closeiconclick";

    let _spanLit = {
        ctor: Label,
        props: {
            id: 'labelCmp',
            labelType: LabelType.span,
            attr: {
                "tabindex": "-1"
            },
            css: {
                "width": "100%",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                "overflow": "hidden",
                "display": "inline-block",
                "margin": 0
            }
        }
    };

    let _linkLit = {
        ctor: Link,
        props: {
            id: "linkCmp",
            classes: ["badge", "badge-info", "d-inline"],
            click: _closeIconClick,
            label: "x",
            href: "javascript:void(0)"
        }
    };

    if (_closeIconSide == "left") {
        _props.components.push(_linkLit);
        _props.components.push(_spanLit);
    } else {
        _props.components.push(_spanLit);
        _props.components.push(_linkLit);
    }
    let r = Container.call(this, _props);
    return r;
};
TokenRenderer.prototype.ctor = 'TokenRenderer';
export {
    TokenRenderer
};