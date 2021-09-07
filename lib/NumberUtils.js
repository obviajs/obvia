var NumberUtils = {};

NumberUtils.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};
NumberUtils.addCommas = function (nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};
NumberUtils.toFixed = function(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parseFloat(num.toString().match(re)[0]);
};
Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};

export {
    NumberUtils
};