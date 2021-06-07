/**
 * This is a Loader Element
 *
 * Kreatx 2018
 */

// import { Env } from "../lib/Env.js";
import { Component } from "/obvia/components/base/Component.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var Loader = function(_props) {
    this.template = function() {
        return `
		<div class="spinner">
		<svg class="svg_spinner">
		  <use href="/obvia/assets/icons.svg#icon-loader"></use>
		</svg>
	  </div>
		`;
    };

    // this.template = function () {
    // 	return (
    // 		"<div id='" +
    // 		this.domID +
    // 		"'>" +
    // 		"<style>" +
    // 		".se-pre-con {" +
    // 		"position: fixed;" +
    // 		"left: 0px;" +
    // 		"top: 0px;" +
    // 		"width: 100%;" +
    // 		"height: 100%;" +
    // 		"z-index: 999999;" +
    // 		"opacity: 0.9;" +
    // 		"background: url('" +
    // 		Env.getInstance().baseurl +
    // 		"/obvia/lib/dependencies/images/loader.gif')center no-repeat #fff;" +
    // 		"}" +
    // 		"</style>" +
    // 		"<div class='se-pre-con'></div>" +
    // 		"</div>"
    // 	);
    // };
    var _defaultParams = {
        visible: true,
    };

    _props = ObjectUtils.extend(false, false, _defaultParams, _props);

    Component.call(this, _props);
};

//component prototype
Loader.prototype.ctor = "Loader";
export { Loader };