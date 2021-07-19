/**
 * This is a Tab Element
 * 
 * Kreatx 2018
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var Tab = function (_props) {

    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (this.$anchor)
                    this.$anchor.html(v);
            }
        }
    });
    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            this.$container = this.$el;
            this.$anchor = $('<a class="nav-link" data-toggle="tab" href="#' + this.domID + '">' + _label + '</a>');
            this.$header = $('<li class="nav-item"></li>');
            this.$header.append(this.$anchor);

            if (typeof _init == 'function')
                _init.apply(this, arguments);
        }
    };
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {

        }
    };

    this.template = function () {
        return '<div id="' + this.domID + '" class="tab-pane fade"></div>';
    };

    let _defaultParams = {};
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _label = _props.label;
    let r = Container.call(this, _props);
    return r;
};
Tab.prototype.ctor = 'Tab';