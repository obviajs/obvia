var Scanner = function(p3com, divToShow="") {
	var key = 'Scanner';
	var _P3Com = p3com;
	this.$el = $(this);

	var _self = this;
	_P3Com.on(P3ComEventType.COMMAND_ACKNOWLEDGED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_ACKNOWLEDGED);
		
	})
	_P3Com.on(P3ComEventType.COMMAND_COMPLETED, function(event, responseObj, command) {
		console.log(P3ComEventType.COMMAND_COMPLETED);
		switch(command.commandType.command)
		{
			case "LoadScanners":		
				var eventObject = $.Event(ScannerEventType.SCANNER_LIST_LOADED);
				var scanners = responseObj.data;
				_self.trigger(eventObject, [scanners]);
				break;	
			case "Scan":
				var eventObject = $.Event(ScannerEventType.DOCUMENT_SCANNED);
				var scanners = responseObj.data;
				var showScannedItem = showImageOrPdf(responseObj.data, "pdf");
				_self.trigger(eventObject, [showScannedItem]);
				break;
		}
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

	this.LoadScanners = function () {
		var command = "LoadScanners";
		_P3Com.send({"key": key, "command": command, "cancelable": false});
	}
	this.Scan = function (scanItem) {
		var command = "Scan";
		_P3Com.send({"key": key, "command": command, "data": JSON.stringify(scanItem), "cancelable": false});
	}
	this.WriteConfiguration = function () {};

	var showImageOrPdf = function(myBase64string, extension) {
		var objbuilder = '';
		if(extension == "pdf" ) {
			objbuilder += ('<object width="100%" height="800px" data="data:application/pdf;base64,');
			objbuilder += (myBase64string);
			objbuilder += ('" type="application/pdf">');
			objbuilder += ('<embed src="data:application/pdf;base64,');
			objbuilder += (myBase64string);
			objbuilder += ('" type="application/pdf"  />');
			objbuilder += ('</object>');
		} 
		else {
			objbuilder += "<img src='data:image/"+extension+";base64,"+myBase64string+"' alt='Follow the white rabbit.' />"
		}
		return objbuilder;				
	}

}

Scanner.prototype = Object.create(EventDispatcher.prototype);
