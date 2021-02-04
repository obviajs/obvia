/**
 * This is an Object Element
 * 
 * Kreatx 2021
 */

//component definition
var ObjectCmp = function (_props, _hideComponents = false) {
    let _self, _data, _type;

    Object.defineProperty(this, "data", {
        get: function data() {
            return _data;
        },
        set: function data(v) {
            if (_data != v) {
                if (this.$el) {
                    if (v)
                        this.$el.attr('data', v);
                    else
                        this.$el.removeAttr('data');
                    _data = v;
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "type", {
        get: function type() {
            return _type;
        },
        set: function type(v) {
            if (_type != v) {
                if (this.$el) {
                    if (v)
                        this.$el.attr('type', v);
                    else
                        this.$el.removeAttr('type');
                    _type = v;
                }
            }
        },
        enumerable: true
    });

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.data) {
                this.data = _props.data;
            }
            if (_props.type) {
                this.type = _props.type;
            }
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {}
    };
    this.template = function () {
        return "<object></object>";
    };

    let _defaultParams = {
        data: "",
        type: "application/pdf"
    };
    _props = extend(false, false, _defaultParams, _props);

    let r = Container.call(this, _props, _hideComponents);
    return r;
};
ObjectCmp.prototype.ctor = 'ObjectCmp';