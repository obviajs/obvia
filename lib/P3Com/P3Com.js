var P3Com = function(_u = "ws://localhost:4649/") {

    var _url = _u;

	var _socket;

	var commands = {};
	    
	this.$el = $(this);

	var _self = this;
	//var eventObject;

		this.send = function(msg){
			_socket = new WebSocket(_url);

			if(_socket){
				var command = new Command();

				_socket.onopen = function (event) {
					console.log("opened on ", _url);
					console.log("Msg: ",msg);

					var cmdtype = new CommandType();
					cmdtype.moduleName = msg.key;
					cmdtype.command = msg.command;
					cmdtype.cancelable = msg.cancelable;

					commands[command.guid] = command;
					msg.guid = command.guid;
					
					command.commandType = cmdtype;					 
					command.parameters = msg.data; 
					command.dateSent = new Date();
					command.dateAcknowledged;
					command.dateComplete;
					command.statusCode; 
					command.statusCodeDescription;
					
					_socket.send(JSON.stringify(msg));
				}

				_socket.onmessage = (function (cmd) { 
					return function (event, cmd) {
						var responseObj = JSON.parse(event.data);
						if(responseObj) {
							command.statusCode = responseObj.statusCode;
							if(responseObj.statusCode == 1000) {								
								command.dateAcknowledged = new Date();						  
								command.statusCodeDescription = 'Command was acknowledged.';
								var eventObject = $.Event(P3ComEventType.COMMAND_ACKNOWLEDGED)
								_self.trigger(eventObject, [responseObj]);
							}
							else if(responseObj.statusCode == 1001){
								command.dateComplete = new Date();						  
								command.statusCodeDescription = 'General failure: ' + responseObj.statusMsg;
								var eventObject = $.Event(P3ComEventType.COMMAND_FAILED);
								_self.trigger(eventObject, [responseObj]);
							}
							else {
								command.dateComplete = new Date();						  
								command.statusCodeDescription = responseObj.statusMsg;
								var eventObject = $.Event(P3ComEventType.COMMAND_COMPLETED);
								_self.trigger(eventObject, [responseObj, command]);
							}
						}
						//_socket.close();
						console.log("received from ", event.data);
					}
				})(command.guid);

				_socket.onerror = (function (cmd) {
					return function (event, cmd) {
						console.log("error ", event.data); 
						var eventObject1 = $.Event(P3ComEventType.CONNECTION_ERROR);
						_self.trigger(eventObject1, [event.data]);
						command.dateComplete = new Date();
						command.statusCode = -1000; 
						command.statusCodeDescription = event.data;
					}
				})(command);
				
				_socket.onclose = (function (cmd){
					return function (event, cmd) {
						console.log("connection closed ", event); 
						var eventObject1 = $.Event(P3ComEventType.CONNECTION_CLOSE);
						_self.trigger(eventObject1, [event.code]);
						command.dateComplete = new Date();
						command.statusCode = event.code; 
						command.statusCodeDescription = event.reason;
					}
				})(command);
			}
			
		};
    
    
    Object.defineProperty(this, "autoRetry", 
	{
		get: function autoRetry() 
		{
			return _autoRetry;
		},
		set: function autoRetry(x) 
		{
			_autoRetry = x;
		}
	});
}

P3Com.prototype = Object.create(EventDispatcher.prototype);