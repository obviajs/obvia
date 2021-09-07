import { Injector } from "/obvia/lib/Injector.js";

var DependencyContainer = function () {
    
    let _dependencies = {},
        _resolvePromises = {},
        _resolvePromise = DependencyContainer.import;
    
    Object.defineProperty(this, "resolvePromise",
    {
        get: function resolvePromise() {
            return _resolvePromise;
        },
        set: function resolvePromise(v) {
            if (_resolvePromise != v) {
                _resolvePromise = v;
            }
        }
    });

    this.register = function (name, props, resolvePromise) {
        if (!_dependencies.hasOwnProperty(name)) {
            _dependencies[name] = props;
            if (resolvePromise)
                _resolvePromises[name] = resolvePromise;
        }
    };

    this.get = function (name) {
        return new Promise((resolve, reject) => {
            if (_dependencies.hasOwnProperty(name)) {
                let p = _dependencies[name];       
                return ((_resolvePromises[name] && _resolvePromises[name](p, name)) || _resolvePromise(p, name)).then((dep) => {
                    if (!dep)
                        reject({ error: 2, description: "dependency not found in module" });
                    else
                        resolve(dep);                    
                }).catch((error) => {
                    reject({ error: 3, description: "import for module failed" });
                });
            } else
                reject({error:1, description: "dependency not registered: "+name});
        });
    };
};
DependencyContainer.instances = {};
DependencyContainer.getInstance = function (dependencyCategory) {
    let instance = DependencyContainer.instances[dependencyCategory];
    if (!instance)
        instance = DependencyContainer.instances[dependencyCategory] = new DependencyContainer();
    return instance;
};
DependencyContainer.import = (p, name) => import(p).then((module) => {
    if (module[name])
        return module[name];
});
DependencyContainer.simpleResolve = (p) => Promise.resolve(p);
DependencyContainer.simpleFactory = (p) => Injector.getInstance().inject(p.cfn, {
        "_props": p.props
});
DependencyContainer.importFactory = (p) => import(p.url).then(function (module) {
    if (module[p.name]) {
        return Injector.getInstance().inject(module[p.name], {
            "_props": p.props
        });
    }
});

export {
    DependencyContainer
};
