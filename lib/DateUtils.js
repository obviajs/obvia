var DateUtils = {};
DateUtils.isLeapYear = function (year) {
    return (year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0);
};
DateUtils.format = function (value, inputFormat, outputFormat) {
    let m = dayjs(value, inputFormat);
    return m.isValid() ? m.format(outputFormat) : "-";
};
DateUtils.Interval = function (dtMoment, dtStartMoment) {
    let friendlyInterval = "";
    let mn = dayjs(dtStartMoment) || dayjs();
    let s = Math.max(0, dtMoment.diff(mn, 'seconds'));
    let d = Math.floor(s / (24 *3600));
    
    let h = Math.floor((s - (d * 24 * 3600)) / 3600);

    let m = Math.floor((s - (d * 24 * 3600) - (h*3600)) / 60);
    s = s - (d * 24 * 3600) - (h * 3600) - (m * 60);

    if (s > 0 || m>0)
        friendlyInterval = `${s} sekonda`;
    if (m > 0 || h>0)
        friendlyInterval = `${m} minuta, ` + friendlyInterval;
    if (h > 0 || d>0)
        friendlyInterval = `${h} ore, ` + friendlyInterval;
    if (d > 0)
        friendlyInterval = `${d} dite, ` + friendlyInterval;
    return { "days": d, "hours": h, "minutes": m, "seconds": s, "friendlyInterval": friendlyInterval };
};
export {
    DateUtils  
};