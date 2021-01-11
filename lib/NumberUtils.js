function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}
Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};