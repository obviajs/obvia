var EventDispatcher = function() {}

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
}

EventDispatcher.prototype.trigger = function () {
	this.$el.trigger.apply(this.$el, arguments);
}