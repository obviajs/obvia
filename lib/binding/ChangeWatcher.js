//requires ObjectUtils.js, StringUtils.js, ArrayUtils.js, PropertyChangeEvent.js
var ChangeWatcher = function(guid)
{
    this.$el = $(this);
    this.handlers = {};
    this.guid = guid;
    this.ExecuteHandlers = function (e) {
        if(this.handlers[e.source_guid]!=undefined && this.handlers[e.source_guid][e.property]!=undefined && this.handlers[e.source_guid][e.property]["handlers"]!=undefined){
            
            this.handlers[e.source_guid][e.property]["handlers"].forEach(function(handler, i){
                if (handler && (typeof handler == 'function')) {
                    e.chain = this.handlers[e.source_guid][e.property]["chain"];
                    handler(e);
                }
            }.bind(this));
        }
        
    }
    this.on('propertyChange', this.ExecuteHandlers);
    //alias unwatch everything
    this.reset = function () {
        for(var uuid in this.handlers){
            for(var prop in this.handlers[uuid]){
                delete this.handlers[uuid][prop];
            }
            delete ChangeWatcher.instances[uuid];
        }
    }

    this.unwatchHost = function (host) {
        if(host["guid"] && this.handlers[host["guid"]])
        {
            for(var prop in this.handlers[host["guid"]]){
                delete this.handlers[host["guid"]][prop];
            }
            delete ChangeWatcher.instances[host["guid"]];
        }else{
            console.log("There is no one watching on this object.");
        }
    }

    this.unwatch = function (host, chain, handler) {
        if(host["guid"] && this.handlers[host["guid"]]){
                if(!Array.isArray(chain))
                {
                    chain = [chain];
                }  
            
                if (chain.length > 0)
                {
                    var prop = chain[0];
                    var uuid = host["guid"];
                    if(this.handlers[uuid][prop]!=undefined && Array.isArray(this.handlers[uuid][prop]["handlers"])){

                        if(chain.length==1){//stop condition
                            //TODO:eshte parashikuar vetem rasti kur property origjinale eshte e thjeshte, nese eshte setter ai humbet
                            //duhet rikthyer setter origjinal i cili gjenet i ri-emeruar prop+"_"+uuid
                            //per me teper mund te kete nje watcher tjeter ndaj nuk kemi pse modifikojme propertine por vetem fshijme handler
                            /*
                            var val = host[prop];
                            delete host[prop]; // remove accessors
                            host[prop] = val;
                            */
                            if(handler){
                                for(var h=0;h<this.handlers[uuid][prop]["handlers"].length;h++){
                                    if(this.handlers[uuid][prop]["handlers"][h] == handler){
                                        this.handlers[uuid][prop]["handlers"].splice(h, 1);
                                    }
                                }
                            }else
                                delete this.handlers[uuid][prop];
                        }
                    }else{
                        console.log("There are no handlers attached to this property: "+prop);
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
        }else{
            console.log("There is no one watching on this object.");
        }
    }
    //propertite duhet ti modifikoje vetem ne elementin e parafundit ne zinxhir 
    this.watch = function(host, chain, handler, chainPrim)
    {
        if(!Array.isArray(chain))
        {
            chain = [chain];
        }  
        if(!Array.isArray(chainPrim))
        {
            chainPrim = [];
        }
        if (chain.length > 0)
        {
            var prop = chain[0];
            var uuid = null;
            if(host["guid"]!=undefined && host["guid"]!=null){
                uuid = host["guid"];
            }else{
                host["guid"] = uuid = StringUtils.guid();
            }
            let _prop = prop;
            //console.log("property ", prop);
            if(isNaN(prop))
            {
                var proxyProp = prop+"_"+uuid;
                _prop = "_"+proxyProp;
                if(this.handlers[uuid] != null && this.handlers[uuid][prop] != null)
                {
                    this.handlers[uuid][prop]["handlers"].push(handler);
                }else
                {
                    var objFromDesc = Object.getOwnPropertyDescriptors(host);
                    var originalGetter = null; 
                    var originalSetter = null; 
                    var enumerable = null;
                    var configurable = null; 

                    if(objFromDesc[prop] && (!!objFromDesc[prop]['get']))
                    {
                        originalGetter = objFromDesc[prop]['get'];
                        enumerable = objFromDesc[prop].enumerable;
                        configurable = objFromDesc[prop].configurable;
                    }else
                    {
                    // host["_"+proxyProp] = host[prop];
                        
                    // host=Object.assign(host, {_prop: {value: host[prop]}});
                        Object.defineProperty(host, _prop, { value: host[prop], writable: true });
                        originalGetter = function(){
                            //console.log("getter for: ", "_"+proxyProp," value:",this, this["_"+proxyProp]); 
                            return this[_prop]
                        };
                    }
                    if(objFromDesc[prop] && (!!objFromDesc[prop]['set']))
                    {
                        originalSetter = objFromDesc[prop]['set'];
                    }else
                    {
                        if(host[_prop] == undefined){
                            //host["_"+proxyProp] = host[prop];
                            //host=Object.assign(host, {_prop: {value: host[prop]}});

                        Object.defineProperty(host, _prop, { value: host[prop], writable: true });
                        }
                        originalSetter = function(v){
                            if(v!=this[prop]){
                                this[_prop] = v;
                            }
                        }
                        //rastin e get
                        Object.defineProperty(host, proxyProp, 
                        { 
                            get: originalGetter, "enumerable": false, configurable: false,
                            set: originalSetter  
                        });

                    }
                
                    
                    if(this.handlers[uuid] == undefined){
                        this.handlers[uuid] = {};
                    }
                    if(this.handlers[uuid][prop] == undefined){
                        this.handlers[uuid][prop] = {};
                        this.handlers[uuid][prop]["handlers"] = [];
                        this.handlers[uuid][prop]["chain"] = chainPrim;
                    }
                    this.handlers[uuid][prop]["handlers"].push(handler);
                    var _self = this;
                    if(!(objFromDesc[prop]) || !(!!objFromDesc[prop]['get']))
                    {
                        Object.defineProperty(host, prop, 
                        { 
                            get: originalGetter, "enumerable": true, configurable: configurable,
                            set: function(v){
                                if(this[prop]!=v){
                                    var oldValue = (function(oval) { // a closure is created
                                    return oval
                                    })(this[prop]);	

                                    /*disa setters mund te aplikojne kontrollet per nivele kufi dhe te mos e update vleren nese nuk 
                                    eshte brenda kufijve. Per te fix ate rast duhet te exec setter origjinal pastaj te krahasojme 
                                    vleren e vjeter me vleren e re te property. deep copy nese nuk funk closure
                                    */
                                originalSetter.call(this, v);   
                                    if(oldValue != this[prop]){    
                                        var evt = new PropertyChangeEvent(this, prop, oldValue, this[prop]);
                                        evt.source_guid = this.guid;
                                        _self.trigger(evt);
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
            chainPrim.push({"prop":chain.shift(), "uuid":uuid});
            if(chain.length>0){
                //host = host[prop];
                host =  host[_prop];
                this.watch(host, chain, handler, chainPrim);
            }
        }
    }
}
ChangeWatcher.instances = {};
ChangeWatcher.getInstance = function(host)
{
    var uid = host["guid"];
    if(!uid)
    {
        host["guid"] = uid = StringUtils.guid();;
    }
    var instance = ChangeWatcher.instances[uid];
    if(!instance)
        instance = ChangeWatcher.instances[uid] = new ChangeWatcher(uid);
    return instance;
}     
ChangeWatcher.prototype = Object.create(EventDispatcher.prototype);




//add canBind object as a behavior to our components 
//getValue function per propertite qe do te lejojme te bejne bind 

/*
(host:Object, chain:Object,
    handler:Function):ChangeWatcher
    */
   //per tu menaxhuar dhe fire i handler vetem njehere ne pavaresi te nivelit te property path ku ndodh ndryshimi