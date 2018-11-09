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
        var w = new ChangeWatcher();
        for(var i=0;i<property.length;i++){
            if(context[property[i]]){
                if (typeof fn == 'function'){
                    fn.apply(that, args);
                    break;
                }
            }else{
                w.watch(context, [property[i]], function(e){
                    if(e.newValue){
                            w.unwatch(context, [property]);
                            if (typeof fn == 'function'){
                                fn.apply(that, args);
                            }
                    }
                });
            }
        }
    }
}