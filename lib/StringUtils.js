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