var Scanner = function (p3com, divToShow) {
    var _key = 'Scanner';
    var _P3Com = p3com;
    var _div = divToShow;
    var _images = [];
    var _command;
    var _scanners;
    var _deviceId;
    var _self = this;
    this.$el = $(this);

    _P3Com.on(P3ComEventType.COMMAND_ACKNOWLEDGED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "LoadScanners":
                var eventObject = $.Event(ScannerEventType.LOAD_SCANNERS_RECEIVED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "Scan":
                var eventObject = $.Event(ScannerEventType.SCAN_DOCUMENT_RECEIVED);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.COMMAND_REJECETED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "LoadScanners":
                var eventObject = $.Event(ScannerEventType.LOAD_SCANNERS_REJECETED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "Scan":
                var eventObject = $.Event(ScannerEventType.SCAN_DOCUMENT_REJECETED);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.COMMAND_COMPLETED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "LoadScanners":
                _scanners = responseObj.data;
                localStorage.setItem("FlowerUI.P3Com.Scanner.Scanners", JSON.stringify(_scanners));

                var eventObject = $.Event(ScannerEventType.SCANNER_LIST_LOADED);
                _self.trigger(eventObject, [_scanners]);
                break;

            case "Scan":
                var base64string = responseObj.data;
                var contentType = "application/pdf";

                showImageOrPdf(base64string, "pdf", true);

                var eventObject = $.Event(ScannerEventType.DOCUMENT_SCANNED);
                _self.trigger(eventObject, [base64string, contentType]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.COMMAND_PROGRESS, function (event, responseObj) {
        _images[responseObj.data.imageName] = responseObj.data.imageEncoded;
    });

    _P3Com.on(P3ComEventType.COMMAND_FAILED, function (event, responseObj, command) {
        switch (command.commandType.command) {
            case "LoadScanners":
                var eventObject = $.Event(ScannerEventType.LOAD_SCANNERS_FAILED);
                _self.trigger(eventObject, [responseObj]);
                break;

            case "Scan":
                var eventObject = $.Event(ScannerEventType.SCAN_DOCUMENT_FAILED);
                _self.trigger(eventObject, [responseObj]);
                break;

            default:
                break;
        }
    });

    _P3Com.on(P3ComEventType.CONNECTION_ERROR, function (event, data) {
        var eventObject = $.Event(ScannerEventType.CONNECTION_ERROR);
        _self.trigger(eventObject, [data]);
    });

    _P3Com.on(P3ComEventType.CONNECTION_CLOSE, function (event, code) {
        var eventObject = $.Event(ScannerEventType.CONNECTION_CLOSE);
        _self.trigger(eventObject, [code]);
    });

    this.LoadScanners = function () {
        _command = "LoadScanners";
        _P3Com.send({"key": _key, "command": _command, "cancelable": false});
    };

    this.Scan = function (scanItem) {
        _command = "Scan";

        scanItem.deviceId = this.DeviceId;
        if (scanItem.deviceId) {
            if (this.Scanners) {
                var match = getMatching(this.Scanners, "deviceId", scanItem.deviceId, true);

                if (match.objects.length > 0) {
                    match = match.objects[0];

                    scanItem = extend(false, false, [], [], [], match, scanItem);

                    scanItem.HORIZONTAL_SCAN_SIZE_PIXELS = scanItem.HORIZONTAL_SCAN_SIZE_PIXELS > match.HORIZONTAL_SCAN_SIZE_PIXELS ?
                        match.HORIZONTAL_SCAN_SIZE_PIXELS : scanItem.HORIZONTAL_SCAN_SIZE_PIXELS;
                    scanItem.VERTICAL_SCAN_SIZE_PIXELS = scanItem.VERTICAL_SCAN_SIZE_PIXELS > match.VERTICAL_SCAN_SIZE_PIXELS ?
                        match.VERTICAL_SCAN_SIZE_PIXELS : scanItem.VERTICAL_SCAN_SIZE_PIXELS;

                    if (match.HORIZONTAL_SCAN_SIZE_PIXELS >= scanItem.HORIZONTAL_SCAN_SIZE_PIXELS
                        && match.VERTICAL_SCAN_SIZE_PIXELS >= scanItem.VERTICAL_SCAN_SIZE_PIXELS) {

                        _P3Com.send({"key": _key, "command": _command, "data": JSON.stringify(scanItem), "cancelable": false});
                        return -3;

                    } else return -2;

                } else return -1;

            } else return -4;

        } else return -4;
    };

    Object.defineProperty(this, 'DeviceId', {
        get: function () {
            if (!_deviceId) {
                if (localStorage.getItem("FlowerUI.P3Com.Scanner.DeviceId")) {
                    _deviceId = localStorage.getItem("FlowerUI.P3Com.Scanner.DeviceId");
                }
            }
            return _deviceId;
        },
        set: function (dId) {
            _deviceId = dId;
            localStorage.setItem("FlowerUI.P3Com.Scanner.DeviceId", _deviceId);
        }
    });

    Object.defineProperty(this, 'Scanners', {
        get: function () {
            if (!_scanners) {
                if (localStorage.getItem("FlowerUI.P3Com.Scanner.Scanners")) {
                    _scanners = JSON.parse(localStorage.getItem("FlowerUI.P3Com.Scanner.Scanners"));
                }
            }
            return _scanners;
        }
    });

    this.WriteConfiguration = function () {
    };

    var showImageOrPdf = function (base64string, extension, isPreview = false) {
        if (_div) {
            if ($('#' + _div).length > 0) {
                var objbuilder = '';
                if (extension == "pdf" && !isPreview) {
                    objbuilder += ('<object width="100%" height="800px" data="data:application/pdf;base64,');
                    objbuilder += (base64string);
                    objbuilder += ('" type="application/pdf">');
                    objbuilder += ('<embed src="data:application/pdf;base64,');
                    objbuilder += (base64string);
                    objbuilder += ('" type="application/pdf"  />');
                    objbuilder += ('</object>');
                } else {
                    objbuilder += "<img src='data:image/" + extension + ";base64," + _images['name_1.jpg'] + "' alt='Follow the white rabbit.' width='300' height='420'/>"
                }
                $("#" + _div).html(objbuilder);
            } else {
                throw new Error("The div: " + _div + "was not found on DOM!");
            }
        }
    }

}

Scanner.prototype = Object.create(EventDispatcher.prototype);
