var P3Com = function(_u = "ws://localhost:4649/"){

    var _url = _u;

	var exampleSocket;
	    
	function connect() {
		exampleSocket = new WebSocket(url);
		
		exampleSocket.onmessage = function (e) {
			var response = JSON.parse(e.data);
			console.log(response);
		};
    }
	
	function send(){
	
		if(exampleSocket != undefined && (exampleSocket.readyState === exampleSocket.OPEN)){
			 
			var msg = {
				key: "FiscalPrinter",
				command: "WriteConfiguration",
				data: json
			};
		  
			// Send the msg object as a JSON-formatted string.
			exampleSocket.send(JSON.stringify(msg));
		}
		else
			alert("You should connect first!");
	}
    
    
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