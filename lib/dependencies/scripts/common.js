/*
 |---------------------------------------------------------
 |  A JavaScript Helper Library For Kreatx
 |---------------------------------------------------------
 |	Undocumented Functions
 |---------------------------------------------------------
 */
function get(name) {
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
		return decodeURIComponent(name[1]);
}

function mydf(ts) {
	if (ts == "" || ts == null || ts == "-") return "-";
	var ts_arr = ts.split("T");
	ts = ts_arr[1];
	var ds = ts_arr[0];
	ts_arr = ds.split("-");
	ds = ts_arr[2] + '/' + ts_arr[1] + '/' + ts_arr[0];
	return ds + " " + ts;
}

function testvalid(type, value) {
	var validator = {
		decimal: {
			exp: '^\\d*[0-9](\\.\\d*[0-9])?$'
		},
		email: {
			exp: "^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$"
		},
		ipaddress: {
			exp: "^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$"
		},
		date: {
			exp: '^\\d{4}-(0[0-9]|1[0,1,2])-([0,1,2][0-9]|3[0,1])$'
		},
		time: {
			exp: "^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$"
		},
		url: {
			exp: "^(http[s]?://|ftp://)?(www\.)?[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov)$"
		},
		uint: {
			exp: '^[0-9]+$'
		},
		sint: {
			exp: '^[-]?[0-9]+[\.]?[0-9]+$'
		}
	};

	if (validator[type] == undefined) return true;
	var reg = new RegExp(validator[type].exp, "i");
	return (reg.test(value));
}

function isNonblank(s) {
	var isNonblank_re = /\S/;
	return ((s).search(isNonblank_re) != -1);
}

function getDateFromString(dtStr) {
	var arrp = dtStr.split("/");
	var d = new Date();
	d.setYear(2000 + arrp[2]);
	d.setMonth(arrp[1] - 1, arrp[0]);
	return d;
}

/**
 * Decodes a variable {str} into a variabe called a with the same value
 * @param {string} str 
 */
function decode(str) {
	return eval("a=" + str);
}

/**
 * Strip numeric Charachters from a string
 * @param {string} d 
 */
function stripNonNumeric(d) {
	d += "";
	var b = /^\d|\.|-$/;
	var a = "";
	for (var c = 0; c < d.length; c++) {
		if (b.test(d.charAt(c))) {
			if (!((d.charAt(c) == "." && a.indexOf(".") != -1) || (d.charAt(c) == "-" && a.length != 0))) {
				a += d.charAt(c)
			}
		}
	}
	if (isNaN(a))
		a = "";
	return a;
}

/**
 * Encode a string with base64
 * @param {string} data 
 */
function base64_encode(data) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = '',
		tmp_arr = [];

	if (!data) {
		return data;
	}

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	var r = data.length % 3;

	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

/**
 * Decode a string with base64
 * @param {string} data 
 */
function base64_decode(data) {

	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = '',
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);

	dec = tmp_arr.join('');

	return dec.replace(/\0+$/, '');
}

/**
 * Push uniquely into an array
 * @param {string|number} el
 */

Array.prototype.pushUnique = function (el) {
	for (var i = 0; i < this.length; i++){
		if (el == this[i])
			return;
	}
	this.push(el);
}

/**
 *  Remove from array by value
 *	@param {string|number} el
 */
Array.prototype.remove = function (el) {
	this.splice(this.indexOf(el), 1);
}

/**
 * Check if object is empty
 * Usage - Object.isEmpty.call(myObj)
 * Can't extend Object.prototype because it breaks JavaScript hashtables
 * @returns {boolean}
 */
Object.isEmpty = function () {
	for (var props in this) {
		if (this[props]) {
			return false;
		}
	}
	return true;
}

