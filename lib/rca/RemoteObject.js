import { EventDispatcher } from "/obvia/lib/EventDispatcher.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var RemoteObject = function (_props) {
	let _defaultParams = {
		post: {},
		cacheProps: { cachedVariableName: null, dependencies: [], ttl: null, enabled: false },
		fetchPromise: null
	};
	ObjectUtils.fromDefault(_defaultParams, _props);
	//_props = ObjectUtils.extend(false, false, _defaultParams, _props);
	
	let _fetchPromise = _props.fetchPromise;
	let _cacheProps = _props.cacheProps;
	let _busy = false;
	let _source = null;	
	let _aPromise = null;
	this.$el = $(this);

	let _isSynced = false;
	let _self = this;
	let _cache;

	if (_cacheProps.enabled) {
		_cache = Cache.getInstance();
	}
    
	Object.defineProperty(this, "busy",
	{
		get: function busy() {
			return _busy;
		}
	});
    
	this.getData = function () {
		return new Promise((resolve, reject) => {
			let _done = false;
			if (_cacheProps.enabled) {
				_source = _cache.get(_cacheProps.cachedVariableName);
				if (_source) {
					resolve(_source);
					_done = true;
				}
			}
			if (!_busy && !_done) {
				_busy = true;
				//todo: mund te hiqet ky if, pasi kontrolli behet ne setter perkates 
				// if(_cumulative && ((_lastop+1) * _recordsPerPage < _source.length)){
				// 	_currentPageIndex = _lastop;			
				// 	_busy = false;
				// }else{
				let eventObject = jQuery.Event(RemoteDataEvent.REQUEST_BEGUN);
				eventObject.error = 0;
				this.trigger(eventObject);

				_aPromise = _fetchPromise.call(_self);
				_aPromise.then(function (result) {
					_fnUpdateSuccess.call(_self, result);
				}).catch(function (s) {
					_fnUpdateFailed.call(_self, s); 
				});
				return _aPromise;			
			} else {
				//TODO: hidh eventin
				//RemoteDataEvent.REQUEST_QUEUEING testo nese isDefaultPrevented dhe hidh ose jo RemoteCursorEvent.REQUEST_QUEUED dhe shto ne queue kete veprim.
				//queue duhet te procesohet vetem ne success
			}
		});
	};
    
	let _fnUpdateSuccess = function (data) {
		if (_cacheProps.enabled) {
			_cache.set(_cacheProps.cachedVariableName, data, _cacheProps.dependencies, _cacheProps.ttl);
			_cache.persist();
		}
		let eventObject;
		
		if (data) {
			eventObject = jQuery.Event(RemoteDataEvent.REQUEST_SUCCESS);
			eventObject.error = 0;
			eventObject.data = data;

			if (!_isSynced) {
				_isSynced = true;
			}
			_source = data;

			this.trigger(eventObject);
		} else {
			eventObject = jQuery.Event(RemoteDataEvent.REQUEST_FAIL);
			eventObject.error = 1;
		}
		_busy = false;
	};

	let _fnUpdateFailed = function (s) {
		
		_busy = false;

		let eventObject = jQuery.Event(RemoteDataEvent.REQUEST_FAIL);
		eventObject.error = 2;
		eventObject.retriesCount = _retriesCount;
		eventObject.xhrStatus = s;
		this.trigger(eventObject);	
	};

	Object.defineProperty(this, "source",
	{
		get: function source() {
			return _source;
		},
		configurable: true
	});
};
RemoteObject.prototype = Object.create(EventDispatcher.prototype);
RemoteObject.prototype.ctor = 'RemoteObject';
export {
    RemoteObject
};