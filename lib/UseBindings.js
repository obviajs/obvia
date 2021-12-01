
import { BindingsManager } from "/obvia/lib/binding/BindingsManager.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { coroutine } from "/obvia/lib/coroutine.js";
import { debounce, debouncePromise, whenDefined, whenDefinedPromise, functionName } from "/obvia/lib/DecoratorUtils.js";

var UseBindings = function (_props) {
    let _self = this, _bindings = [], _bindedProps,
        _bindingDefaultContext = (_props && (_props.bindingDefaultContext || this.proxyMaybe || this)) || this;
    
    let _bindingsManager = BindingsManager.getInstance(this);   
    let _myw = ChangeWatcher.getInstance(_self);
    
    Object.defineProperty(this, "bindingsManager", {
        get: function bindingsManager() {
            return _bindingsManager;
        }
    });

    Object.defineProperty(this, "bindings", {
        get: function bindings() {
            return _bindings;
        }
    });

    Object.defineProperty(this, "bindedProps", {
        get: function bindedProps() {
            return _bindedProps;
        }
    });

    Object.defineProperty(this, "bindingDefaultContext", {
        get: function bindingDefaultContext() {
            return _bindingDefaultContext;
        },
        set: function bindingDefaultContext(v) {
            if (_bindingDefaultContext != v) {
                let oldValue = _bindingDefaultContext;
                _bindingDefaultContext = v;
                if(this.invalidateScopeChain)
                    this.invalidateScopeChain();
                _myw.propertyChanged("bindingDefaultContext", oldValue, _bindingDefaultContext);
            }
        },
        enumerable: false
    });
    
    this.getBindingExpression = function (property) {
        let match = ArrayUtils.getMatching(_self.bindings, "property", property, true);
        let expression = null;
        if (match.objects.length > 0) {
            expression = match.objects[0]["expression"];
        }
        return expression;
    };

    this.applyBindings = async function () {
        if (_self.bindings && _self.bindings.length > 0) {
            for (let bi = 0; bi < _self.bindings.length; bi++) {
                let scope = _self.getScopeChain();
                let bindingExp = _self.bindings[bi].expression;
                let site_chain = [_self.bindings[bi].property];
                let nullable = _self.bindings[bi].nullable;

                let fn = function () {
                    _self.bindingsManager.getValue(scope, bindingExp, site_chain);
                };
                if (nullable) {
                    let identifierTokens = BindingsManager.getIdentifiers(bindingExp);
                    if (identifierTokens) {
                        let len = identifierTokens.length;
                        let cc = _bindingDefaultContext;
                        for (let i = 0; i < len; i++) {
                            await whenDefinedPromise(cc, identifierTokens[i].value);
                            cc = cc[identifierTokens[i].value];
                        }
                        fn();
                    }
                } else {
                    fn();
                }
            }
        }
    };

    this.refreshBindings = async function (data) {
        let r = false;
        if (_self.bindingDefaultContext != data) {
            if(this.invalidateScopeChain)
                this.invalidateScopeChain();
            _self.bindingDefaultContext = data;
            this.resetBindings();
            this.applyBindings();
            let deps = _self.dependencies;
            if (deps) {                
                let len = deps.length;
                for (let i = 0; i < len; i++) { 
                    let dep = deps[i];
                    if (dep) {
                        for (let cid in dep) {
                            // if(dep[cid].invalidateScopeChain)
                            //     dep[cid].invalidateScopeChain();
                            // dep[cid].resetBindings();
                            // dep[cid].applyBindings();

                            dep[cid].refreshBindings(data); 
                        }
                    }
                }               
            }
            _self.bindingDefaultContext = data;
            r = true;
        }
        return r;
    };

    this.resetBindings = function () {
        _self.bindingsManager.resetBindings();
    };

    this.setBindingExpression = async function (property, expression) {
        let scope = _self.getScopeChain();
        let match = ArrayUtils.getMatching(_self.bindings, "property", property, true);
        if (match.indices.length > 0) {
            let b = StringUtils.getBindingExp(expression);
            if (b) {
                let newBinding = {
                    "expression": b.expression,
                    "property": property,
                    "nullable": false
                };
                _self.bindings.splice(match.indices[0], 1, newBinding);

                let bindingExp = expression;
                let site_chain = [property];
                let nullable = false;

                let fn = function () {
                    _self.bindingsManager.getValue(scope, bindingExp, site_chain);
                };
                if (nullable) {
                    let identifierTokens = BindingsManager.getIdentifiers(bindingExp);
                    if (identifierTokens) {
                        let len = identifierTokens.length;
                        let cc = _bindingDefaultContext;
                        for (let i = 0; i < len; i++) {
                            await whenDefinedPromise(cc, identifierTokens[i].value);
                            cc = cc[identifierTokens[i].value];
                        }
                        fn();
                    }
                } else {
                    fn();
                }
            }
        }
    };

    this.processPropertyBindings = function (props) {
        let _bindings = [];
        //build components properties, check bindings
        let _processedProps = {};
        let _bindedProps = {};

        for (let prop in props) {
            if (typeof prop == 'string') {
                //check for binding
                let b = StringUtils.getBindingExp(props[prop]);
                if (b) {
                    if (prop != "bindingDefaultContext") {
                        _bindings.push({
                            "expression": b.expression,
                            "property": prop,
                            "nullable": b.nullable
                        });
                    } else
                        _bindings.unshift({
                            "expression": b.expression,
                            "property": prop,
                            "nullable": b.nullable
                        });
                    _bindedProps[prop] = props[prop];
                } else {
                    //no binding
                    _processedProps[prop] = props[prop];
                }
            }
        }
        return {
            "bindings": _bindings,
            "bindedProps": _bindedProps,
            "processedProps": _processedProps
        };
    };

    let _parent;
    if (!this.hasOwnProperty("parent")) {
        Object.defineProperty(this, "parent", {
            get: function parent() {
                return _parent;
            },
            set: function parent(v) {
                if (_parent != v) {
                    _parent = v;                   
                    this.invalidateScopeChain();
                }
            },
            enumerable: false,
            configurable: true
        });
    }

    let ppb = this.processPropertyBindings(_props);
    _bindings = ppb.bindings;
    _bindedProps = ppb.bindedProps;
    /*the object implementing this should provide an implementation for:
        getScopeChain
        invalidateScopeChain
        resetBindings
        refreshBindings
    */
    
    let _cachedScope = null;        
    if (!this.hasOwnProperty("invalidateScopeChain")) {
        this.invalidateScopeChain = function () {
            _cachedScope = null;
        };
    }
    
    if (!this.hasOwnProperty("getScopeChain")) {
        this.getScopeChain = function () {
            let scope = _cachedScope
            if (!_cachedScope) {
                scope = [];
                if (_self == this.bindingDefaultContext || this.proxyMaybe == this.bindingDefaultContext) {
                    if (this.proxyMaybe)
                        scope.push(this.proxyMaybe);
                    else                    
                        scope.push(this.bindingDefaultContext);
                } else if (this.proxyMaybe)               
                    scope.splice(scope.length, 0, this.bindingDefaultContext, this.proxyMaybe);
                else                
                    scope.splice(scope.length, 0, this.bindingDefaultContext, _self);
                
                if (this.parent) {
                    scope.splicea(scope.length, 0, this.parent.getScopeChain())
                } else
                    scope.push(window)
                _cachedScope = scope;
            }
            return scope;
        };
    }
};
export {
    UseBindings
};