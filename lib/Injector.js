import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Injector = function () {
    
    let _getParams = function (fn) {
        let FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        let FN_ARG_SPLIT = /,/;
        let FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        let $inject = [],
            fnText,
            argDecl;

        if (typeof fn == 'function') {
            if (!fn.$inject) {
                fnText = fn.toString().replace(STRIP_COMMENTS, '');
                argDecl = fnText.match(FN_ARGS);
                argDecl[1].split(FN_ARG_SPLIT).forEach(function (arg) {
                    arg.replace(FN_ARG, function (all, underscore, name) {
                        $inject.push(name);
                    });
                });
                fn.$inject = $inject;
            } else
                $inject = fn.$inject;
        }
        return $inject;
    };

    this.inject = async function (cfn, args) {
        let keys = Object.keys(args);
        let deps = [];
        let params = _getParams(cfn);
        let len = params.length;
        let arrp = new Array(len);
        for (let i = 0; i < len; i++) {
            let param = params[i];
            if (keys.indexOf(param) == -1) {
                arrp[i] = DependencyContainer.getInstance().get(param);
            } else {
                arrp[i] = Promise.resolve(args[param]);
            }
        }
        deps = await Promise.all(arrp);
        return new cfn(...deps);
    };
};
Injector.instance = null;
Injector.getInstance = function () {
    if (!Injector.instance)
        Injector.instance = new Injector();
    return Injector.instance;
};
export {
    Injector    
};