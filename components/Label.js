/**
 * This is a Label Element
 * 
 * Kreatx 2018
 */

//component definition
var Label = function (_props, _hideComponents = false) {
    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
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

    Object.defineProperty(this, "contenteditable", {
        get: function contenteditable() {
            return _contenteditable;
        },
        set: function contenteditable(v) {
            if (_contenteditable != v) {
                _contenteditable = v;
                if (this.$el) {
                    if (v)
                        this.$el.attr('contenteditable', v);
                    else
                        this.$el.removeAttr('contenteditable');
                }
            }
        }
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
            if (_props.label) {
                this.label = _props.label;
            }
            if (_props.contenteditable) {
                this.contenteditable = _props.contenteditable;
            }
        }
    };
    this.template = function () {
        return "<" + _labelType + " id='" + this.domID + "' data-triggers='input'></" + _labelType + ">";
    };

    let _defaultParams = {
        label: "",
        labelType: LabelType.label,
        contenteditable: false
    };
    _props = extend(false, false, _defaultParams, _props);

    let _label, _contenteditable;
    let _labelType = _props.labelType;

    let r = Parent.call(this, _props, _hideComponents);
    return r;
};
Label.prototype.ctor = 'Label';