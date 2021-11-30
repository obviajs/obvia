import { EventDispatcher } from "/obvia/lib/EventDispatcher.js";
var ValidationManager = function () {
    let _self, _validators = [];
    this.$el = $(this);

    this.getGroupValidators = function(validationGroup = null){
        if (validationGroup) {
            let groups = _validators.groupReduce((currentValue, index) => {
                return currentValue.validationGroup;
            });
            return groups[validationGroup];
        }
    };
        
    this.validate = function (validationGroup = null) {      
        let promises = [];
        if (validationGroup) {
            let groups = _validators.groupReduce((currentValue, index) => { 
                return currentValue.validationGroup;
            });
            let av = groups[validationGroup];
            if (av) {
                let len = av.length;
                for (let i = 0; i < len; i++) {
                    if (av[i]) { 
                        promises.push(av[i].validate());
                    }                    
                }
            }
        } else {
            let len = _validators.length;
            for (let i = 0; i < len; i++) { 
                if (_validators[i]) { 
                    promises.push(_validators[i].validate());
                }
            }
        }
        return Promise.all(promises);
    };
    this.reset = function (validationGroup = null)
    {
        let av;
        if (validationGroup)
        {
            let groups = _validators.groupReduce((currentValue, index) =>
            {
                return currentValue.validationGroup;
            });
            av = groups[validationGroup];
        } else
        {
            av = _validators;
        }        
        if (av)
        {
            let len = av.length;
            for (let i = 0; i < len; i++)
            {
                if (av[i])
                {
                    av[i].isValid = true;
                }
            }
        }
    };
    this.add = function (validator) {
        _validators.push(validator);
    };
    
    this.remove = function (validator) {
        let ind = _validators.indexOf(validator);
        if (ind > -1) {
            _validators.splice(ind, 1);
        }
    };
};
ValidationManager.ctor = "ValidationManager";
ValidationManager.instance = null;
ValidationManager.getInstance = function () {
    if (!ValidationManager.instance)
        ValidationManager.instance = new ValidationManager();
    return ValidationManager.instance;
};     
ValidationManager.prototype = Object.create(EventDispatcher.prototype);
export {
    ValidationManager
};