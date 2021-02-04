//requires ObjectUtils.js, StringUtils.js, ArrayUtils.js, PropertyChangeEvent.js
var ChangeWatcher = function (host) {
    let _host = host,
        _self = this;

    this.$el = $(this);
    this.handlers = {};
    this.guid = _host["guid"];
    this.parentWatcher = null;

    this.ExecuteHandlers = function (e) {
        if (this.handlers[e.source_guid] != undefined && this.handlers[e.source_guid][e.property] != undefined && this.handlers[e.source_guid][e.property]["handlers"] != undefined) {

            this.handlers[e.source_guid][e.property]["handlers"].forEach(function (handler, i) {
                if (handler && (typeof handler == 'function')) {
                    e.chain = this.handlers[e.source_guid][e.property]["chain"];
                    handler(e);
                }
            }.bind(this));
        }
    };
    _self.on('propertyChange', this.ExecuteHandlers);
    //alias unwatch everything
    this.reset = function () {
        for (let uuid in this.handlers) {
            for (let prop in this.handlers[uuid]) {
                delete this.handlers[uuid][prop];
            }
            delete ChangeWatcher.instances[uuid];
        }
    };

    this.removeHandler = function (handler) {
        if (handler) {
            for (let uuid in this.handlers) {
                for (let prop in this.handlers[uuid]) {
                    let len = this.handlers[uuid][prop]["handlers"].length;
                    for (let h = 0; h < len; h++) {
                        if (this.handlers[uuid][prop]["handlers"][h] == handler) {
                            this.handlers[uuid][prop]["handlers"].splice(h, 1);
                        }
                    }
                }
            }
        }
    };

    this.unwatchHost = function (host) {
        if (host["guid"] && this.handlers[host["guid"]]) {
            for (let prop in this.handlers[host["guid"]]) {
                delete this.handlers[host["guid"]][prop];
            }
            delete ChangeWatcher.instances[host["guid"]];
        } else {
            console.log("There is no one watching on this object.");
        }
    };

    this.propertyChanged = function (property, oldValue, newValue) {
        let evt = new PropertyChangeEvent(_host, property, oldValue, newValue);
        evt.source_guid = _host.guid;
        _self.trigger(evt);
    };

    this.unwatch = function (host, chain, handler) {
        if (host && isObject(host)) {
            let hostWatcher = ChangeWatcher.getInstance(host);
            if (host["guid"] && hostWatcher.handlers[host["guid"]]) {
                if (!Array.isArray(chain)) {
                    chain = [chain];
                } else {
                    chain = chain.slice(0);
                }

                if (chain.length > 0) {
                    let prop = chain[0];
                    let uuid = host["guid"];
                    if (hostWatcher.handlers[uuid][prop] != undefined && Array.isArray(hostWatcher.handlers[uuid][prop]["handlers"])) {
                        if (chain.length == 1) { //stop condition
                            //TODO:eshte parashikuar vetem rasti kur property origjinale eshte e thjeshte, nese eshte setter ai humbet
                            //duhet rikthyer setter origjinal i cili gjenet i ri-emeruar prop+"_"+uuid
                            //per me teper mund te kete nje watcher tjeter ndaj nuk kemi pse modifikojme propertine por vetem fshijme handler
                            /*
                            var val = host[prop];
                            delete host[prop]; // remove accessors
                            host[prop] = val;
                            */
                            if (handler) {
                                let len = hostWatcher.handlers[uuid][prop]["handlers"].length;
                                for (let h = 0; h < len; h++) {
                                    if (hostWatcher.handlers[uuid][prop]["handlers"][h] == handler) {
                                        hostWatcher.handlers[uuid][prop]["handlers"].splice(h, 1);
                                    }
                                }
                            } else
                                delete hostWatcher.handlers[uuid][prop];
                        }
                    } else {
                        console.log("There are no handlers attached to this property: " + prop);
                    }
                    this.unwatch(host[prop], chain.slice(1), handler);
                    //stack calls LIFO (FILO)
                    /*
                                    var val = host[prop];
                                    delete host[prop]; // remove accessors
                                    host[prop] = val;
                                    delete this.handlers[uuid][prop];
                                    */

                }
            } else {
                console.log("There is no one watching on this object.");
            }
        } else {
            console.log("Cannot unwatch a null object.");
        }
    };
    //propertite duhet ti modifikoje vetem ne elementin e parafundit ne zinxhir 
    this.watch = function (host, chain, handler, chainPrim) {
        if (!Array.isArray(chain)) {
            chain = [chain];
        } else {
            chain = chain.slice(0);
        }
        if (!Array.isArray(chainPrim)) {
            chainPrim = [];
        }
        if (chain.length > 0) {
            let prop = chain[0];
            let uuid = null;
            if (host["guid"] != undefined && host["guid"] != null) {
                uuid = host["guid"];
            } else {
                host["guid"] = uuid = StringUtils.guid();
            }
            //in the first call hostWatcher will equal "this"
            let hostWatcher = ChangeWatcher.getInstance(host);

            let _prop = prop;
            //console.log("property ", prop);
            if (isNaN(prop)) {
                let proxyProp = prop + "_" + uuid;
                _prop = "_" + proxyProp;
                if (hostWatcher.handlers[uuid] != null && hostWatcher.handlers[uuid][prop] != null) {
                    hostWatcher.handlers[uuid][prop]["handlers"].push(handler);
                } else {
                    let objFromDesc = Object.getOwnPropertyDescriptors(host);
                    let originalGetter = null;
                    let originalSetter = null;
                    let enumerable = null;
                    let configurable = null;

                    if (objFromDesc[prop] && (!!objFromDesc[prop]['get'])) {
                        originalGetter = objFromDesc[prop]['get'];
                        enumerable = objFromDesc[prop].enumerable;
                        configurable = objFromDesc[prop].configurable;
                    } else {
                        // host["_"+proxyProp] = host[prop];

                        // host=Object.assign(host, {_prop: {value: host[prop]}});
                        Object.defineProperty(host, _prop, {
                            value: host[prop],
                            writable: true
                        });
                        originalGetter = function () {
                            //console.log("getter for: ", "_"+proxyProp," value:",this, this["_"+proxyProp]); 
                            return this[_prop];
                        };
                    }
                    if (objFromDesc[prop] && (!!objFromDesc[prop]['set'])) {
                        originalSetter = objFromDesc[prop]['set'];
                    } else if (!objFromDesc[proxyProp]) {
                        if (host[_prop] == undefined) {
                            //host["_"+proxyProp] = host[prop];
                            //host=Object.assign(host, {_prop: {value: host[prop]}});

                            Object.defineProperty(host, _prop, {
                                value: host[prop],
                                writable: true
                            });
                        }
                        originalSetter = function (v) {
                            if (v != this[prop]) {
                                this[_prop] = v;
                            }
                        };
                        //rastin e get
                        Object.defineProperty(host, proxyProp, {
                            get: originalGetter,
                            "enumerable": false,
                            configurable: false,
                            set: originalSetter
                        });

                    }

                    if (hostWatcher.handlers[uuid] == undefined) {
                        hostWatcher.handlers[uuid] = {};
                    }
                    if (hostWatcher.handlers[uuid][prop] == undefined) {
                        hostWatcher.handlers[uuid][prop] = {};
                        hostWatcher.handlers[uuid][prop]["handlers"] = [];
                        hostWatcher.handlers[uuid][prop]["chain"] = chainPrim;
                    }
                    hostWatcher.handlers[uuid][prop]["handlers"].push(handler);

                    if (!(objFromDesc[prop]) || !(!!objFromDesc[prop]['get'])) {
                        Object.defineProperty(host, prop, {
                            get: originalGetter,
                            "enumerable": true,
                            configurable: configurable,
                            set: function (v) {
                                if (this[prop] != v) {
                                    let oldValue = (function (oval) { // a closure is created
                                        return oval;
                                    })(this[prop]);

                                    /*disa setters mund te aplikojne kontrollet per nivele kufi dhe te mos e update vleren nese nuk 
                                    eshte brenda kufijve. Per te fix ate rast duhet te exec setter origjinal pastaj te krahasojme 
                                    vleren e vjeter me vleren e re te property. deep copy nese nuk funk closure
                                    */
                                    originalSetter.call(this, v);
                                    if (oldValue != this[prop]) {
                                        hostWatcher.propertyChanged(prop, oldValue, this[prop]);
                                        /*
                                        if (handler !=null && handler !=undefined && (typeof handler == 'function')) {
                                            handler(evt);
                                        }
                                        */
                                    }
                                }
                            }
                        });
                    }
                }
            }
            chainPrim.push({
                "prop": chain.shift(),
                "uuid": uuid
            });
            if (chain.length > 0) {
                //host = host[prop];                
                host = host[_prop];
                if (host && isObject(host)) {
                    ChangeWatcher.getInstance(host).parentWatcher = hostWatcher;
                    this.watch(host, chain, handler, chainPrim);
                }
            }
        }
    };
};
ChangeWatcher.instances = {};
ChangeWatcher.getInstance = function (host) {
    let uid = host["guid"];
    if (!uid) {
        uid = StringUtils.guid();
        if (hasOwnProperty.call(host, "guid")) {
            host["guid"] = uid;
        } else {
            Object.defineProperty(host, "guid", {
                value: uid,
                enumerable: false,
                configurable: true
            });
        }
    }
    let instance = ChangeWatcher.instances[uid];
    if (!instance)
        instance = ChangeWatcher.instances[uid] = new ChangeWatcher(host);
    return instance;
};
ChangeWatcher.prototype = Object.create(EventDispatcher.prototype);
//add canBind object as a behavior to our components 
//getValue function per propertite qe do te lejojme te bejne bind 
//per tu menaxhuar dhe fire i handler vetem njehere ne pavaresi te nivelit te property path ku ndodh ndryshimi