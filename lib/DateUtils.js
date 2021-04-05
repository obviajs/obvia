
DateUtils = {};
DateUtils.isLeapYear = function (year) {
    return (year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0);
};
DateUtils.format = function (value, inputFormat, outputFormat) {
    let m = moment(value, inputFormat);
    return m.isValid() ? m.format(outputFormat) : "-";
};