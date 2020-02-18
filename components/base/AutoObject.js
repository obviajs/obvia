var AutoObject = function () {    
    return new Proxy(this, {
        deleteProperty: function (target, property) {
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver) {
            target[property] = value;
            return true;
        },
        get: function (target, property, receiver) {
            if (target[property] == null) { 
                target[property] = {};
            }
            return Reflect.get(...arguments);
        }
    });
};