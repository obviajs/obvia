import { ObjectUtils } from "./ObjectUtils.js";

var EventDispatcher = function () { };

EventDispatcher.prototype.on = function (eventType, fnc) {
	if (typeof fnc !== 'function') {
		throw Error("The specified parameter is not a callback")
	} else {
		if (typeof fnc == 'function') {
			this.$el.on(eventType, function () {
				fnc.apply(this, arguments);
			}.bind(this));
		}
	}
	return this;
};

EventDispatcher.prototype.trigger = function () {
	this.$el.trigger.apply(this.$el, arguments);
};

EventDispatcher.listen = function (arr, eventType, fnc) {
	eventType = eventType.trim();
	if (ObjectUtils.isObject(arr) && !arr.array.forEach) {
		for (let p in arr) {
			if (arr[p] && arr[p].on) {
				arr[p].on(eventType, fnc);
			}
		}
	} else if (arr.forEach) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] && arr[i].on) {
				arr[i].on(eventType, fnc);
			}
		}
	}
};
EventDispatcher.unlisten = function (arr, eventType, fnc = null) {
	let arrEvt = eventType.trim().split(" ");
	for (let i = 0; i < arrEvt.length; i++) {
		eventType = arrEvt[i];
		if (ObjectUtils.isObject(arr) && !arr.array.forEach) {
			for (let p in arr) {
				if (arr[p] && arr[p].off) {
					arr[p].off(eventType, fnc);
				}
			}
		} else if (arr.forEach) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] && arr[i].off) {
					arr[i].off(eventType, fnc);
				}
			}
		}
	}
};
export {
	EventDispatcher
};