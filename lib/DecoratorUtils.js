//https://medium.freecodecamp.org/here-are-a-few-function-decorators-you-can-write-from-scratch-488549fe8f86
function debounce(fn, interval) {
    let timer;
    let that = this;
    return function debounced() {
        clearTimeout(timer);
        let args = arguments;
        
        timer = setTimeout(function callOriginalFn() {
             fn.apply(that, args);
        }, interval);
        return timer;
    };
}
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
function whenDefined(context, property, fn){
    var _solved = false;
    return function defined(){
        let args = arguments;
        var that = this;
        var w = ChangeWatcher.getInstance(context);
        var v = getChainValue(context, property);
        if(v!=null){
            if (typeof fn == 'function'){
                fn.apply(that, args);
            }
        }else{
            let chain;
            if(typeof property === 'string')
                chain = parseObjectPathExpression(property);
            var _fnHandler = function(e){
                if(e.newValue){
                    w.unwatch(context, chain, _fnHandler);
                    if (typeof fn == 'function'){
                        fn.apply(that, args);
                    }
                }
            }
            w.watch(context, chain, _fnHandler);
        }
    }
}