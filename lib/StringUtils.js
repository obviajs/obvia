function isString(v) {
    return (typeof v === 'string' || v instanceof String);
}

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
Object.defineProperty(String.prototype, "hashCode", {enumerable: false});

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };
Object.defineProperty(String.prototype, "trim", {enumerable: false});

/**
 * Format bytes as 1111 => 1.1KB 
 * @param {string} bytes 
 * @param {number} precision 
 */
var formatBytes = function (bytes, precision = 2) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB'];

    var bytes = Math.max(bytes, 0);
    var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
    pow = Math.min(pow, units.length - 1);

    bytes /= Math.pow(1024, pow);

    return Math.round(bytes, precision) + ' ' + units[pow];
}

/**
 * Return extension form file path
 * @param {string} fileName 
 * @param {boolean} preserveCase 
 */
var fileExtension = function (fileName, preserveCase = true) {
    var ext = (/[^./\\]*$/.exec(fileName) || [""])[0];
    return preserveCase ? ext : ext.toLowerCase();
}
/**
 * Return uuid generated
 */
var guid = function(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var truncate = function(string, maxLength = 30, dots = true) {
    var truncated = string.substring(0, maxLength);

    if (dots && string.length > maxLength)
        truncated += " ..."
    
    return truncated;
}

var convertToCamelCase = function (str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

// Hide method from for-in loops
Object.defineProperty(String.prototype, "formatUnicorn", {enumerable: false});

String.prototype.random = function()
{ 
	var length = 10;
	var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
	var str ='id';
	for (var p = 0; p < length; p++) 
	{
		str += characters[Math.round(Math.random()*100) % 35];
	}
	return str;
}
// Hide method from for-in loops
Object.defineProperty(String.prototype, "random", {enumerable: false});

String.prototype.stripNonNumeric = function(d){d+="";var b=/^\d|\.|-$/;var a="";for(var c=0;c<d.length;c++){if(b.test(d.charAt(c))){if(!((d.charAt(c)=="."&&a.indexOf(".")!=-1)||(d.charAt(c)=="-"&&a.length!=0))){a+=d.charAt(c)}}}return a};
Object.defineProperty(String.prototype, "stripNonNumeric", {enumerable: false});

String.prototype.isNonblank = function(s) 
{
	var isNonblank_re    = /\S/;
   return ((s).search (isNonblank_re) != -1);
}
Object.defineProperty(String.prototype, "isNonblank", {enumerable: false});

var soundex = function (s) {
    var a = s.toLowerCase().split(''),
        f = a.shift(),
        r = '',
        codes = {
            a: '', e: '', i: '', o: '', u: '',
            b: 1, f: 1, p: 1, v: 1,
            c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
            d: 3, t: 3,
            l: 4,
            m: 5, n: 5,
            r: 6
        };

    r = f +
        a
        .map(function (v, i, a) { return codes[v] })
        .filter(function (v, i, a) {
            return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
        })
        .join('');

    return (r + '000').slice(0, 4).toUpperCase();
};
//Levenshtein
var getEditDistance = function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
  
    var matrix = [];
  
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
  
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
  
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
  
    return matrix[b.length][a.length];
};

var StringMatchType = {
    "STARTS_WITH":0,
    "CONTAINS":1,
    "LEVENSHTEIN":2,
    "SOUNDEX":3
};

function sortBestMatch(ac, toMatch, matchType, key){
    var ordered = [];
    for(var i=0;i<ac.length;i++)
    {
        if(key)
            against = ac[i][key];
        else
            against = ac[i];
        var points = getPoints(against.toLowerCase(), toMatch.toLowerCase(), matchType);
        ordered.push({"index":i, "points":points});
        var current = ordered[ordered.length-1];
        var cpos = ordered.length-1;
        for(var j=0;j<ordered.length-1;j++)
        {
            if(current.points > ordered[j].points)
            {
                var tmp = ordered[cpos];
                ordered[cpos] = ordered[j];
                ordered[j] = tmp;
                cpos = j;
            }
        }
    }
    var orderedAc = [];
    for(var i=0;i<ordered.length;i++){
        orderedAc.push(ac[ordered[i].index]);
    }
    return orderedAc;
}
function getPoints(against, toMatch, matchType){
    var points = 0;
    switch(matchType)
    {
        case StringMatchType.STARTS_WITH:
            if(against.startsWith(toMatch))
                points = toMatch.length;
            else if(toMatch.length>1)
                points = getPoints(against, toMatch.substr(0, toMatch.length-1), StringMatchType.STARTS_WITH);
            break;
        case StringMatchType.CONTAINS:
            if(toMatch.length>0){
                var n = occurrences(against, toMatch);
                points = n* Math.pow(2, toMatch.length) + getPoints(against, toMatch.substr(0, toMatch.length-1), StringMatchType.CONTAINS);
            }
            break;
        case StringMatchType.LEVENSHTEIN:
            points = 1000 - getEditDistance(against, toMatch);
            break;
        case StringMatchType.SOUNDEX:
            points = (soundex(against) == soundex(toMatch))?(1000 - getEditDistance(against, toMatch)):0;
            break;
    }
    return points;
}

function occurrences(string, subString, allowOverlapping=false){

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}