var RemoteObject = function(_props)
{
	var _defaultParams = {
		autoRetry:false,
		autoReset:false,
        post:{},
        retry: {base:2, exponent:2, factor: 200},
		cacheProps: {cachedVariableName: null, dependencies:[], ttl:null, enabled:false}
	};
	_props = extend(false, false, _defaultParams, _props);
    
    var _base = _props.retry.base;
	var _exponent = _props.retry.exponent;
	var _factor = _props.retry.factor;
	var _retryTimeOut;
	var _retriesCount = 0;
	var _timeDisconnected;
	var _cacheProps = _props.cacheProps;
	//we might want to persist/send to server this for later inspection/statistics
	var _connTimeLine = [];
	var _busy = false;
	var _source = null;
	
    this.$el = $(this);

    var _getData_Action = _props.getData_Action;
	var _isSynced = false;
	//if autoretry is true the system will automatically retry to getdata in exponential time intervals
	var _autoRetry = _props.autoRetry;
	var _autoReset = _props.autoReset;
    var _post = _props.post;
	var _self = this;
	var _cache;
	if(_cacheProps.enabled)
	{
		_cache = Cache.getInstance();
		if(_cacheProps.cachedVariableName == null)
		{
			_cacheProps.cachedVariableName = _getData_Action.replace(/[^a-zA-Z0-9-_]/g, '_');
		}
	}
	
    Object.defineProperty(this, "getData_Action", 
	{
		get: function getData_Action() 
		{
			return _getData_Action;
		},
		set: function getData_Action(x) 
		{
			if(_getData_Action != x){
				if(1){//testvalid("urlip", x)){
					_getData_Action = x;
					if(_autoReset && _isSynced){
						this.reset();
					}
				}else{
					throw new Error("getData_Action is not a valid url");
				}
			}
		}
    }); 
    
    Object.defineProperty(this, "autoRetry", 
	{
		get: function autoRetry() 
		{
			return _autoRetry;
		},
		set: function autoRetry(x) 
		{
			_autoRetry = x;
		}
	});

	Object.defineProperty(this, "post", 
	{
		get: function post() 
		{
			return _post;
		},
		set: function post(v) 
		{
			_post = v;
			if(_autoReset){
				this.reset();
			}
		}
    });
    
    Object.defineProperty(this, "busy", 
	{
		get: function busy() 
		{
			return _busy;
		}
	});

	Object.defineProperty(this, "cachedVariableName", 
	{
		get: function cachedVariableName() 
		{
			return _cachedVariableName;
		}
    });
    
    this.getData = function (isPreload)
	{		
		return new Promise((resolve, reject) => {
			var _done = false;
			if(_cacheProps.enabled)
			{
				_source = _cache.get(_cacheProps.cachedVariableName);
				if(_source)
				{
					resolve(_source);
					_done = true;
				}
			}
			if(!_busy && !_done)
			{
				_busy = true;
				//todo: mund te hiqet ky if, pasi kontrolli behet ne setter perkates 
				// if(_cumulative && ((_lastop+1) * _recordsPerPage < _source.length)){
				// 	_currentPageIndex = _lastop;			
				// 	_busy = false;
				// }else{
					var eventObject = jQuery.Event(RemoteDataEvent.REQUEST_BEGUN);
					eventObject.error = 0; 
					this.trigger(eventObject);

					var _postExt = extend({}, _post);
				
					simpleAjax(_getData_Action, _postExt, 
						function (result) { 
							if(_cacheProps.enabled)
							{
								_cache.set(_cacheProps.cachedVariableName, result, _cacheProps.dependencies, _cacheProps.ttl);
								_cache.persist();
							}
							resolve(result);
							_fnUpdateSuccess.call(_self, result, isPreload);
						}, 
						function (jqXHR, textStatus, errorThrown) { 
							reject({"jqXHR":jqXHR, "textStatus":textStatus, "errorThrown":errorThrown});
							_fnUpdateFailed.call(_self, jqXHR, textStatus, errorThrown, isPreload);
						});		
				// }
			}else
			{
				//TODO: hidh eventin
				//RemoteDataEvent.REQUEST_QUEUEING testo nese isDefaultPrevented dhe hidh ose jo RemoteCursorEvent.REQUEST_QUEUED dhe shto ne queue kete veprim.
				//queue duhet te procesohet vetem ne success
			}
		});
	}
    
	var _fnUpdateSuccess = function(data, isPreload)
	{
		if(_autoRetry && _retriesCount>0){
			_base = 2;
			if(_retryTimeOut !=undefined && _retryTimeOut !=null){
				clearTimeout(_retryTimeOut);
			}
			_retriesCount = 0;
			_connTimeLine.push({disconnectedAt:_timeDisconnected.toISOString().slice(0, 19).replace('T', ' '), connectedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')});
			_timeDisconnected = null;
		}

		var eventObject;
		
		if(data)
		{
			eventObject = jQuery.Event(RemoteDataEvent.REQUEST_SUCCESS);
			eventObject.error = 0; 
			eventObject.data = data; 
			eventObject.isPreload = isPreload;

			if(!_isSynced){		
				_isSynced = true;	
			}		
			_source = data;

			this.trigger(eventObject);
		}else
		{
			eventObject = jQuery.Event(RemoteDataEvent.REQUEST_FAIL);
			eventObject.error = 1;
		}
		_busy = false;
	}

    var _fnUpdateFailed = function(jqXHR, textStatus, errorThrown, isPreload)
	{
		if(_timeDisconnected==undefined || _timeDisconnected==null){
			_timeDisconnected = new Date();
		}
		_busy = false;

		var eventObject = jQuery.Event(RemoteDataEvent.REQUEST_FAIL);
		eventObject.error = 2; 
		eventObject.retriesCount = _retriesCount;
		eventObject.isPreload = isPreload;
		this.trigger(eventObject);

		if(_autoRetry){
			++_retriesCount;
			_base = Math.pow(_base, _exponent)
			_retryTimeOut = setTimeout(function(){this.getData(isPreload);}.bind(this), _base *_factor);
		}
		
	}		
    //just syntatic sugar :)
	this.retry = function()
	{
		if(_autoRetry){
			//reset retry time
			_base = 2;
			if(_retryTimeOut !=undefined && _retryTimeOut !=null){
				clearTimeout(_retryTimeOut);
				_retryTimeOut = null;
			}
		}

		//if busy then sleep 100 ms and call my self back - because there is no meaning in interrupting an ongoing request to send another
		if(_busy){
			setTimeout(this.retry.bind(this), 100);
		}else{
			this.getData();
		}
    }

    Object.defineProperty(this, "source", 
	{
		get: function source() 
		{
			return _source;
        },
        configurable: true
    });
}
RemoteObject.prototype = Object.create(EventDispatcher.prototype);