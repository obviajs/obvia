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