/**
 * This is a CreditCard Component
 * 
 * Kreatx 2019
*/
var CreditCard = function(_props){
    var _self = this;
    var  card_number_error;
    var  card_month_expire;
    var  card_cvv_error;
    var  card_name_error;

    var _defaultParams = {
        id:"creditCard",
      
    }

    var _cardNumber;
    var _monthExpire;
    var _yearExpire;
    var _cvv;
    var _fullName;
    var _label_error;
    var _select_month = function(){

        var _dpMonth = [];
        _dpMonth[0] = {"value":"MM", "label":"MM"};
        for (var i = 1; i < 13; i++) {
            _dpMonth[i] = {"value": i, "label": CalendarConstants.Months[i-1]};
        }
        return _dpMonth;
    }

    var _select_year = function(){
         
        var _dpYear = [];
        var thisYear = new Date().getFullYear();
        _dpYear[0] = {"value":"YYYY","label":"YYYY"}
        for (var j = 1; j < 100; j++) {
            _dpYear[j] = {"value": thisYear, "label": thisYear}; 
            thisYear = thisYear +1;
        }
        return _dpYear;
    }
        
    
    this.beforeAttach = function(e){
        if(e.target.id == this.domID){

            this.$container = this.$el;
            fnContaierDelayInit();
            this.components = [_creditCardComponent];
            this.addComponents();
            _cardNumber = _self.children[_self.my("contaier")].children[_self.my("container_2")].children[_self.my("card_number_value")];
            _monthExpire = _self.children[_self.my("contaier")].children[_self.my("container_expire")].children[_self.my("expire_month_value")];
            _yearExpire =  _self.children[_self.my("contaier")].children[_self.my("container_expire")].children[_self.my("expire_year_value")];
            _cvv = _self.children[_self.my("contaier")].children[_self.my("container_expire")].children[_self.my("cvv_card")];
            _fullName = _self.children[_self.my("contaier")].children[_self.my("full_name_value")];     
            _label_error = _self.children[this.components[0].props.id].children[_self.my("container_label")].children[_self.my("label_error")];
            console.log("labelError",_label_error);
            EventDispatcher.listen([_fullName,_cardNumber, _monthExpire, _yearExpire , _cvv], "change", _change);
            e.preventDefault();
        }
    }

    var _change = function (e) {
        _label_error.label = " ";
        if( _fullName.value !== " "  && _cardNumber.value !== " " && _monthExpire.value !== null && _yearExpire.value !== null && _cvv.value !== ""){
        
            _validate_fullName();
            _validate_card_number();
            _validate_card_month();
            _validate_cvv();
            
            
            validationErrors = card_name_error | card_number_error | card_month_expire | card_cvv_error ;
            console.log("VERROR",validationErrors)

            if(validationErrors == 1){
                _label_error.visible = true;
            }else{
                _label_error.visible = false;
            }
            var classes = _fullName.classes.slice(0);
            var classesCard = _cardNumber.classes.slice(0);
            var classesMonth = _monthExpire.classes.slice(0);
            var classesCvv = _cvv.classes.slice(0);
            if ((validationErrors & card_name_error > 0 )){

                classes.pushUnique("fc-label-error");
                _fullName.classes = classes;
                _label_error.label = _label_error.label.toString() + "Invalid Name",
                console.log("Error Name Invalid");
            }else {
                var ind = classes.indexOf("fc-label-error");
                if(ind>-1){
                    classes.pop("fc-label-error");
                }
                _fullName.classes = classes;
            }
            if (validationErrors & card_number_error > 0 ){

                classesCard.pushUnique("fc-label-error");
                _cardNumber.classes = classesCard;
                _label_error.label = _label_error.label.toString()  + "\n" + "Invalid CardNumber" ; 
                console.log("Error CardNumber");
            }else {
                var ind = classesCard.indexOf("fc-label-error");
                if(ind>-1){
                    classesCard.pop("fc-label-error");
                }
                _cardNumber.classes = classesCard;
            }
            if ((validationErrors & card_month_expire > 0 )){

                classesMonth.pushUnique("fc-label-error");
                _monthExpire.classes = classesMonth;
                _label_error.label = _label_error.label.toString() + "\n" + "Invalid Month",
                console.log("Error Month Expire ");
            }else {
                var ind = classesMonth.indexOf("fc-label-error");
                if(ind>-1){
                    classesMonth.pop("fc-label-error");
                }
                _monthExpire.classes = classesMonth;
            }
           
            if ((validationErrors & card_cvv_error > 0 )){

                classesCvv.pushUnique("fc-label-error");
                _cvv.classes = classesCvv;
                _label_error.label = _label_error.label.toString() + "\n" + "Invalid CVV",
                console.log("Error CVV Invalid ");
            }else {

                var ind = classesCvv.indexOf("fc-label-error");
                if(ind>-1){
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
    this.valid_credit_card = function(value){

        //only digits,dashes or spaces
        if(/[^0-9-\s]+/.test(value))
        return false;
        
        let nCheck = 0, bEven = false;
        //remove all non Digit charachters
        value = value.replace(/\D/g,"");

        for(var i = value.length-1;i>=0;i--){
            var cDigit = value.charAt(i);
            var nDigit = parseInt(cDigit,10);
            if(bEven && (nDigit *=2)>9)
            nDigit -=9;
            nCheck += nDigit;
            bEven = !bEven; 
        }

        return (nCheck%10) == 0 ;
    }

    var _validate_card_number = function(){
       
        let number = _self.children[_self.my("contaier")].children[_self.my("container_2")].children[_self.my("card_number_value")].$el[0].value;
       
        card_number_error;
        if( (number && _self.valid_credit_card(number) &&
        number.length == 16 && (number[0] == 4 || number[0] == 5 && number[1] >= 1 && number[1] <= 5 ) || 
        number.length == 15 && (number.indexOf("34") == 0 || number.indexOf("37") == 0) || 
        number.length == 13 && number[0] == 4
        ) == false)
        {
            card_number_error = 1;
        }
        else {
            card_number_error = 0;
        }
        return card_number_error;
    }

   
 
    var _validate_card_month = function(){

    let valueForm = _monthExpire.value;
    let yearValue = _yearExpire.value;
    let resultFlag;
        var expired = false;
        if (valueForm && yearValue){
            var month= parseInt(valueForm,10);
            var year = parseInt(yearValue,10);
            var now = new Date();
            var nowMonth = now.getMonth()+1;
            var nowYear = now.getFullYear();
            expired = (nowYear > year)|| ((nowYear == year) && (nowMonth > month));
            resultFlag = (month > 0) && (month < 13)  

            if(!resultFlag || expired){
                card_month_expire = 1;     
            }
            else {
                card_month_expire = 0;
            }
            return card_month_expire;
        }
    }

 
    var _validate_cvv = function(){
        var cvv = _self.children[_self.my("contaier")].children[_self.my("container_expire")].children[_self.my("cvv_card")].$el[0].value;

        if( cvv.match(/^\d{3}$/)){
            card_cvv_error = 0;
        }
        else{
            card_cvv_error = 1;
        }
        return  card_cvv_error ;
    }

    
    var _validate_fullName = function(){
        let full_name = _fullName.$el[0].value;
        // var validate_name = /^([A-Za-z]{3, })\s([A-Za-z]{3, })$/;
        var validate_name = /^[a-zA-Z]+ [a-zA-Z]+$/;
        let isValid = validate_name.test(full_name);
        
        if(isValid){
            card_name_error = 0;
        }
        else {
            card_name_error = 1;
        }
        return  card_name_error;
    }

   
    var _creditCardComponent;
    var fnContaierDelayInit = function(){
        _creditCardComponent = {
            ctor: Container,
            props: {
                id:"contaier_"+_self.guid,
                type:ContainerType.COLUMN,
                spacing:{colSpan:8},
                guid:_self.guid,
                classes:["fc-out-div"],
                components:[
                    {
                        ctor:Label,
                        props:{
                            id:'name_'+_self.guid,
                            spacing:{colSpan:8},
                            label:'Full name (on the card)',
                            classes:['text-emphasize'],
                        }
                    },
                    {
                        ctor:TextInput,
                        props:{
                            id:'full_name_value_'+_self.guid,
                            spacing:{colSpan:8},
                            value:" ",
                            classes:["fc-controll"],
                        }
                    },
                    {
                        ctor:Label,
                        props:{
                            id:'card_number_'+_self.guid,
                            spacing:{colSpan:8},
                            label:'Card number',
                            classes:['text-emphasize'],
                            
                        }
                    },
                    {
                        ctor:Container,
                        props:{
                        id:'container_2_'+_self.guid,
                        type:ContainerType.ROW,
                        spacing:{colSpan:10},
                            components:[
                                {
                                    ctor:TextInput,
                                    props:{
                                        id:'card_number_value_'+_self.guid,
                                        value:" ",
                                        spacing:{colSpan:6},
                                        classes:["fc-controll"],
                                    }
                                },
                                {
                                    ctor:Label,
                                    props:{
                                        id:'fab',
                                        spacing:{colSpan:2},
                                        labelType:LabelType.i,
                                        classes:["fab","fa-cc-visa fa-4x","fc-icon"]
                                    }
                                },
                                {
                                    ctor:Label,
                                    props:{
                                        id:'fab',
                                        spacing:{colSpan:2},
                                        labelType:LabelType.i,
                                        classes:["fab","fa-cc-amex fa-4x","fc-icon"]
                                    }
                                },
                                {
                                    ctor:Label,
                                    props:{
                                        id:'fab',
                                        spacing:{colSpan:2},
                                        labelType:LabelType.i,
                                        classes:["fab","fa-cc-mastercard fa-4x "]
                                    }
                                },    
                            ]
                        }
                    },
                    {
                        ctor:Label,
                        props:{
                            id:"expiration_"+_self.guid,
                            spacing:{colSpan:6},
                            label:"Expiration",
                            classes:["text-emphasize"]
                        }
                    },
                    {
                        ctor:Label,
                        props:{
                            id:"cvv_"+_self.guid,
                            spacing:{colSpan:4},
                            label:'CVV',
                            classes:["text-emphasize"],
                            components:[{
                                ctor:Label,
                                props:{
                                    id:'fa',
                                    labelType:LabelType.i,
                                    classes:["fa","fa-question-circle"]
                                }
                            }]
                        }
                    },
                    {
                        ctor:Container,
                        props:{
                            type:ContainerType.COLUMN,
                            id:"container_expire_"+_self.guid,
                            spacing:{colSpan:10},
                            components:[
                                {
                                    ctor:Select,
                                    props:{
                                        id:"expire_month_value_"+_self.guid,
                                        spacing: {rowSpan:3,colSpan:3},
                                        dataProvider:_select_month(),
                                        classes:["fc-controll","text-select"],
                                        labelField:"label",
                                        valueField:"value"
                                    }
                                },
                                {
                                    ctor:Select,
                                    props:{
                                        id:"expire_year_value_"+_self.guid,
                                        spacing: {rowSpan:3,colSpan:3},
                                        dataProvider:_select_year(),
                                        classes:["fc-controll","text-select_year"],
                                        labelField:"label",
                                        valueField:"value"
                                    }
                                },
                                {
                                    ctor:TextInput,
                                    props:{
                                        id:"cvv_card_"+_self.guid,
                                        spacing:{rowSpan:2,colSpan:2},
                                        value:"",
                                        classes:["fc-controll"]
                                    }
                                },
                            ]
                        }
                    },
                    {
                        ctor:Container,
                        props:{
                            type:ContainerType.COLUMN,
                            id:"container_label_"+_self.guid,
                            spacing:{colSpan:10},
                            components:[
                                {
                                    ctor: Label,
                                    props:{
                                        id:"label_error_"+_self.guid,
                                        spacing:{colSpan:10},
                                        label: " " ,
                                        classes:['is-invalid'],
                                        visible:false,
                                    }
                                }    
                            ]   
                        }
                    }
                ]
            }
        }
        _creditCardComponent.props.ownerDocument = _self.ownerDocument;
    }

    
    _props = extend(false,false,_defaultParams,_props);
    let _validationErrors  = _props.validationErrors;
    var _guidField = _props.guidField;

    Container.call(this,_props);

}
CreditCard.prototype.ctor = "CreditCard";