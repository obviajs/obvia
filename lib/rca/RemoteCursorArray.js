 /**
     * RemoteCursorArray is a class for loading records and handling pagination. 
	 It will load some pages so the user will not have to wait for the data to load.
     * @param {string|module:plugins.SqlSupport.SqlQuery} query
     * @param {boolean|string} stmt
     * @returns {object}
     * @fires module:rca:RemoteCursorEvent
     * @throws MissingLibraryError, SQLParseError, UndefinedSQLOperatorError
     */
var RemoteCursorArray = function()
{
	this.$el = $(this);
    var _recordsPerPage = 45;
	var _currentPageIndex = -1;
	var _totalRecords = 0;		 
	var _sortData = [];	 
	var _filterData = {};
	var _lastop = 0;
	var _lastopRec = 0;

	var _getData_Action;
		
	var _cumulative = true;
	var _source = [];
	var _busy = false;
	var _threshold = 2;
	
	var _currentRecordIndex = -1;
	var _currentCumulativeRecordIndex = -1;
	//flag that indicates whether online sync already happened 
	var _isSynced = false;
	//if autoretry is true the system will automatically retry to getdata in exponential time intervals
	var _autoRetry = false;
	

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

	Object.defineProperty(this, "recordsPerPage", 
	{
		get: function recordsPerPage() 
		{
			return _recordsPerPage;
		},
		set: function recordsPerPage(x) 
		{
			//minimum is 1 record per page
			if(x<1)
				x = 1;
			_recordsPerPage = x;
			if(_currentCumulativeRecordIndex>-1){
				this.currentPageIndex = Math.ceil(_currentCumulativeRecordIndex+1 / _recordsPerPage);
			}
		}
	});
	

	
	Object.defineProperty(this, "currentPageIndex", 
	{
		get: function currentPageIndex() 
		{
			return Math.ceil((_currentCumulativeRecordIndex+1) / _recordsPerPage);
		},
		set: function currentPageIndex(x) 
		{
			if(_currentPageIndex != x){
				if((x>=0 && (x<=this.totalPages)) || (!_isSynced && x>=0)){
					if(x<=this.loadedPagesCount){
						_currentRecordIndex = 0;	
						_currentPageIndex = x;
						this.currentCumulativeRecordIndex = (_currentPageIndex-1) * _recordsPerPage;
						
						var eventObjectPCH = $.Event(RemoteCursorEventType.CURRENT_PAGE_CHANGED);
						eventObjectPCH.error = 0; 
						this.$el.trigger(eventObjectPCH);

					}else{
						_lastop = x;
						this.getData();
					}
				}else{
					throw new Error("Index Out of Bounds");
				}
			}
		}
	});
	
	Object.defineProperty(this, "currentPage", 
	{
		get: function currentPage() 
		{
			return ((_source!=null && _source!=undefined)? _source.slice((this.currentPageIndex*_recordsPerPage), ((this.currentPageIndex+1)*_recordsPerPage)):null);
		}
	});
	
	Object.defineProperty(this, "currentRecord", 
	{
		get: function currentRecord() 
		{
			return _source[_currentCumulativeRecordIndex];
		}
	});
	 
	Object.defineProperty(this, "currentCumulativeRecordIndex", 
	{
		get: function currentCumulativeRecordIndex() 
		{
			return _currentCumulativeRecordIndex;
		},
		set: function currentCumulativeRecordIndex(ci) 
		{
			if(ci != _currentCumulativeRecordIndex){
				if((!_isSynced && (_source==null )||(_source==undefined)) || (ci<0) || (_isSynced && (ci>_totalRecords-1)))
					throw new Error("Index Out of Bounds");
				else
				{
					var _minRi = 0;
					var _maxRi = _source.length;
					if(ci>=_minRi && ci<_maxRi){

							if((this.currentPageIndex < this.totalPages-1) && (ci > (_source.length - _threshold)) && (this.loadedPagesCount<this.totalPages)){
								_lastop = this.loadedPagesCount + 1;
								this.getData(_cumulative && true);
							}
							var np = Math.ceil((ci+1) / _recordsPerPage);
							if(_currentPageIndex != np){
								this.currentPageIndex = np;
							}
							
							_currentCumulativeRecordIndex = ci;
							
							var eventObjectRCH = $.Event(RemoteCursorEventType.CURRENT_RECORD_CHANGED);
							eventObjectRCH.error = 0; 
							this.$el.trigger(eventObjectRCH);
							if(_currentCumulativeRecordIndex==0){
								var eventObjectFR = $.Event(RemoteCursorEventType.FIRST_RECORD_REACHED);
								eventObjectFR.error = 0; 
								this.$el.trigger(eventObjectFR);
							}else if(_currentCumulativeRecordIndex==_totalRecords-1){
								var eventObjectLR = $.Event(RemoteCursorEventType.LAST_RECORD_REACHED);
								eventObjectLR.error = 0; 
								this.$el.trigger(eventObjectLR);
							}
					}else if(ci < _currentCumulativeRecordIndex && _isSynced){
						_lastop = this.currentPageIndex - Math.ceil((_currentCumulativeRecordIndex-ci) / _recordsPerPage);
						this.getData();	
					}else if(ci > _currentCumulativeRecordIndex && _isSynced){
						_lastop = this.currentPageIndex + Math.ceil((ci - _currentCumulativeRecordIndex) / _recordsPerPage);
						this.getData();	
					}else{
						_lastop = 1;
						this.getData();
					}
				}
			}
		}
	});
	
	Object.defineProperty(this, "loadedPagesCount", 
	{
		get: function loadedPagesCount() 
		{
			//Object.keys(_source).length
			return _cumulative?((_source!=undefined && _source!=null)?Math.ceil(_source.length / _recordsPerPage):0):_loadedPagesCount;
		},
	});

	Object.defineProperty(this, "currentRecordIndex", 
	{
		get: function currentRecordIndex() 
		{
			if(_currentRecordIndex==-1 && _source.length>0){
				_currentRecordIndex = 0;
			}else 
				_currentRecordIndex = (_currentCumulativeRecordIndex % _recordsPerPage);
			return _currentRecordIndex;
		},
		set: function currentRecordIndex(ci) 
		{
			if(ci != _currentRecordIndex){
				if((_source==null )||(_source==undefined)||(ci<0)|| (ci>_recordsPerPage-1))
					throw new Error("Index Out of Bounds");
				else{
					_currentCumulativeRecordIndex += ci - _currentRecordIndex;
					_currentRecordIndex = ci;	
				}
			}
		}
	});
	
	
	
	Object.defineProperty(this, "totalRecords", 
	{
		get: function totalRecords() 
		{
			return _totalRecords;
		}
	});
	
	
	Object.defineProperty(this, "totalPages", 
	{
		get: function totalPages() 
		{
			return Math.ceil(_totalRecords / _recordsPerPage);
		},
		
	});
	
	Object.defineProperty(this, "sortData", 
	{
		get: function sortData() 
		{
			return _sortData;
		},
		set: function sortData(x) 
		{
			if(_sortData != x){
				_sortData = x;
				//TODO: refresh?
			}
		}
	});

	Object.defineProperty(this, "filterData", 
	{
		get: function filterData() 
		{
			return _filterData;
		},
		set: function filterData(x) 
		{
			if(_filterData != x){
				_filterData = x;
				//TODO: refresh?
			}
		}
	});
	/*
		if the cursor is not cumulative than threshold will be 0
		recommended only for small count collections to load them at once
	*/
	Object.defineProperty(this, "cumulative", 
	{
		get: function cumulative() 
		{
			return _cumulative;
		},
		set: function cumulative(x) 
		{
			if(_cumulative!=x){
				_cumulative = x;
				if(!_cumulative){
					_threshold = 0;
				}
			}
		}
	}); 
	
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
					//TODO: refresh?
				}else{
					throw new Error("getData_Action is not a valid url");
				}
			}
		}
	}); 
	
	Object.defineProperty(this, "source", 
	{
		get: function source() 
		{
			return _source;
		},
		set: function source(x)
		{
			_source = x;
			_cumulative = true;
			if(_source!=undefined && _source!=null && _source.length>0){
				_currentRecordIndex = 0;
				_currentCumulativeRecordIndex = 0;
				_totalRecords = _source.length;
				_isSynced = false;
			}else{
				_currentRecordIndex = -1;
				_currentCumulativeRecordIndex = -1;
				_totalRecords = -1;
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
	
	Object.defineProperty(this, "threshold", 
	{
		get: function threshold() 
		{
			return _threshold;
		},
		set: function threshold(value) 
		{
			if(_threshold != value){
				if(value < 1)
					value = 1;
				else if(value >= _recordsPerPage)
					value = Math.min(_recordsPerPage, Math.max(1, _recordsPerPage - 2));
				_cumulative = true;
				_threshold = value;
				//TODO: refresh?
			}
		}
	}); 
	
	
	_fnUpdateSuccess = function(data, isPreload)
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
		
		if(data != null && data != undefined)
		{
			//server should include also total record count in response
			data = JSON.parse(data);	
			


			eventObject = $.Event(RemoteCursorEventType.REQUEST_SUCCESS);
			eventObject.error = 0; 
			eventObject.data = data; 
			eventObject.isPreload = isPreload;
			this.$el.trigger(eventObject);

			if(!_isSynced){		
				_totalRecords = data.total;	
				//it is better to allocate space immediately then to do push/pop/concat
				//_source = new Array(_totalRecords);
				_isSynced = true;	
			}		
			if(data.collection != null)
			{
				//for(var i:Number=0;i<data.collection.length;i++)
				//	this.addItem(data.collection[i]);
				if(data.collection["length"] !=undefined && data.collection.length > 0)
				{
					if(_cumulative)
					{
						//_source = _source.splicea(this.loadedPagesCount*_recordsPerPage, 0, data.collection);
						_source = _source.concat(data.collection);
					}
					else
					{
						_source = data.collection;
					}
					_loadedPagesCount = 1;
					if(!isPreload){
						this.currentPageIndex = this.loadedPagesCount;	
					}	
				}
			}
		}else
		{
			eventObject = new RemoteCursorEvent(RemoteCursorEventType.REQUEST_FAIL);
			eventObject.error = 1;
		}
		_busy = false;
	}
	
	_fnUpdateFailed = function(textStatus, errorThrown, isPreload)
	{
		if(_timeDisconnected==undefined || _timeDisconnected==null){
			_timeDisconnected = new Date();
		}
		_busy = false;

		var eventObject = $.Event(RemoteCursorEventType.REQUEST_FAIL);
		eventObject.error = 2; 
		eventObject.retriesCount = _retriesCount;
		eventObject.isPreload = isPreload;
		this.$el.trigger(eventObject);

		if(_autoRetry){
			++_retriesCount;
			_base = Math.pow(_base, _exponent)
			_retryTimeOut = setTimeout(function(){this.getData(isPreload);}.bind(this), _base *_factor);
		}
		
	}		

	var _base = 2;
	var _exponent = 2;
	var _factor = 200;
	var _retryTimeOut;
	var _retriesCount = 0;
	var _timeDisconnected;
	//we might want to persist/send to server this for later inspection/statistics
	var _connTimeLine = [];
	var _loadedPagesCount = 0;

	this.getData = function (isPreload)
	{		
		if(!_busy){
			_busy = true;
			//todo: mund te hiqet ky if, pasi kontrolli behet ne setter perkates 
			// if(_cumulative && ((_lastop+1) * _recordsPerPage < _source.length)){
			// 	_currentPageIndex = _lastop;			
			// 	_busy = false;
			// }else{
				var eventObject = $.Event(RemoteCursorEventType.REQUEST_BEGUN);
				eventObject.error = 0; 
				this.$el.trigger(eventObject);

				var thisContext = this;

				var _startPage;
				var _endPage;
				//is it next page or previous page
				if(this.loadedPagesCount > _lastop){
					_startPage = _lastop;
					_endPage = this.loadedPagesCount;
				}else{
					_startPage = this.loadedPagesCount;
					_endPage =  _lastop;
				}

				simpleAjax(_getData_Action, {isSynced: _isSynced, startPage: _startPage, endPage: _endPage, recordsPerPage: _recordsPerPage, sortData: _sortData, filterData: _filterData}, 
				function(result){ _fnUpdateSuccess.call(thisContext, result, isPreload);}, 
				function(textStatus, errorThrown){ _fnUpdateFailed.call(thisContext, textStatus, errorThrown, isPreload);});		
			// }
		}else
		{
			//TODO: hidh eventin
			//RemoteCursorEvent.REQUEST_QUEUEING testo nese isDefaultPrevented dhe hidh ose jo RemoteCursorEvent.REQUEST_QUEUED dhe shto ne queue kete veprim.
			//queue duhet te procesohet vetem ne success
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
	/*
	* we can implement : timed refresh - collection is refreshed once in x mins
	* odd/even page load refresh - i.e get count if next page is odd
	* manual - get page count if user clicks on the refresh icon
	*/
	this.refresh = function(){
		//force getting total count of records again
		_isSynced = false;
		this.getData();
	}
	this.init = function(){
		return (_source == null || _source.length==0) && (!_isSynced) && ((this.currentCumulativeRecordIndex=0) > -1);
	}
	this.reset = function(){
		_isSynced = false;
		return this.init();
	}
	this.nextPage = function()
	{	
		return (this.currentPageIndex < this.totalPages) && (++this.currentPageIndex > -1);
	}
	this.previousPage = function()
	{
		return (this.currentPageIndex > 1) && (--this.currentPageIndex > -1);
	}
	this.lastPage = function()
	{
		return (this.currentPageIndex < this.totalPages) && ((this.currentPageIndex = this.totalPages) > -1);
	}
	this.firstPage = function()
	{
		return (this.currentPageIndex > 1) && ((this.currentPageIndex = 1) > -1);
	}
	/*
	*	TODO: will load all pages between currentPageIndex and pg
	*	If we want to avoid this we should manage the loaded pages with an additional map pageIndex : {startRi, endRi} 
	*	but maintenance will become very complex because if we change recordPerPage we will need to re map loaded pages.
	*/
	this.gotoPage = function(pg)
	{
		return (this.currentPageIndex != pg) && ((this.currentPageIndex = pg) > -1);
	}

	this.nextRecord = function()
	{		
		return (this.currentCumulativeRecordIndex < this.totalRecords-1) && (++this.currentCumulativeRecordIndex > -1);
	}
	this.previousRecord = function()
	{
		return (_currentCumulativeRecordIndex > 0) && (--this.currentCumulativeRecordIndex > -1);
	}
	this.lastRecord = function()
	{
		return (_currentCumulativeRecordIndex < this.totalRecords-1) && ((this.currentCumulativeRecordIndex = this.totalRecords-1) > -1);
	}

	this.firstRecord = function()
	{
		return (_currentCumulativeRecordIndex > 0) && ((this.currentCumulativeRecordIndex = 0) > -1);
	}

	this.gotoRecord = function(ri)
	{
		return (_currentCumulativeRecordIndex != ri) && ((this.currentCumulativeRecordIndex = ri) > -1);
	}

	this.on = function (eventType, fnc) {
        if (typeof fnc !== 'function') {
            throw Error("The specified parameter is not a callback")
        } else {
            if (typeof fnc == 'function') {
                this.$el.on(eventType, function () {
                    fnc.apply(this, arguments);
                }.bind(this));
            }
        }
        return this;
    }
    this.trigger = function () {
        this.$el.trigger.apply(this.$el, arguments);
    }

} 

		