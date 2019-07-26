function testvalid(type,value)
{
	var validator = 
	{
		decimal:{exp:'^\\d*[0-9](\\.\\d*[0-9])?$'},
		email:{exp:"^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$"},
		ipaddress:{exp:"^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$"},
		date:{exp:'^\\d{4}-(0[0-9]|1[0,1,2])-([0,1,2][0-9]|3[0,1])$'},
		time:{exp:"^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$"},
		url:{exp:"^(http[s]?://|ftp://)?(www\.)?[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov)$"},
		urlip:{exp:"/^https?\:\/\/[^\/\s]+(\/.*)?$/"},
		uint:{exp:'^[0-9]+$'},
		sint:{exp:'^[-]?[0-9]+[\.]?[0-9]+$'}
	}; 
	//console.log(validator[type].exp);
	if(validator[type] == undefined) return true;
	var reg = new RegExp(validator[type].exp,"i");
	return (reg.test(value));
}
function simpleAjax(url,data,fnsuccess,fnfailure)
{
	//data should be hashmap i.e javascript Object
	data = data == undefined ? new Object():data;
	//kill two stones with one bird here :)
	//data["ajax"] = String.random();
	var method = (data && !Object.isEmpty(data))? "POST":"GET";
  $.ajax(
	{
		   type: method,
		   url: url,
		   data: data,
		   timeout: 300000,
		   cache: false,
		   success: function(msg){
				if(fnsuccess != undefined)
					fnsuccess(msg);
		   },
		   error:function(jqXHR, textStatus, errorThrown){
				if(fnfailure != undefined)
				{					
					fnfailure(jqXHR, textStatus, errorThrown);
				}
		   }
	});
}
function formatDate(date1) {
  return date1.getFullYear() + '-' +
    (date1.getMonth() < 9 ? '0' : '') + (date1.getMonth()+1) + '-' +
    (date1.getDate() < 10 ? '0' : '') + date1.getDate() + ' '+
    (date1.getHours() < 10 ? '0' : '') + date1.getHours() + ':'+
    (date1.getMinutes() < 10 ? '0' : '') + date1.getMinutes() + ':'+
    (date1.getSeconds() < 10 ? '0' : '') + date1.getSeconds();
	
	
}
function formatTime(date1)
{
	return  (date1.getHours() < 10 ? '0' : '') + date1.getHours() + ':'+
			(date1.getMinutes() < 10 ? '0' : '') + date1.getMinutes() + ':'+
			(date1.getSeconds() < 10 ? '0' : '') + date1.getSeconds();
}
function newwindow(url,title)
{
	window.open(url, title, "status=0,resizable=1"); 
}
function fnGetDomain(url) {
   return url.match(/:\/\/(.[^/]+)/)[1];
}
function replace(s,charfind,charnew)
{
	var arr = s.split(charfind);
	return arr.join(charnew);
}
/*
function printiframe(id)
{
    var iframe = document.frames ? document.frames[id] : document.getElementById(id);
    var ifWin = iframe.contentWindow || iframe;
    ifWin.focus();
    ifWin.printPage();
    return false;
}
*/

function printiframe(iframename)
{		
//alert('bbb');
	window.frames[iframename].focus();
	if($.browser == 'msie' && $.browser.version >=7)
		window.frames[iframename].document.execCommand("print",false,null);
	else
		window.frames[iframename].print();
}


function compareNumbers(a, b) 
{
   return a - b
} 

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

jQuery.fn.insertAt = function(element, index) 
{
	if(element){
		var lastIndex = this.children().length;
		index = index || lastIndex+1;
		if (index < 0) {
			index = Math.max(0, lastIndex + 1 + index);
		}
		this.append(element);
		if (index < lastIndex) {
			this.children().eq(index).before(this.children().last());
		}
	}
	return this;
}
jQuery.fn.appendText = function(text) {
    return this.each(function() {
        var textNode = document.createTextNode(text);
        $(this).append(textNode);
    });
};
jQuery.fn.prependText = function(text) {
    return this.each(function() {
        var textNode = document.createTextNode(text);
        $(this).prepend(textNode);
    });
};
function readFile(file){
	return new Promise((resolve, reject) => {
		if(BinUtils.isFile(file))
		{
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				resolve({code:0, content:e.target.result});
			});
			reader.readAsBinaryString(file);
		}else{
			reject({code:1, description:"Argument is not a valid file."});
		}
	});
}
function download(fileName, data, type="text/plain") {
	// Create an invisible A element
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);
  
	// Set the HREF to a Blob representation of the data to be downloaded
	a.href = window.URL.createObjectURL(
	  new Blob([data], { type:data.type || type })
	);
  
	// Use download attribute to set set desired file name
	a.setAttribute("download", fileName);
  
	// Trigger the download by simulating click
	a.click();
  
	// Cleanup
	window.URL.revokeObjectURL(a.href);
	document.body.removeChild(a);
}

function downloadFromUrl(filename, url, post) {
	return new Promise((resolve, reject) => {
		var postEnc, method;
		if (post == null)
		{
			postEnc = '';
			method = 'GET';
		}
		else
		{
			method = 'POST';
			postEnc = new FormData();
			for(var i in post)
				postEnc.append(i, post[i]);
		}
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				//this.response is what you're looking for
				download(filename, this.response);
				resolve(this);
			}else if (this.readyState == 4 && this.status != 200){
				reject(this);
			}
		}
		xhr.open(method, url);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'blob';
		xhr.send(postEnc);  
	});
}
//https://gist.github.com/colemanw/9c9a12aae16a4bfe2678de86b661d922#gistcomment-2632557
function getFontAwesomeIconFromMIME(mimeType) {
	var fa = "fa-file";
	if(mimeType)
	{
		// List of official MIME Types: http://www.iana.org/assignments/media-types/media-types.xhtml
		var icon_classes = {
			// Media
			image: "fa-file-image",
			audio: "fa-file-audio",
			video: "fa-file-video",
			// Documents
			"application/pdf": "fa-file-pdf",
			"application/msword": "fa-file-word",
			"application/vnd.ms-word": "fa-file-word",
			"application/vnd.oasis.opendocument.text": "fa-file-word",
			"application/vnd.openxmlformatsfficedocument.wordprocessingml":"fa-file-word",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":"fa-file-word",
			"application/vnd.ms-excel": "fa-file-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"fa-file-excel",
			"application/vnd.openxmlformatsfficedocument.spreadsheetml":"fa-file-excel",
			"application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel",
			"application/vnd.ms-powerpoint": "fa-file-powerpoint",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation":"fa-file-powerpoint",
			"application/vnd.openxmlformatsfficedocument.presentationml":"fa-file-powerpoint",
			"application/vnd.oasis.opendocument.presentation": "fa-file-powerpoint",
			"text/plain": "fa-file-text",
			"text/html": "fa-file-code",
			"text/javascript": "fa-file-code",
			"application/json": "fa-file-code",
			// Archives
			"application/vnd.ms-cab-compressed": "fa-file-archive",
			"application/gzip": "fa-file-archive",
			"application/zip": "fa-file-archive"
		};

		for (var key in icon_classes) {
			if (icon_classes.hasOwnProperty(key)) {
				if (mimeType.search(key) === 0) {
					// Found it
					fa = icon_classes[key];
					break;
				}
			}
		}
	}
	return fa;
}