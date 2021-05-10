import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var WizardStep = function (_props) {
    let _defaultParams = {
        stepHeading: undefined,
        detailLabel: undefined,
        id_form: undefined
    };
    _props = ObjectUtils.extend(false, false, _defaultParams, _props);

    this.stepHeading = _props.stepHeading;
    this.detailLabel = _props.detailLabel;
    this.id_form = _props.id_form;

    Object.defineProperty(this, "props", {
        get: function props() {
            let obj = {};
            for (let prop in _props) {
                if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop) && (typeof _props[prop] != 'function') && (prop != "ownerDocument"))
                    obj[prop] = this[prop];
            }
            return obj;
        },
        configurable: true
    });
};
WizardStep.prototype.ctor = 'WizardStep';
export {
    WizardStep
};