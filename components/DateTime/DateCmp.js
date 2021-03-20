/**
 * This is a DateCmp Input Element
 *
 * Kreatx 2019
 */
 var DateCmp = function (_props) {
    let _self = this;

    this.template = function () {
        return "<input data-triggers='input' type='date' id='" + this.domID + "'/>";
    };

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD/MM/YYYY',
        displayFormat: 'DD/MM/YYYY',
        internalFormat: "YYYY-MM-DD",
        value: null,
        min: null,
        max: null        
    };

    _props = extend(false, false, _defaultParams, _props);

    let r = DateTime.call(this, _props);

    return r;
};
DateCmp.prototype.ctor = "DateCmp";