/**
 * This is an Object Element
 *
 * Kreatx 2021
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var ObjectCmp = function (_props) {
	let _self, _data, _type;

	Object.defineProperty(this, "data", {
		get: function data() {
			return _data;
		},
		set: function data(v) {
			if (_data != v) {
				if (this.$el) {
					if (v) this.$el.attr("data", v);
					else this.$el.removeAttr("data");
					_data = v;
				}
			}
		},
		enumerable: true,
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
			if (typeof _beforeAttach == "function")
				_beforeAttach.apply(this, arguments);
		}
	};

	this.afterAttach = function (e) {
		if (e.target.id == this.domID) {
		}
	};
	this.template = function () {
		return '<object id="' + this.domID + '" ></object>';
	};

	let _defaultParams = {
		data: "",
		type: "application/pdf",
	};
	ObjectUtils.fromDefault(_defaultParams, _props);
	//_props = ObjectUtils.extend(false, false, _defaultParams, _props);

	let r = Container.call(this, _props);
	Object.defineProperty(this, "type", {
		get: function type() {
			return _type;
		},
		set: function type(v) {
			if (_type != v) {
				if (this.$el) {
					if (v) this.$el.attr("type", v);
					else this.$el.removeAttr("type");
					_type = v;
				}
			}
		},
		enumerable: true,
	});
	return r;
};
ObjectCmp.prototype.ctor = "ObjectCmp";
DependencyContainer.getInstance().register(
	"ObjectCmp",
	ObjectCmp,
	DependencyContainer.simpleResolve
);
export { ObjectCmp };
