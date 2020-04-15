var TwoWayMap = function (map) {
    if (map) {
        for (var prop in map) {
            this[prop] = map[prop];
            this[map[prop]] = prop;
        }
    }

    return new Proxy(this, {
        deleteProperty: function (target, property) {
            Reflect.deleteProperty(target, target[property]);
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver) {
            target[property] = value;
            target[value] = property;
            return true;
        },
        get: function (target, property, receiver) {
            return Reflect.get(...arguments);
        }
    });
};