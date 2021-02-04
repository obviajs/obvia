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
			exp: "^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$"
		},
		urlip: {
			exp: "/^https?\:\/\/[^\/\s]+(\/.*)?$/"
		},
		uint: {
			exp: '^[0-9]+$'
		},
		sint: {
			exp: '^[-]?[0-9]+[\.]?[0-9]+$'
		}
	};
	//console.log(validator[type].exp);
	if (validator[type] == undefined) return true;
	var reg = new RegExp(validator[type].exp, "i");
	return (reg.test(value));
}

function simpleAjax(url, data, fnsuccess, fnfailure, method = null) {
	//data should be hashmap i.e javascript Object
	data = data == undefined ? new Object() : data;
	//kill two stones with one bird here :)
	//data["ajax"] = String.random();
	method = method == null ? ((data && !Object.isEmpty(data)) ? "POST" : "GET") : method;
	$.ajax({
		type: method,
		url: url,
		data: data,
		timeout: 300000,
		cache: false,
		success: function (msg) {
			if (fnsuccess != undefined)
				fnsuccess(msg);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (fnfailure != undefined) {
				fnfailure(jqXHR, textStatus, errorThrown);
			}
		}
	});
}

function formatDate(date1) {
	return date1.getFullYear() + '-' +
		(date1.getMonth() < 9 ? '0' : '') + (date1.getMonth() + 1) + '-' +
		(date1.getDate() < 10 ? '0' : '') + date1.getDate() + ' ' +
		(date1.getHours() < 10 ? '0' : '') + date1.getHours() + ':' +
		(date1.getMinutes() < 10 ? '0' : '') + date1.getMinutes() + ':' +
		(date1.getSeconds() < 10 ? '0' : '') + date1.getSeconds();


}

function formatTime(date1) {
	return (date1.getHours() < 10 ? '0' : '') + date1.getHours() + ':' +
		(date1.getMinutes() < 10 ? '0' : '') + date1.getMinutes() + ':' +
		(date1.getSeconds() < 10 ? '0' : '') + date1.getSeconds();
}

function newwindow(url, title) {
	window.open(url, title, "status=0,resizable=1");
}

function fnGetDomain(url) {
	return url.match(/:\/\/(.[^/]+)/)[1];
}

function replace(s, charfind, charnew) {
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

function getBoundingClientOffset(target, x, y) {
	let box = target.getBoundingClientRect();
	return {
		x: x - box.right - box.width / 2,
		y: y - box.top - box.height / 2
	};
}

function printiframe(iframename) {
	//alert('bbb');
	window.frames[iframename].focus();
	if ($.browser == 'msie' && $.browser.version >= 7)
		window.frames[iframename].document.execCommand("print", false, null);
	else
		window.frames[iframename].print();
}


function compareNumbers(a, b) {
	return a - b
}

function addCommas(nStr) {
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

jQuery.fn.insertAt = function (element, index) {
	if (element) {
		var lastIndex = this.children().length;
		index = index > -1 ? index : lastIndex + 1;
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
jQuery.fn.appendText = function (text) {
	var textNode = document.createTextNode(text);
	$(this).append(textNode);
};
jQuery.fn.prependText = function (text) {
	var textNode = document.createTextNode(text);
	$(this).prepend(textNode);
};
jQuery.fn.mytext = function () {
	var str = '';

	this.contents().each(function () {
		if (this.nodeType == 3) {
			str += this.textContent || this.innerText || '';
		}
	});

	return str;
};

jQuery.fn.attributes = function (all = false) {
	let skip = [];
	if (!all) {
		skip = ["class", "type", "id", "name", "href", "src", "alt", "placeholder", "action",
			"method"
		];
	}
	if (this.length === 0) {
		return null;
	}
	let obj = {},
		len = this[0].attributes.length;
	for (let i = 0; i < len; i++) {
		let attr = this[0].attributes[i];
		if (attr.specified && skip.indexOf(attr.name) < 0)
			obj[attr.name] = attr.value;
	}
	return obj;
};

function readFile(file, mode = 0) {
	var modes = ["readAsText", "readAsBinaryString"];
	return new Promise((resolve, reject) => {
		if (BinUtils.isFile(file)) {
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				resolve({
					code: 0,
					content: e.target.result
				});
			});
			reader[modes[mode]](file);
		} else {
			reject({
				code: 1,
				description: "Argument is not a valid file."
			});
		}
	});
}

function download(fileName, data, type = "text/plain") {
	// Create an invisible A element
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);

	// Set the HREF to a Blob representation of the data to be downloaded
	a.href = window.URL.createObjectURL(
		new Blob([data], {
			type: data.type || type
		})
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
		if (post == null) {
			postEnc = '';
			method = 'GET';
		} else {
			method = 'POST';
			postEnc = new FormData();
			for (var i in post)
				postEnc.append(i, post[i]);
		}
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//this.response is what you're looking for
				download(filename, this.response);
				resolve(this);
			} else if (this.readyState == 4 && this.status != 200) {
				reject(this);
			}
		}
		xhr.open(method, url);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'blob';
		xhr.send(postEnc);
	});
}

function get(url, mimeType = "application/json") {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType(mimeType);
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				resolve({
					"status": this.status,
					"response": xhr.response || xhr.responseText
				});
			}
		};
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};
		xhr.send(null);
	});
}

//https://gist.github.com/colemanw/9c9a12aae16a4bfe2678de86b661d922#gistcomment-2632557
function getFontAwesomeIconFromMIME(mimeType) {
	var fa = "fa-file";
	if (mimeType) {
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
			"application/vnd.openxmlformatsfficedocument.wordprocessingml": "fa-file-word",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "fa-file-word",
			"application/vnd.ms-excel": "fa-file-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "fa-file-excel",
			"application/vnd.openxmlformatsfficedocument.spreadsheetml": "fa-file-excel",
			"application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel",
			"application/vnd.ms-powerpoint": "fa-file-powerpoint",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation": "fa-file-powerpoint",
			"application/vnd.openxmlformatsfficedocument.presentationml": "fa-file-powerpoint",
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

jQuery.event.special.touchstart = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("touchstart", handle, {
				passive: false
			});
		} else {
			this.addEventListener("touchstart", handle, {
				passive: true
			});
		}
	}
};
jQuery.event.special.mousewheel = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("mousewheel", handle, {
				passive: false
			});
		} else {
			this.addEventListener("mousewheel", handle, {
				passive: true
			});
		}
	}
};
jQuery.event.special.touchmove = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("touchmove", handle, {
				passive: false
			});
		} else {
			this.addEventListener("touchmove", handle, {
				passive: true
			});
		}
	}
};
jQuery.event.special.scroll = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("scroll", handle, {
				passive: false
			});
		} else {
			this.addEventListener("scroll", handle, {
				passive: true
			});
		}
	}
};
jQuery.event.special.wheel = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("wheel", handle, {
				passive: false
			});
		} else {
			this.addEventListener("wheel", handle, {
				passive: true
			});
		}
	}
};

// https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
// Reasonable defaults
var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;

var normalizeWheel = function ( /*object*/ event) /*object*/ {
	var sX = 0,
		sY = 0, // spinX, spinY
		pX = 0,
		pY = 0; // pixelX, pixelY

	// Legacy
	if ('detail' in event) {
		sY = event.detail;
	}
	if ('wheelDelta' in event) {
		sY = -event.wheelDelta / 120;
	}
	if ('wheelDeltaY' in event) {
		sY = -event.wheelDeltaY / 120;
	}
	if ('wheelDeltaX' in event) {
		sX = -event.wheelDeltaX / 120;
	}

	// side scrolling on FF with DOMMouseScroll
	if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
		sX = sY;
		sY = 0;
	}

	pX = sX * PIXEL_STEP;
	pY = sY * PIXEL_STEP;

	if ('deltaY' in event) {
		pY = event.deltaY;
	}
	if ('deltaX' in event) {
		pX = event.deltaX;
	}

	if ((pX || pY) && event.deltaMode) {
		if (event.deltaMode == 1) { // delta in LINE units
			pX *= LINE_HEIGHT;
			pY *= LINE_HEIGHT;
		} else { // delta in PAGE units
			pX *= PAGE_HEIGHT;
			pY *= PAGE_HEIGHT;
		}
	}

	// Fall-back if spin cannot be determined
	if (pX && !sX) {
		sX = (pX < 1) ? -1 : 1;
	}
	if (pY && !sY) {
		sY = (pY < 1) ? -1 : 1;
	}

	return {
		spinX: sX,
		spinY: sY,
		pixelX: pX,
		pixelY: pY
	};
};

function isSymbol(x) {
	return typeof x === 'symbol' ||
		(typeof x === 'object' && Object.prototype.toString.call(x) === '[object Symbol]');
}

//https://stackoverflow.com/a/53128599
//node_walk: walk the element tree, stop when func(node) returns false
function node_walk(node, func) {
	var result = func(node);
	for (node = node.firstChild; result !== false && node; node = node.nextSibling)
		result = node_walk(node, func);
	return result;
}

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
function getCaretPosition(elem) {
	var sel = window.getSelection();
	var cum_length = [0, 0];

	if (sel.anchorNode == elem)
		cum_length = [sel.anchorOffset, sel.extentOffset];
	else {
		var nodes_to_find = [sel.anchorNode, sel.extentNode];
		if (!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
			return undefined;
		else {
			var found = [0, 0];
			var i;
			node_walk(elem, function (node) {
				for (i = 0; i < 2; i++) {
					if (node == nodes_to_find[i]) {
						found[i] = true;
						if (found[i == 0 ? 1 : 0])
							return false; // all done
					}
				}

				if (node.textContent && !node.firstChild) {
					for (i = 0; i < 2; i++) {
						if (!found[i])
							cum_length[i] += node.textContent.length;
					}
				}
			});
			cum_length[0] += sel.anchorOffset;
			cum_length[1] += sel.extentOffset;
		}
	}
	if (cum_length[0] <= cum_length[1])
		return cum_length;
	return [cum_length[1], cum_length[0]];
}
//https://stackoverflow.com/a/41034697
function createRange(node, chars, range) {
	if (!range) {
		range = document.createRange();
		range.selectNode(node);
		range.setStart(node, 0);
	}

	if (chars.count === 0) {
		range.setEnd(node, chars.count);
	} else if (node && chars.count > 0) {
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.textContent.length < chars.count) {
				chars.count -= node.textContent.length;
			} else {
				range.setEnd(node, chars.count);
				chars.count = 0;
			}
		} else {
			for (var lp = 0; lp < node.childNodes.length; lp++) {
				range = createRange(node.childNodes[lp], chars, range);

				if (chars.count === 0) {
					break;
				}
			}
		}
	}
	return range;
}

function setCaretPosition(elem, chars) {
	if (chars >= 0) {
		let selection = window.getSelection();

		range = createRange(elem, {
			count: chars
		});

		if (range) {
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
}