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
//logical or|and N/A yet
function whenDefined(context, property, fn){
    var _solved = false;
    if(!Array.isArray(property))
    {
        property = [property];
    }  
    return function defined(){
        let args = arguments;
        var that = this;
        var w = ChangeWatcher.getInstance(context);;
        for(var i=0;i<property.length;i++){
            if(property!="guid"){
                if(context[property[i]]!=null){
                    if (typeof fn == 'function'){
                        fn.apply(that, args);
                        break;
                    }
                }else{
                    var _fnHandler = function(e){
                        if(e.newValue){
                            w.unwatch(context, [property], _fnHandler);
                            if (typeof fn == 'function'){
                                fn.apply(that, args);
                            }
                        }
                    }
                    w.watch(context, [property[i]], _fnHandler);
                }
            }else{
                throw("guid is an internal reserved property name used by ChangeWatcher. You may not wait for it tbd.");
            }
        }
    }
}