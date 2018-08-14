var P3Com = function(_u = "ws://localhost:4649/"){

    var _url = _u;

	var _socket;
	    
	function connect() {
		_socket = new WebSocket("ws://"+ip+":"+this.handshakePort+"/Discover");
        if(_socket){		
			_socket.onopen = function (event) {
				//console.log("opened on ", ip);
				_socket.send("")
			}
			_socket.onmessage = function (event) {
				hosts[ip] = JSON.parse(event.data);
				//console.log("received from ", ip);
			}
			_socket.onerror = function (event) {
				//console.log("error ", ip);    
			}
			_socket.onclose = function(){
				//console.log("connection closed ", ip); 
				
			}
		}
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