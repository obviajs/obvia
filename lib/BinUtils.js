var BinUtils = function()
{
 
}
BinUtils.b64toBlob = function (b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
};
BinUtils.isFile = function (input) {
    if ('File' in window && input instanceof File)
        return true;
    else return false;
};
 
BinUtils.isBlob = function (input) {
    if ('Blob' in window && input instanceof Blob)
        return true;
    else return false;
};
BinUtils.isFileList = function (input) {
    if ('FileList' in window && input instanceof FileList)
        return true;
    else return false;
};
File.prototype.toJSON = function () {
    return {
        'lastModified': this.lastModified,
        'lastModifiedDate': this.lastModifiedDate,
        'name': this.name,
        'size': this.size,
        'type': this.type
    };
};