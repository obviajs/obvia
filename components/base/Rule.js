import { UseBindings } from "/obvia/lib/UseBindings.js";
var Rule = function (_rule) {
    let _self = this, _hasBindings = false, _dependencies = [];    
    
    UseBindings.call(this, _rule);
    
    let _childBindingExecuted = function (e) {
        _self.bindingsManager.trigger(e);
    };
    
    this.toJSON = function () {
        let o = {};
        for (let prop in _rule) {
            o[prop] = _self[prop];
        }
        return o;
    };

    if (_rule) {
        for (let prop in _rule) {
            if (prop == "rules" && _rule[prop]) {
                let len = _rule[prop].length;
                this[prop] = new Array(len);                
                for (let i = 0; i < len; i++){
                    this[prop][i] = new Rule(_rule[prop][i]);
                    this[prop][i].bindingsManager.on("bindingExecuted", _childBindingExecuted);
                    this[prop][i].parent = this;
                    _dependencies.push(this[prop][i]);
                    _hasBindings ||= this[prop][i].bindings.length > 0;
                }
            }else
                this[prop] = _rule[prop];
        }
    }

    let _applyBindings = this.applyBindings;
    this.applyBindings = function () {
        _applyBindings();
        let len = _dependencies.length;
        for (let i = 0; i < len; i++) {
            _dependencies[i].applyBindings();
        }
    };

    _hasBindings ||= this.bindings.length > 0;

    Object.defineProperty(this, "hasBindings", {
        get: function hasBindings() {
            return _hasBindings;
        }
    });
};
export {
    Rule
};