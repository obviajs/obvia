/**
 * This is a CreditCard Component
 * 
 * Kreatx 2019
*/
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { CalendarConstants } from "/obvia/components/Calendar/CalendarConstants.js";

var CreditCard = function (_props) {
    let _self = this;
    let card_number_error;
    let card_month_expire;
    let card_cvv_error;
    let card_name_error;
    let validationErrors;

    let _defaultParams = {
        id: "creditCard",
    };

    let _cardNumber;
    let _monthExpire;
    let _yearExpire;
    let _cvv;
    let _fullName;
    let _label_error;
    let _dpMonth = CreditCard.dpMonth, _dpYear = CreditCard.dpYear;

    let _initDP = function () {
        if (!CreditCard.init) {
            _dpMonth[0] = { "value": "MM", "label": "MM" };
            for (let i = 1; i < 13; i++) {
                _dpMonth[i] = { "value": i, "label": CalendarConstants.Months[i - 1] };
            }

            let thisYear = new Date().getFullYear();
            _dpYear[0] = { "value": "YYYY", "label": "YYYY" };
            for (let j = 1; j < 100; j++) {
                _dpYear[j] = { "value": thisYear, "label": thisYear };
                thisYear = thisYear + 1;
            }
        }
    };
   
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            _cardNumber = this.container.container_2.card_number_value;
            _monthExpire = this.container.container_expire.expire_month_value;
            _yearExpire = this.container.container_expire.expire_year_value;
            _cvv = this.container.container_expire.cvv_card;
            _fullName = this.container.full_name_value;
            _label_error = this.container.container_label.label_error;
            console.log("labelError", _label_error);
            EventDispatcher.listen([_fullName, _cardNumber, _monthExpire, _yearExpire, _cvv], "change", _change);
            e.preventDefault();
        }
    };

    let _change = function (e) {
        _label_error.label = " ";
        if (_fullName.value !== " " && _cardNumber.value !== " " && _monthExpire.value !== null && _yearExpire.value !== null && _cvv.value !== "") {
        
            _validate_fullName();
            _validate_card_number();
            _validate_card_month();
            _validate_cvv();
            
            
            validationErrors = card_name_error | card_number_error | card_month_expire | card_cvv_error;
            
            if (validationErrors == 1) {
                _label_error.visible = true;
            } else {
                _label_error.visible = false;
            }
            let classes = _fullName.classes.slice(0);
            let classesCard = _cardNumber.classes.slice(0);
            let classesMonth = _monthExpire.classes.slice(0);
            let classesCvv = _cvv.classes.slice(0);
            if ((validationErrors & card_name_error > 0)) {

                classes.pushUnique("fc-label-error");
                _fullName.classes = classes;
                _label_error.label = _label_error.label.toString() + "Invalid Name",
                    console.log("Error Name Invalid");
            } else {
                let ind = classes.indexOf("fc-label-error");
                if (ind > -1) {
                    classes.pop("fc-label-error");
                }
                _fullName.classes = classes;
            }
            if (validationErrors & card_number_error > 0) {

                classesCard.pushUnique("fc-label-error");
                _cardNumber.classes = classesCard;
                _label_error.label = _label_error.label.toString() + "\n" + "Invalid CardNumber";
                console.log("Error CardNumber");
            } else {
                let ind = classesCard.indexOf("fc-label-error");
                if (ind > -1) {
                    classesCard.pop("fc-label-error");
                }
                _cardNumber.classes = classesCard;
            }
            if ((validationErrors & card_month_expire > 0)) {

                classesMonth.pushUnique("fc-label-error");
                _monthExpire.classes = classesMonth;
                _label_error.label = _label_error.label.toString() + "\n" + "Invalid Month",
                    console.log("Error Month Expire ");
            } else {
                let ind = classesMonth.indexOf("fc-label-error");
                if (ind > -1) {
                    classesMonth.pop("fc-label-error");
                }
                _monthExpire.classes = classesMonth;
            }
           
            if ((validationErrors & card_cvv_error > 0)) {

                classesCvv.pushUnique("fc-label-error");
                _cvv.classes = classesCvv;
                _label_error.label = _label_error.label.toString() + "\n" + "Invalid CVV",
                    console.log("Error CVV Invalid ");
            } else {

                let ind = classesCvv.indexOf("fc-label-error");
                if (ind > -1) {
                    classesCvv.pop("fc-label-error");
                }
                _cvv.classes = classesCvv;
            }
        }
    };
    /*
        Luhn algorithm
        Takes a credit card string value and returns true on valid number
    */
    this.valid_credit_card = function (value) {

        //only digits,dashes or spaces
        if (/[^0-9-\s]+/.test(value))
            return false;
        
        let nCheck = 0, bEven = false;
        //remove all non Digit charachters
        value = value.replace(/\D/g, "");

        for (let i = value.length - 1; i >= 0; i--) {
            let cDigit = value.charAt(i);
            let nDigit = parseInt(cDigit, 10);
            if (bEven && (nDigit *= 2) > 9)
                nDigit -= 9;
            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    };

    let _validate_card_number = function () {
       
        let number = _self.container.container_2.card_number_value.value;
        if ((number && _self.valid_credit_card(number) &&
            number.length == 16 && (number[0] == 4 || number[0] == 5 && number[1] >= 1 && number[1] <= 5) ||
            number.length == 15 && (number.indexOf("34") == 0 || number.indexOf("37") == 0) ||
            number.length == 13 && number[0] == 4
        ) == false) {
            card_number_error = 1;
        }
        else {
            card_number_error = 0;
        }
        return card_number_error;
    };

   
 
    let _validate_card_month = function () {

        let valueForm = _monthExpire.value;
        let yearValue = _yearExpire.value;
        let resultFlag;
        let expired = false;
        if (valueForm && yearValue) {
            let month = parseInt(valueForm, 10);
            let year = parseInt(yearValue, 10);
            let now = new Date();
            let nowMonth = now.getMonth() + 1;
            let nowYear = now.getFullYear();
            expired = (nowYear > year) || ((nowYear == year) && (nowMonth > month));
            resultFlag = (month > 0) && (month < 13);

            if (!resultFlag || expired) {
                card_month_expire = 1;
            }
            else {
                card_month_expire = 0;
            }
            return card_month_expire;
        }
    };

 
    let _validate_cvv = function () {
        let cvv = _self.container.container_expire.cvv_card.value;

        if (cvv.match(/^\d{3}$/)) {
            card_cvv_error = 0;
        }
        else {
            card_cvv_error = 1;
        }
        return card_cvv_error;
    };
    
    let _validate_fullName = function () {
        let full_name = _fullName.$el[0].value;
        let validate_name = /^[a-zA-Z]+ [a-zA-Z]+$/;
        let isValid = validate_name.test(full_name);
        
        if (isValid) {
            card_name_error = 0;
        }
        else {
            card_name_error = 1;
        }
        return card_name_error;
    };
   
    let _creditCardComponent;
    let fnContaierDelayInit = function () {
        _creditCardComponent = [{
            ctor: Container,
            props: {
                id: "container",
                type: ContainerType.COLUMN,
                spacing: { colSpan: 8 },
                guid: _self.guid,
                classes: ["fc-out-div"],
                components: [
                    {
                        ctor: Label,
                        props: {
                            id: 'name',
                            spacing: { colSpan: 8 },
                            label: 'Full name (on the card)',
                            classes: ['text-emphasize'],
                        }
                    },
                    {
                        ctor: TextInput,
                        props: {
                            id: 'full_name_value',
                            spacing: { colSpan: 8 },
                            value: " ",
                            classes: ["fc-controll"],
                        }
                    },
                    {
                        ctor: Label,
                        props: {
                            id: 'card_number',
                            spacing: { colSpan: 8 },
                            label: 'Card number',
                            classes: ['text-emphasize'],
                            
                        }
                    },
                    {
                        ctor: Container,
                        props: {
                            id: 'container_2',
                            type: ContainerType.ROW,
                            spacing: { colSpan: 10 },
                            components: [
                                {
                                    ctor: TextInput,
                                    props: {
                                        id: 'card_number_value',
                                        value: " ",
                                        spacing: { colSpan: 6 },
                                        classes: ["fc-controll"],
                                    }
                                },
                                {
                                    ctor: Label,
                                    props: {
                                        id: 'fab',
                                        spacing: { colSpan: 2 },
                                        labelType: LabelType.i,
                                        classes: ["fab", "fa-cc-visa fa-4x", "fc-icon"]
                                    }
                                },
                                {
                                    ctor: Label,
                                    props: {
                                        id: 'fab',
                                        spacing: { colSpan: 2 },
                                        labelType: LabelType.i,
                                        classes: ["fab", "fa-cc-amex fa-4x", "fc-icon"]
                                    }
                                },
                                {
                                    ctor: Label,
                                    props: {
                                        id: 'fab',
                                        spacing: { colSpan: 2 },
                                        labelType: LabelType.i,
                                        classes: ["fab", "fa-cc-mastercard fa-4x "]
                                    }
                                },
                            ]
                        }
                    },
                    {
                        ctor: Label,
                        props: {
                            id: "expiration",
                            spacing: { colSpan: 6 },
                            label: "Expiration",
                            classes: ["text-emphasize"]
                        }
                    },
                    {
                        ctor: Label,
                        props: {
                            id: "cvv",
                            spacing: { colSpan: 4 },
                            label: 'CVV',
                            classes: ["text-emphasize"],
                            components: [{
                                ctor: Label,
                                props: {
                                    id: 'fa',
                                    labelType: LabelType.i,
                                    classes: ["fa", "fa-question-circle"]
                                }
                            }]
                        }
                    },
                    {
                        ctor: Container,
                        props: {
                            type: ContainerType.COLUMN,
                            id: "container_expire",
                            spacing: { colSpan: 10 },
                            components: [
                                {
                                    ctor: Select,
                                    props: {
                                        id: "expire_month_value",
                                        spacing: { rowSpan: 3, colSpan: 3 },
                                        dataProvider: _dpMonth,
                                        classes: ["fc-controll", "text-select"],
                                        labelField: "label",
                                        valueField: "value"
                                    }
                                },
                                {
                                    ctor: Select,
                                    props: {
                                        id: "expire_year_value",
                                        spacing: { rowSpan: 3, colSpan: 3 },
                                        dataProvider: _dpYear,
                                        classes: ["fc-controll", "text-select_year"],
                                        labelField: "label",
                                        valueField: "value"
                                    }
                                },
                                {
                                    ctor: TextInput,
                                    props: {
                                        id: "cvv_card",
                                        spacing: { rowSpan: 2, colSpan: 2 },
                                        value: "",
                                        classes: ["fc-controll"]
                                    }
                                },
                            ]
                        }
                    },
                    {
                        ctor: Container,
                        props: {
                            type: ContainerType.COLUMN,
                            id: "container_label",
                            spacing: { colSpan: 10 },
                            components: [
                                {
                                    ctor: Label,
                                    props: {
                                        id: "label_error",
                                        spacing: { colSpan: 10 },
                                        label: " ",
                                        classes: ['is-invalid'],
                                        visible: false,
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }];
        _creditCardComponent[0].props.ownerDocument = _self.ownerDocument;
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _initDP();
    fnContaierDelayInit();
    _props.components = _creditCardComponent;

    let r = Container.call(this, _props);
    return r;
};
CreditCard.prototype.ctor = "CreditCard";
CreditCard.init = false;
CreditCard.dpMonth = new Array(13);
CreditCard.dpYear = new Array(100);