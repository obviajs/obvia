var Scanner = function(p3com, divToShow) {
	var key = 'Scanner';
	var _P3Com = p3com;
	this.$el = $(this);
	var scanners;
	var deviceId;
	var div = divToShow;
	var images = [];

	var _self = this;
	_P3Com.on(P3ComEventType.COMMAND_ACKNOWLEDGED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_ACKNOWLEDGED);
		
	});
	_P3Com.on(P3ComEventType.COMMAND_COMPLETED, function(event, responseObj, command) {
		console.log(P3ComEventType.COMMAND_COMPLETED);
		switch(command.commandType.command)
		{
			case "LoadScanners":		
				var eventObject = $.Event(ScannerEventType.SCANNER_LIST_LOADED);
				scanners = responseObj.data;
				localStorage.setItem("FlowerUI.P3Com.Scanner.Scanners", JSON.stringify(scanners));
				_self.trigger(eventObject, [scanners]);
				break;	
			case "Scan":
				var eventObject = $.Event(ScannerEventType.DOCUMENT_SCANNED);
				var base64string = responseObj.data;
				var contentType = "application/pdf";
				showImageOrPdf(responseObj.data, "pdf", true);
				_self.trigger(eventObject, [base64string, contentType]);
				break;
		}
	});
	_P3Com.on(P3ComEventType.COMMAND_PROGRESS, function(event, responseObj) {
		images[responseObj.data.imageName] = responseObj.data.imageEncoded;
	});
	_P3Com.on(P3ComEventType.COMMAND_FAILED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_FAILED);
	});
	_P3Com.on(P3ComEventType.CONNECTION_ERROR, function(event, data) {
		var eventObject = $.Event(ScannerEventType.CONNECTION_ERROR);
		_self.trigger(eventObject, [data]);
		
	});
	_P3Com.on(P3ComEventType.CONNECTION_CLOSE, function(event, code) {
		console.log(P3ComEventType.CONNECTION_CLOSE);
	});

	this.LoadScanners = function () {
		var command = "LoadScanners";
		_P3Com.send({"key": key, "command": command, "cancelable": false});
	};
	this.Scan = function (scanItem) {
		var command = "Scan";

		scanItem.deviceId = this.DeviceId;
		if (scanItem.deviceId) 
		{
			if(this.Scanners) 
			{
				var match = getMatching(this.Scanners, "deviceId", scanItem.deviceId, true);

				if(match.objects.length > 0) 
				{
					match = match.objects[0];

					scanItem = extend(false, false, [],[],[], match, scanItem);
					console.log(scanItem);

					scanItem.HORIZONTAL_SCAN_SIZE_PIXELS = scanItem.HORIZONTAL_SCAN_SIZE_PIXELS > match.HORIZONTAL_SCAN_SIZE_PIXELS ? match.HORIZONTAL_SCAN_SIZE_PIXELS : scanItem.HORIZONTAL_SCAN_SIZE_PIXELS;
					scanItem.VERTICAL_SCAN_SIZE_PIXELS = scanItem.VERTICAL_SCAN_SIZE_PIXELS > match.VERTICAL_SCAN_SIZE_PIXELS ? match.VERTICAL_SCAN_SIZE_PIXELS : scanItem.VERTICAL_SCAN_SIZE_PIXELS;
					if (match.HORIZONTAL_SCAN_SIZE_PIXELS >= scanItem.HORIZONTAL_SCAN_SIZE_PIXELS && match.VERTICAL_SCAN_SIZE_PIXELS >= scanItem.VERTICAL_SCAN_SIZE_PIXELS) 
					{
						_P3Com.send({"key": key, "command": command, "data": JSON.stringify(scanItem), "cancelable": false});
						return -3;
					} 
					else 
					{
						return -2;
					}
				} 
				else 
				{
					return -1;
				}
			
			} 
			else
			{
				return -4;
			}		
		} 
		else 
		{
			return -4;
		}
	}

	Object.defineProperty(this, 'DeviceId', {
		get: function() {
			if (!deviceId) 
			{
				if (localStorage.getItem("FlowerUI.P3Com.Scanner.DeviceId") ) 
				{
					deviceId = localStorage.getItem("FlowerUI.P3Com.Scanner.DeviceId");
				}
			}
			return deviceId;
		},
		set: function(dId) {
			deviceId = dId;
			localStorage.setItem("FlowerUI.P3Com.Scanner.DeviceId", deviceId);
		}
	});

	Object.defineProperty(this, 'Scanners', {
		get: function() {
			if (!scanners) 
			{
				if (localStorage.getItem("FlowerUI.P3Com.Scanner.Scanners") ) 
				{
					scanners = JSON.parse(localStorage.getItem("FlowerUI.P3Com.Scanner.Scanners"));
				}
			}
			return scanners;
		}
	});

	this.WriteConfiguration = function () {};

	var showImageOrPdf = function(base64string, extension, isPreview = false) {
		if (div) 
		{
			if ($('#'+div).length > 0) 
			{
				var objbuilder = '';
				if(extension == "pdf" && !isPreview) 
				{
					objbuilder += ('<object width="100%" height="800px" data="data:application/pdf;base64,');
					objbuilder += (base64string);
					objbuilder += ('" type="application/pdf">');
					objbuilder += ('<embed src="data:application/pdf;base64,');
					objbuilder += (base64string);
					objbuilder += ('" type="application/pdf"  />');
					objbuilder += ('</object>');
				} 
				else 
				{
					objbuilder += "<img src='data:image/"+extension+";base64,"+images['name_1.jpg']+"' alt='Follow the white rabbit.' width='300' height='420'/>"
				}
				$("#"+div).html(objbuilder);	
			} 
			else 
			{
				throw new Error("The div: " + div + "was not found on DOM!");
			}
		}			
	}

}

Scanner.prototype = Object.create(EventDispatcher.prototype);
