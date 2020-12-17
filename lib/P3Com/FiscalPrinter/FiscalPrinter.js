function FiscalPrinter(p3com) {
    var _key = 'FiscalPrinter';
    var _command;
    var _P3Com = p3com;
    var _self = this;
    this.$el = $(this);

    _P3Com.on(P3ComEventType.COMMAND_ACKNOWLEDGED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "PrintalFiscalRcpt":
                var eventObject = $.Event(FiscalPrinterEventType.FISCAL_RECEIPT_RECEIVED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "WriteConfiguration":
                var eventObject = $.Event(FiscalPrinterEventType.CONFIGURATION_RECEIVED);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.COMMAND_REJECETED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "PrintalFiscalRcpt":
                var eventObject = $.Event(FiscalPrinterEventType.FISCAL_RECEIPT_REJECTED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "WriteConfiguration":
                var eventObject = $.Event(FiscalPrinterEventType.CONFIGURATION_REJECTED);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.COMMAND_COMPLETED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "PrintalFiscalRcpt":
                var eventObject = $.Event(FiscalPrinterEventType.FISCAL_RECEIPT_PRINTED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "WriteConfiguration":
                var eventObject = $.Event(FiscalPrinterEventType.CONFIGURATION_WRITTEN);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.COMMAND_FAILED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "PrintalFiscalRcpt":
                var eventObject = $.Event(FiscalPrinterEventType.FISCAL_RECEIPT_PRINT_FAILED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "WriteConfiguration":
                var eventObject = $.Event(FiscalPrinterEventType.CONFIGURATION_WRITE_FAILED);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.CONNECTION_ERROR, function (event, data) {
        var eventObject = $.Event(FiscalPrinterEventType.CONNECTION_ERROR);
        _self.trigger(eventObject, [data]);
    });

    _P3Com.on(P3ComEventType.CONNECTION_CLOSE, function (event, code) {
        var eventObject = $.Event(FiscalPrinterEventType.CONNECTION_CLOSE);
        _self.trigger(eventObject, [code]);
    });


    this.PrintalFiscalReceipt = function (invoice) {
        _command = 'PrintalFiscalRcpt';
        _P3Com.send({"key": _key, "command": _command, "data": JSON.stringify(invoice), "cancelable": false});
    };

    this.WriteConfiguration = function (config) {
        _command = 'WriteConfiguration';
        _P3Com.send({"key": _key, "command": _command, "data": JSON.stringify(config), "cancelable": false});
    };
}

FiscalPrinter.prototype = Object.create(EventDispatcher.prototype);