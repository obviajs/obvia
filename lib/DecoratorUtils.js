import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

//https://medium.freecodecamp.org/here-are-a-few-function-decorators-you-can-write-from-scratch-488549fe8f86
function debounce(fn, interval) {
    let timer;

    return function debounced() {
        clearTimeout(timer);
        let args = arguments;
        let that = this;
        timer = setTimeout(function callOriginalFn() {
            fn.apply(that, args);
        }, interval);
        return timer;
    };
}

function queue(fn) {
    let r = false;
    let queued = function() {
        let that = this, args = arguments;
        if (!r) {
            r = fn();
        } else
            r = r.then(() => {
                return fn();
            });
        return r;
    };
    return queued;
};

function debouncePromise(fn, interval) {
    let timer;
    let that = this;
    return function debounced() {
        clearTimeout(timer);
        let args = arguments;
        return new Promise((resolve, reject) => {
            timer = setTimeout(function callOriginalFn() {
                resolve(fn.apply(that, args));
            }, interval);
        });
    };
}
//logical or|and N/A yet
function whenDefined(context, property, fn) {
    var _solved = false;
    return function defined() {
        let args = arguments;
        let that = this;
        let w = ChangeWatcher.getInstance(context);
        let v = ObjectUtils.getChainValue(context, property);
        if (v != null) {
            if (typeof fn == 'function') {
                fn.apply(that, args);
            }
        } else {
            let chain;
            if (typeof property === 'string')
                chain = ObjectUtils.parseObjectPathExpression(property);
            let _fnHandler = function (e) {
                if (e.newValue != null) {
                    w.unwatch(context, chain, _fnHandler);
                    if (typeof fn == 'function') {
                        fn.apply(that, args);
                    }
                }
            };
            w.watch(context, chain, _fnHandler);
        }
    };
}

function whenDefinedPromise(context, property) {
    return new Promise((resolve, reject) => {
        let w = ChangeWatcher.getInstance(context);
        let v = ObjectUtils.getChainValue(context, property);
        if (v != null) {
            resolve();
        } else {
            let chain;
            if (typeof property === 'string')
                chain = ObjectUtils.parseObjectPathExpression(property);
            let _fnHandler = function (e) {
                if (e.newValue != null) {
                    w.unwatch(context, chain, _fnHandler);
                    resolve();
                }
            };
            w.watch(context, chain, _fnHandler);
        }
    });
}

function functionName(fnMaybe) {
    return typeof fnMaybe == "function" ? fnMaybe.name : fnMaybe;
}

export {
    debounce, debouncePromise, whenDefined, whenDefinedPromise, functionName, queue
};