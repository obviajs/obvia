

self.addEventListener('message', function(e) 
{
	var data = e.data;
	//console.log(e.data);
	
	var req = new XMLHttpRequest();
	req.open("POST", data.url, false);
	
	req.send(JSON.stringify(data));
	self.postMessage(req.responseText);
}, false);

/*
function autoSave() {
	//importScripts('../jquery.js');
    setTimeout("autoSave()",500);
	console.log("test");
	
	var req = new XMLHttpRequest();

	req.open("POST", "http://flower/?fsmProcessCRUD/test", false);
	//req.open("GET", "");
	req.send();
}
*/
//autoSave();