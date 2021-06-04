import { DateCmp } from "../../components/DateTime/DateCmp.js";

var myDate = new DateCmp({
    id: 'datetime',
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    displayFormat: 'YYYY/MM/DD',
    value: '27/12/2019'
});

myDate.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});

export { myDate }