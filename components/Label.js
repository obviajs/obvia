/**
 * This is a Label Element
 * 
 * Kreatx 2018
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Label = function (_props) {
    let _label, _html, _labelType;
    
    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _props.label = _label = v;
                if (this.$el) {
                    //convert html entities
                    v = $(`<div>${v}</div>`).get(0).innerText;
                    let last = this.$el.children().last();
                    if (last && last.length > 0)
                        if (last[0].nextSibling)
                            last[0].nextSibling.textContent = v;
                        else
                            this.$el.appendText(v);
                    else
                        //this.$el.appendText(v);
                        this.$el.text(v);
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "html", {
        get: function html() {
            return _html = this.$el.html();
        },
        set: function html(v) {
            if (_html != v) {
                _html = v;
                if (this.$el) {
                    this.$el.html(v);
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "labelType", {
        get: function labelType() {
            return _labelType;
        },
        set: function labelType(v) {
            if (_labelType != v) {
                _labelType = v;
                if (this.$el) {
                    let newCls = this.$el[0].className;
                    let drag = this.$el[0].draggable;
                    let label = this.$el[0].textContent;
                    let $newEl = $(this.template());
                    this.$el.replaceWith($newEl);
                    $newEl[0].className = newCls;
                    $newEl[0].draggable = drag;
                    $newEl[0].textContent = label;
                    this.$el = $newEl;
                }
            }
        },
        enumerable: true
    });

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_label == null && _props.label) {
                this.label = _props.label;
            }
        }
    };
    this.template = function () {
        return "<" + _labelType + " id='" + this.domID + "' data-triggers='input'></" + _labelType + ">";
    };

    let _defaultParams = {
        label: "",
        labelType: LabelType.label,
        type:""
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    _labelType = _props.labelType;

    let r = Container.call(this, _props);
    return r;
};
Label.prototype.ctor = 'Label';
var LabelType =
{
    "i": "i",
    "b": "b",
    "u": "u",
    "span": "span",
    "label": "label",
    "p": "p",
    "sup": "sup",
    "small": "small",
    "strong": "strong"
};
DependencyContainer.getInstance().register("Label", Label, DependencyContainer.simpleResolve);
export {
    Label, LabelType
};