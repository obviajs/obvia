var ArrayEx = function(){
    var _self = this;
    let _remoteArray, _oldLen;
    let _page;
    
    //TODO: 
    /**
     * implement filtering
     * implement sort by access time desc (which element was accessed latest)
     */
    var _moreLoaded = function(e){
       
        _self.gotoRecord(_ri);
        var evt = new PropertyChangeEvent(_self, "length", _oldLen, _self.length);
        _oldLen = _self.length;
        evt.source_guid = _self.guid;
        _self.trigger(evt);
    }

    for(var a=0;a<arguments.length;a++)
    {
        if(arguments[a] && arguments[a].forEach){
            this.splicea(this.length, 0, arguments[a]);
        }else if(a==0){
            if(arguments[a].ctor == "RemoteArray"){
                _page = new ArrayEx();
                _remoteArray = arguments[a];
                _remoteArray.on(RemoteDataEvent.REQUEST_SUCCESS, _moreLoaded);
                _remoteArray.source = this;    
                _oldLen = 0;
                _remoteArray.init();
            }else if(arguments.length == 1){
                this.length = arguments[a];
            }else{
                this.push(arguments[a]);
            }
        } else {
            this.push(arguments[a]);
        }
    }
    //current/requested index 
    let _ci, _ri = 0;
    this.gotoRecord = function(ri)
	{
        if(_ci!=ri)
        {
            //let len = Math.min(_self.length % _remoteArray.recordsPerPage, _remoteArray.recordsPerPage);
            if(this[ri+_remoteArray.recordsPerPage-1]){
                _page.splicea(0, _remoteArray.recordsPerPage, this.slice(ri, ri+_remoteArray.recordsPerPage));
                _ci = ri;
            }else{
                if(_remoteArray.totalRecords == Infinity){
                    _ri = ri;
                }else{
                    if(ri<0)
						ri = 0;
					else
						if(ri+_remoteArray.recordsPerPage>_remoteArray.totalRecords-1)
                            ri = _remoteArray.totalRecords-_remoteArray.recordsPerPage;
                    this.gotoRecord(ri);
                }
            }  
        }
    }
    
    Object.defineProperty(this, "remoteArray", 
    {
        get: function remoteArray() 
        {
            return _remoteArray;
        },
        enumerable:false
    });
    
    Object.defineProperty(this, "page", 
    {
        get: function page() 
        {
            return _page;
        },
        enumerable:false
    });

    this.toArray = function(){
        var ret = [];
        for(var i=0;i<this.length;i++){
            ret.push(this[i]);
        }
        return ret;
    }
    let _$el = $({});
    this.trigger = function (){
        _$el.trigger.apply(_$el, arguments);
    }

    this.on = function (eventType, fnc) {
        if (typeof fnc !== 'function') {
            throw Error("The specified parameter is not a callback")
        } else {
            if (typeof fnc == 'function') {
                _$el.on.apply(_$el, arguments);
            }
        }
        return this;
    }
    
    this.off = function ()
    {
        if(_$el){
            _$el.off.apply(_$el, arguments);
        }
    }
    
    return new Proxy(this, {
        apply: function(target, thisArg, argumentsList) {
            return thisArg[target].apply(this, argumentList);
        },
        deleteProperty: function(target, property) {
            if(!isNaN(property))
                target.splice(property, 1);
            else
                Reflect.deleteProperty(target, property);
            return true;
        },
        set: function(target, property, value, receiver) {   
            var oldValue = target[property];
            target[property] = value;   
            var evt = new PropertyChangeEvent(_self, property, oldValue, value);
            evt.source_guid = _self.guid;
            target.trigger(evt);
            return true;
        },
        get: function(target, property, receiver) {
            if(property=="length"){
                var i=0;
                for(var prop in target){
                    if(!isNaN(prop)){
                        ++i;
                    }
                }
                return i;
            }else if(!target.hasOwnProperty(property) && _remoteArray && isString(property) && !isNaN(property)){
                _remoteArray.gotoRecord(parseInt(property));
            }else if(_remoteArray && isString(property) && !isNaN(property)){
                _remoteArray.gotoRecord(parseInt(property));
                return Reflect.get(...arguments);
            }else
                return Reflect.get(...arguments);
        }
    });
}; 
ArrayEx.isArrayEx = function(obj){
    return (obj !=null && ("ctor" in obj) && obj.ctor == 'ArrayEx')
}
ArrayEx.prototype = Object.create(Array.prototype);
ArrayEx.prototype.toJSON = function() { 
    return this.toArray();
}
ArrayEx.prototype.ctor = 'ArrayEx'; 
ArrayEx.prototype.constructor = ArrayEx;