/**
 * This is a TabNavigator Element
 * 
 * Kreatx 2018
 */

import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var TabNavigator = function (_props) {
    let _self = this;
    let _changed = function (e, oldIndex, newIndex) {
        let len = this.components.length;
        for (let i = 0; i < len; i++) {
            let cTab = this.children[this.csorted[i]];
            if (cTab) {
                if (i == _self.selectedIndex) {
                    cTab.$el.addClass("active");
                    cTab.$anchor.addClass("active");
                    cTab.$el.removeClass("fade");
                } else {
                    cTab.$el.addClass("fade");
                    cTab.$el.removeClass("active");
                    cTab.$anchor.removeClass("active");
                }
            }
        }
    };

    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            this.$navigation = this.$el.find('#' + this.domID + "_navigation");
            this.$container = this.$el.find('#' + this.domID + "_container");
            if (typeof _init == 'function')
                _init.apply(this, arguments);
        }
    };

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {

        }
    };

    this.template = function () {
        return "<div data-triggers='change' id='" + this.domID + "' class='container'>" +
            '<ul class="nav nav-tabs" id="' + this.domID + '_navigation"></ul>' +
            '<div class="tab-content" id="' + this.domID + '_container"></div>' +
            "</div>";
    };

    let _defaultParams = {};
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = NavParent.call(this, _props);
    r.on("changed", _changed);
    return r;
};
//component prototype
TabNavigator.prototype.ctor = 'TabNavigator';