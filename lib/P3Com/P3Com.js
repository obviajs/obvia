var P3Com = function(_u = "ws://localhost:4649/") {

    var _url = _u;

	var _socket;

	var hosts = new Array();
	    
		this.send = function(msg){

			_socket = new WebSocket(_url);
				if(_socket){	
					_socket.onopen = function (event) {
						console.log("opened on ", _url);
						console.log("Msg: ",msg);
						_socket.send(JSON.stringify(msg));
						//_socket.send("")
					}
					_socket.onmessage = function (event) {
						hosts[0] = JSON.parse(event.data);
						//_socket.close();
						console.log("received from ", event.data);
					}
					_socket.onerror = function (event) {
						console.log("error ", event.data); 
					}
					_socket.onclose = function(event){
						console.log("connection closed ", event.data); 

				}
			}

			// if(_socket != undefined && (_socket.readyState === _socket.OPEN)) {
			// 	console.log("Msg: ",msg);

			// 	// Send the msg object as a JSON-formatted string.
			// 	_socket.send(JSON.stringify(msg));
			// }
			// else
			// 	alert("You should connect first!");
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