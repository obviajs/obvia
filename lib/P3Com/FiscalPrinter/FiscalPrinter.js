function FiscalPrinter(p3com) {
	var key = 'FiscalPrinter';
	var command = 'PrintalFiscalRcpt';
	var _P3Com = p3com;
	this.$el = $(this);

	_P3Com.on(P3ComEventType.COMMAND_ACKNOWLEDGED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_ACKNOWLEDGED);
	})
	_P3Com.on(P3ComEventType.COMMAND_COMPLETED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_COMPLETED);
	})
	_P3Com.on(P3ComEventType.COMMAND_FAILED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_FAILED);
	})
	_P3Com.on(P3ComEventType.CONNECTION_ERROR, function(event, data) {
		console.log(P3ComEventType.CONNECTION_ERROR);
	})
	_P3Com.on(P3ComEventType.CONNECTION_CLOSE, function(event, code) {
		console.log(P3ComEventType.CONNECTION_CLOSE);
	})


	this.PrintalFiscalReceipt = function (invoice) {
		_P3Com.send({'key': key, 'command': command, data: invoice, cancelable: false});
	}
}

FiscalPrinter.prototype = Object.create(EventDispatcher.prototype);