function FiscalPrinter(p3com) {
	var key = 'FiscalPrinter';
	var command = 'PrintalFiscalRcpt';
	var _P3Com = p3com;

	this.PrintalFiscalReceipt = function (invoice) {
		_P3Com.send({'key': key, 'command': command, data: invoice});
	}
}