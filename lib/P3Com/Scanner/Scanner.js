function Scanner(p3com, divToShow="") {
	var key = 'Scanner';
	var _P3Com = p3com;
	this.$el = $(this);

	_P3Com.on(P3ComEventType.COMMAND_ACKNOWLEDGED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_ACKNOWLEDGED);
		
	})
	_P3Com.on(P3ComEventType.COMMAND_COMPLETED, function(event, responseObj) {
		console.log(P3ComEventType.COMMAND_COMPLETED);
		if (responseObj['imageEncoded']) {
			showImageOrPdf(responseObj.imageEncoded, responseObj.extension)
			//console.log(responseObj.imageEncoded);
			// var objbuilder = '';
			// objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
			// objbuilder += (responseObj.imageEncoded);
			// objbuilder += ('" type="application/pdf" class="internal">');
			// objbuilder += ('<embed src="data:application/pdf;base64,');
			// objbuilder += (responseObj.imageEncoded);
			// objbuilder += ('" type="application/pdf"  />');
			// objbuilder += ('</object>');

			// var win = window.open("#","_blank");
			// var title = "my tab title";
			// win.document.write('<html><title>'+ title +'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
			// win.document.write(objbuilder);
			// win.document.write('</body></html>');
			// layer = jQuery(win.document);

			//window.open("data:application/jpg;base64, " + responseObj.imageEncoded, '', "height=600,width=800");
			
			// var myWindow = window.open("","","width=600,height=450");
    		// myWindow.document.write("<textarea rows='30' cols='70'>"+responseObj.imageEncoded+"</textarea>");
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
		_P3Com.send({"key": key, "command": command, "data": scanItem, "cancelable": false});
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
			$("#"+divToShow).html(objbuilder);	
	}

}

Scanner.prototype = Object.create(EventDispatcher.prototype);
