DateUtils = {};
DateUtils.isLeapYear = function (year) {
    return (year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0);
};
DateUtils.format = function (value, inputFormat, outputFormat) {
    let m = moment(value, inputFormat);
    return m.isValid() ? m.format(outputFormat) : "-";
};
DateUtils.Interval = function (dtMoment) {
    let friendlyInterval = "";
    let mn = moment();
    let d = Math.max(0, dtMoment.diff(mn, 'days'));
    mn.add(d, 'days');
    
    let h = Math.max(0, dtMoment.diff(mn, 'hours'));
    mn.add(h, 'hours');

    let m = Math.max(0, dtMoment.diff(mn, 'minutes'));
    mn.add(m, 'minutes');

    let s = Math.max(0, dtMoment.diff(mn, 'seconds'));

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