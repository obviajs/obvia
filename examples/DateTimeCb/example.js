import { DateTimeCb } from "../../components/DateTime/DateTimeCb.js";
import { DateTimeMode } from "../../components/DateTime/DateTimeMode.js";

var myDateTimeCb = new DateTimeCb({
    id: 'dayMonthYear',
    mode: DateTimeMode.DATE,
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    value: '06/06/2006'
});

$(document.body).append(await myDateTimeCb.render().$el);

export { myDateTimeCb }