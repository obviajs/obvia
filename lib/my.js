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
jQuery.fn.insertAt = function(index, element) {
	var lastIndex = this.children().length;
	if (index < 0) {
	  index = Math.max(0, lastIndex + 1 + index);
	}
	this.append(element);
	if (index < lastIndex) {
	  this.children().eq(index).before(this.children().last());
	}
	return this;
  }