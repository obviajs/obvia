
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var StringUtils = {};
/**
 * Test if passed variable is a Valid JSON String
 * @param {*} str the object that you want to test
 * @returns {Boolean} result, true if passed variable is a Valid JSON String
 */
StringUtils.isJSON = function(str) {
    if (!StringUtils.isString(str) || (/^\s*$/.test(str))) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
}
/**
 * Test if passed variable is a String
 * @param {*} v the object that you want to test
 * @returns {Boolean} result, true if passed variable is a String
 */
StringUtils.isString = function(v) {
    return (typeof v === 'string' || v instanceof String);
}
var BindingExpression = {
    nullable: false,
    expression: ""
}
/**
 * Test if passed String is a valid binding expression and return details
 * @param {*} str the object that you want to test
 * @returns {BindingExpression} result, the binding expression instance
 */
StringUtils.getBindingExp = function(str) {
    var exp = null;
    if (str && StringUtils.isString(str) && str.length > 2 && str[0] == '{' && str[str.length - 1] == '}') {
        exp = {
            expression: null,
            nullable: false
        };
        var nullable = false,
            s = 1;
        if (str[1] == '?') {
            s = 2;
            exp.nullable = true;
        }
        exp.expression = str.slice(s, -1);
    }
    return exp;
}
/**
 * Return a numeric hashCode for a string instance
 * @returns {Number} hash, the hash for the string
 */
String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
Object.defineProperty(String.prototype, "hashCode", {
    enumerable: false
});
/**
 * Trim non visible characters from a string instance
 * @returns {string} The trimmed string
 */
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/, '');
};
Object.defineProperty(String.prototype, "trim", {
    enumerable: false
});

/**
 * Format bytes as 1111 => 1.1KB 
 * @param {string} bytes 
 * @param {number} precision 
 * @returns {string} formatted string
 */
StringUtils.formatBytes = function (bytes, precision = 2) {
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
 * @returns {string} ext the extension part of the fileName
 */
var fileExtension = function (fileName, preserveCase = true) {
    var ext = (/[^./\\]*$/.exec(fileName) || [""])[0];
    return preserveCase ? ext : ext.toLowerCase();
}
/**
 * Generate nanoid, 2 times faster than GUID same collision probability
 * Taken from https://github.com/ai/nanoid/blob/main/nanoid.js
 */
StringUtils.nanoid = function(t=21){let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;){let n=63&r[t];e+=n<36?n.toString(36):n<62?(n-26).toString(36):n<63?"_":"-"}return e};
/**
 * Generate an uuid 
 * @returns {string} uuid The generated uuid
 */
StringUtils.guid = function () {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
/**
 * Escape a RegEx
 * @param {string} str the string containing the RegEx you want to escape 
 * @returns {string} Escaped RegEx string
 */
StringUtils.escapeRegExp = function (str)
{
    return String(str).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};
/**
 * Truncate a string to the specified length or to the closest word to the specified length
 * @param {string} str the string you want to truncate
 * @param {Number} maxLength the length of the string
 * @param {Boolean} dots set to true if you want to include elipsis at the end of the string
 * @param {Boolean} preserveWord set to true to truncate the string to the closest word to the specified length
 * @returns {string} the truncated string
 */
var truncate = function (string, maxLength = 30, dots = true, preserveWord = false) {

    var truncated = string.substring(0, preserveWord ? ((maxLength = string.indexOf(' ', maxLength - 1)) == -1 ? string.length : maxLength) : maxLength);
    if (dots && string.length > maxLength)
        truncated += " ..."
    return truncated;
};
/**
 * Convert a string in which words are separated with the minus or underscore character to camelCase
 * @param {string} str the string you want to convert
 * @returns {string} the camelCase string
 */
StringUtils.convertToCamelCase = function (str) {
    let pass1 = str.replace(/-([a-z])/gi, function (g) {
        return g[1].toUpperCase();
    });
    let pass2 = pass1.replace(/_([a-z])/gi, function (g) {
        return g[1].toUpperCase();
    });
    return pass2;
};
/**
 * This function replaces format placeholders in the string Ex: {0} or {key} with their provided values. This function is taken from StackOverflow.
 * @param {string|Number|array|object} values the value(s) for the placeholders
 * @returns {string} str the resulting string
 */
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments) :
                arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };

// Hide method from for-in loops
Object.defineProperty(String.prototype, "formatUnicorn", {
    enumerable: false
});
/**
 * Return a random string
 * @returns {string} str the resulting random string
 */
String.random = function () {
    var length = 10;
    var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    var str = 'id';
    for (var p = 0; p < length; p++) {
        str += characters[Math.round(Math.random() * 100) % 35];
    }
    return str;
}
/**
 * String non numeric characters from a string instance
 * @returns {string} str the resulting string
 */
String.prototype.stripNonNumeric = function (d) {
    d += "";
    var b = /^\d|\.|-$/;
    var a = "";
    for (var c = 0; c < d.length; c++) {
        if (b.test(d.charAt(c))) {
            if (!((d.charAt(c) == "." && a.indexOf(".") != -1) || (d.charAt(c) == "-" && a.length != 0))) {
                a += d.charAt(c);
            }
        }
    }
    return a;
};
Object.defineProperty(String.prototype, "stripNonNumeric", {
    enumerable: false
});
/**
 * Test if string is blank or not, i.e the string contains only space/tab characters
 * @param {string} s The string you want to test
 * @returns {Boolean} result true if the string if the string contains others characters than space, tab etc.
 */
String.prototype.isNonblank = function (s) {
    let isNonblank_re = /\S/;
    return ((s).search(isNonblank_re) != -1);
}
Object.defineProperty(String.prototype, "isNonblank", {
    enumerable: false
});
/**
 * Soundex of a string. Soundex is a phonetic algorithm for indexing names by sound, as pronounced in English. 
 * The goal is for homophones to be encoded to the same representation so that they can 
 * be matched despite minor differences in spelling
 * @param {string} s The string you want to encode
 * @returns {string} result The soundex encoded string.
 */
var soundex = function (s) {
    var a = s.toLowerCase().split(''),
        f = a.shift(),
        r = '',
        codes = {
            a: '',
            e: '',
            i: '',
            o: '',
            u: '',
            b: 1,
            f: 1,
            p: 1,
            v: 1,
            c: 2,
            g: 2,
            j: 2,
            k: 2,
            q: 2,
            s: 2,
            x: 2,
            z: 2,
            d: 3,
            t: 3,
            l: 4,
            m: 5,
            n: 5,
            r: 6
        };

    r = f +
        a
        .map(function (v, i, a) {
            return codes[v]
        })
        .filter(function (v, i, a) {
            return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
        })
        .join('');

    return (r + '000').slice(0, 4).toUpperCase();
};
/**
 * Calculate the Levenshtein distance of a string, a metric for measuring the difference between two sequences. 
 * Informally, the Levenshtein distance between two words is the minimum number of single-character edits required 
 * to change one word into the other.
 * @param {string} a The first string 
 * @param {string} a The second string 
 * @returns {Number} result The Levenshtein distance
 */
var getEditDistance = function (a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};

var StringMatchType = {
    "STARTS_WITH": 0,
    "CONTAINS": 1,
    "LEVENSHTEIN": 2,
    "SOUNDEX": 3
};
/**
 * Sort strings in a string collection or objects in an object collection based on the match 
 * to the provided parameter and results from the algorithm chosen. 
 * @param {string[]|object[]} ac The string or object collection you want to sort
 * @param {string} toMatch The string to match
 * @param {Number} matchType The algorith to be used for the string match
 * @param {string|string[]} If ac is an object collection key can be a property path or property chain locating 
 * the string property to match against toMatch
 * @returns {string[]|object[]} result The sorted colelction
 */
StringUtils.sortBestMatch = function(ac, toMatch, matchType, key, maxCount = null) {
    let ordered = [];
    let len = ac.length, against;
    var maxCount = maxCount ? maxCount : len;
    for (let i = 0; i < len; i++) {
        if (key)
            against = ObjectUtils.getChainValue(ac[i], key);
        else
            against = ac[i];
        let points = -100 * i;
        if (against)
            points = getPoints(against.toLowerCase(), toMatch.toLowerCase(), matchType);

        ordered.push({
            "index": i,
            "points": points
        });
        let current = ordered[ordered.length - 1];
        let cpos = ordered.length - 1;
        for (let j = 0; j < cpos; j++) {
            if (current.points > ordered[j].points) {
                let tmp = ordered[cpos];
                ordered[cpos] = ordered[j];
                ordered[j] = tmp;
                cpos = j;
            }
        }
    }
    let orderedAc = [];
    let slen = Math.min(maxCount, len);
    for (let i = 0; i < slen; i++) {
        orderedAc.push(ac[ordered[i].index]);
    }
    return orderedAc;
}
/**
 * Return a numeric value representing the closest matches with higher points.
 * @param {string} against The string to tst for a match
 * @param {string} toMatch The string to match
 * @param {Number} matchType The algorith to be used for the string match
 * @returns {Number} points The points (0-1000) for this match 
 */
function getPoints(against, toMatch, matchType) {
    var points = 0;
    switch (matchType) {
        case StringMatchType.STARTS_WITH:
            if (against.startsWith(toMatch))
                points = toMatch.length;
            else if (toMatch.length > 1)
                points = getPoints(against, toMatch.substr(0, toMatch.length - 1), StringMatchType.STARTS_WITH);
            break;
        case StringMatchType.CONTAINS:
            if (toMatch.length > 0) {
                var n = occurrences(against, toMatch);
                points = n * Math.pow(2, toMatch.length) + getPoints(against, toMatch.substr(0, toMatch.length - 1), StringMatchType.CONTAINS);
            }
            break;
        case StringMatchType.LEVENSHTEIN:
            points = 1000 - getEditDistance(against, toMatch);
            break;
        case StringMatchType.SOUNDEX:
            points = (soundex(against) == soundex(toMatch)) ? (1000 - getEditDistance(against, toMatch)) : 0;
            break;
    }
    return points;
}
/**
 * Look for ocurrences of a subString in a string
 * @param {string} string The string to look for subString ocurrences
 * @param {string} subString The string ocurrences you are looking for
 * @param {Boolean} allowOverlapping Whether to allow overlapping of ocurrences or not
 * @returns {Number} n Number of ocurrences found
 */
function occurrences(string, subString, allowOverlapping = false) {

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
export {
    StringUtils, StringMatchType
};