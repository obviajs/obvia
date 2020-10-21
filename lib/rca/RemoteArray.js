 /**
     * RemoteArray is a class for loading records and handling pagination. 
	 It will load some pages so the user will not have to wait for the data to load.
     */
 let RemoteArray = function (_props) {
 	let _self = this;
 	let _defaultParams = {
 		threshold: 0,
 		autoRetry: false,
 		autoReset: false,
 		autoInit: false,
 		sortData: [],
 		filterData: {},
 		fetchPromise: null
 	};
 	_props = extend(_defaultParams, _props);

 	this.$el = $(this);
 	let _fetchPromise = _props.fetchPromise;
 	let _recordsPerPage = _props.recordsPerPage;
 	let _currentPageIndex = -1;
 	let _totalRecords = 0;
 	let _sortData = _props.sortData;
 	let _filterData = _props.filterData;
 	let _lastop = 0;
 	let _lastopRec = 0;

 	let _cumulative = true;
 	let _source = [];
 	let _busy = false;
 	let _threshold = _props.threshold;

 	let _currentRecordIndex = -1;
 	let _currentCumulativeRecordIndex = -1;
 	//flag that indicates whether online sync already happened 
 	let _isSynced = false;
 	let _autoReset = _props.autoReset;
 	let _autoInit = _props.autoInit;
 	let _aPromise = null;
 	Object.defineProperty(this, "autoReset", {
 		get: function autoReset() {
 			return _autoReset;
 		},
 		set: function autoReset(x) {
 			_autoReset = x;
 		}
 	});

 	Object.defineProperty(this, "recordsPerPage", {
 		get: function recordsPerPage() {
 			return _recordsPerPage;
 		},
 		set: function recordsPerPage(x) {
 			//minimum is 1 record per page
 			if (x < 1)
 				x = 1;
 			_recordsPerPage = x;
 			if (_currentCumulativeRecordIndex > -1) {
 				this.currentPageIndex = Math.ceil(_currentCumulativeRecordIndex + 1 / _recordsPerPage);
 			}
 		}
 	});

 	Object.defineProperty(this, "currentPageIndex", {
 		get: function currentPageIndex() {
 			return Math.ceil((_currentCumulativeRecordIndex + 1) / _recordsPerPage);
 		},
 		set: function currentPageIndex(x) {
 			if (_currentPageIndex != x || !_isSynced) {
 				if (x >= 0 && (x <= this.totalPages)) {
 					if (x <= this.loadedPagesCount) {
 						_currentRecordIndex = 0;
 						_currentPageIndex = x;
 						this.currentCumulativeRecordIndex = (_currentPageIndex - 1) * _recordsPerPage;

 						let eventObjectPCH = jQuery.Event(RemoteDataEvent.CURRENT_PAGE_CHANGED);
 						eventObjectPCH.error = 0;
 						this.trigger(eventObjectPCH);

 					} else {
 						_lastop = x;
 						this.getData();
 					}
 				} else {
 					throw new Error("Index Out of Bounds");
 				}
 			}
 		}
 	});

 	Object.defineProperty(this, "currentPage", {
 		get: function currentPage() {
 			return ((_source != null && _source != undefined) ? _source.slice((this.currentPageIndex * _recordsPerPage), ((this.currentPageIndex + 1) * _recordsPerPage)) : null);
 		}
 	});

 	Object.defineProperty(this, "currentRecord", {
 		get: function currentRecord() {
 			return _source[_currentCumulativeRecordIndex];
 		}
 	});

 	Object.defineProperty(this, "currentCumulativeRecordIndex", {
 		get: function currentCumulativeRecordIndex() {
 			return _currentCumulativeRecordIndex;
 		},
 		set: function currentCumulativeRecordIndex(ci) {
 			if (!_isSynced || ci != _currentCumulativeRecordIndex) {
					//if ((_reset || !_isSynced || (_source == null)) || (ci < 0) || (_isSynced && (ci > _totalRecords - 1))) {
				if (_source==null && (ci < 0 || (ci > _totalRecords - 1))) {	
 					if (ci < 0)
 						ci = 0;
 					else if (_isSynced && (ci > _totalRecords - 1))
 						ci = _totalRecords - 1;
 					this.currentCumulativeRecordIndex = ci;
 					//throw new Error("Index Out of Bounds");
 				} else {
 					let _minRi = 0;
 					let _maxRi = _source.length;
 					if (ci >= _minRi && ci < _maxRi && _isSynced) {

 						if ((this.currentPageIndex < this.totalPages - 1) && (ci > (_source.length - _threshold)) && (this.loadedPagesCount < this.totalPages)) {
 							_lastop = this.loadedPagesCount + 1;
 							this.getData(_cumulative && true);
 						}
 						let np = Math.ceil((ci + 1) / _recordsPerPage);
 						if (_currentPageIndex != np) {
 							this.currentPageIndex = np;
 						}

 						_currentCumulativeRecordIndex = ci;

 						let eventObjectRCH = jQuery.Event(RemoteDataEvent.CURRENT_RECORD_CHANGED);
 						eventObjectRCH.error = 0;
 						this.trigger(eventObjectRCH);
 						if (_currentCumulativeRecordIndex == 0) {
 							let eventObjectFR = jQuery.Event(RemoteDataEvent.FIRST_RECORD_REACHED);
 							eventObjectFR.error = 0;
 							this.trigger(eventObjectFR);
 						} else if (_currentCumulativeRecordIndex == _totalRecords - 1) {
 							let eventObjectLR = jQuery.Event(RemoteDataEvent.LAST_RECORD_REACHED);
 							eventObjectLR.error = 0;
 							this.trigger(eventObjectLR);
 						}
 					} else if (ci < _currentCumulativeRecordIndex && _isSynced) {
 						_lastop = this.currentPageIndex - Math.ceil((_currentCumulativeRecordIndex - ci) / _recordsPerPage);
 						this.getData();
 					} else if (ci > _currentCumulativeRecordIndex && _isSynced) {
 						_lastop = this.currentPageIndex + Math.ceil((ci - _currentCumulativeRecordIndex) / _recordsPerPage);
 						this.getData();
 					} else {
 						_lastop = 0;
 						this.getData();
 					}
 				}
 			}
 		}
 	});

 	Object.defineProperty(this, "loadedPagesCount", {
 		get: function loadedPagesCount() {
 			//Object.keys(_source).length
 			return _cumulative ? (_source != null ? Math.ceil(_source.length / _recordsPerPage) : 0) : _loadedPagesCount;
 		},
 	});

 	Object.defineProperty(this, "currentRecordIndex", {
 		get: function currentRecordIndex() {
 			if (_currentRecordIndex == -1 && _source.length > 0) {
 				_currentRecordIndex = 0;
 			} else
 				_currentRecordIndex = (_currentCumulativeRecordIndex % _recordsPerPage);
 			return _currentRecordIndex;
 		},
 		set: function currentRecordIndex(ci) {
 			if (ci != _currentRecordIndex) {
 				if ((_source == null) || (_source == undefined) || (ci < 0) || (ci > _recordsPerPage - 1))
 					throw new Error("Index Out of Bounds");
 				else {
 					_currentCumulativeRecordIndex += ci - _currentRecordIndex;
 					_currentRecordIndex = ci;
 				}
 			}
 		}
 	});


 	Object.defineProperty(this, "totalRecords", {
 		get: function totalRecords() {
 			return _totalRecords;
 		}
 	});

 	Object.defineProperty(this, "totalPages", {
 		get: function totalPages() {
 			return Math.ceil(_totalRecords / _recordsPerPage);
 		},

 	});

 	Object.defineProperty(this, "sortData", {
 		get: function sortData() {
 			return _sortData;
 		},
 		set: function sortData(x) {
 			if (_sortData != x) {
 				_sortData = x;
 				if (_autoReset) {
 					this.reset();
 				}
 			}
 		}
 	});

 	Object.defineProperty(this, "filterData", {
 		get: function filterData() {
 			return _filterData;
 		},
 		set: function filterData(x) {
 			if (_filterData != x) {
 				_filterData = x;
 				if (_autoReset) {
 					this.reset();
 				}
 			}
 		}
 	});
 	/*
 		if the cursor is not cumulative than threshold will be 0
 		recommended only for small count collections to load them at once
 	*/
 	Object.defineProperty(this, "cumulative", {
 		get: function cumulative() {
 			return _cumulative;
 		},
 		set: function cumulative(x) {
 			if (_cumulative != x) {
 				_cumulative = x;
 				if (!_cumulative) {
 					_threshold = 0;
 				}
 			}
 		}
 	});

 	Object.defineProperty(this, "source", {
 		get: function source() {
 			return _source;
 		},
 		set: function source(x) {
 			_source = x;
 			_cumulative = true;
 			if (_source != null && _source.length > 0) {
 				_currentRecordIndex = 0;
 				_currentCumulativeRecordIndex = 0;
 				_totalRecords = _source.length;
 				_isSynced = false;
 			} else {
 				_currentRecordIndex = -1;
 				_currentCumulativeRecordIndex = -1;
 				_totalRecords = -1;
 			}
 		}
 	});

 	Object.defineProperty(this, "busy", {
 		get: function busy() {
 			return _busy;
 		}
 	});

 	Object.defineProperty(this, "threshold", {
 		get: function threshold() {
 			return _threshold;
 		},
 		set: function threshold(value) {
 			if (_threshold != value) {
 				if (value < 1)
 					value = 1;
 				else if (value >= _recordsPerPage)
 					value = Math.min(_recordsPerPage, Math.max(1, _recordsPerPage - 2));
 				_cumulative = true;
 				_threshold = value;
 			}
 		}
 	});


 	let _fnUpdateSuccess = function (data, isPreload, expectedPages) {
 		let eventObject;

 		if (data != null) {
 			//server should include also total record count in response
 			if (isJSON(data))
 				data = JSON.parse(data);

 			eventObject = jQuery.Event(RemoteDataEvent.REQUEST_SUCCESS);
 			eventObject.error = 0;
 			eventObject.data = data;
 			eventObject.isPreload = isPreload;

 			if (!_isSynced) {
 				_totalRecords = Infinity;
 				//it is better to allocate space immediately then to do push/pop/concat
 				//_source = new Array(_totalRecords);
 				_isSynced = true;
 			}
			if (data != null) {
				//for(let i:Number=0;i<data.length;i++)
				//	this.addItem(data[i]);
				if (data.length != null) {
					if (_cumulative && !_reset) {
						//_source = _source.splicea(this.loadedPagesCount*_recordsPerPage, 0, data);
						_source.splicea(_source.length, 0, data);
					} else {
						_source.splicea(0, _source.length, data);
						if (_reset)
							_reset = false;
					}
					_loadedPagesCount = 1;
					if (!isPreload) {
						this.currentPageIndex = this.loadedPagesCount;
					}
					_totalRecords = _source.length;
				} else
					_totalRecords = 0;
			} else { 
				_source.splicea(0, _source.length, []);
				if (_reset)
					_reset = false;
				_totalRecords = 0;
				_loadedPagesCount = 1;
				this.currentPageIndex = 0;
			}
 		} else {
 			eventObject = jQuery.Event(RemoteDataEvent.REQUEST_FAIL);
 			eventObject.error = 1;
 		}

 		_busy = false;
 		this.trigger(eventObject);
 	};

 	let _fnUpdateFailed = function (s, isPreload) {
 		_busy = false;

 		let eventObject = jQuery.Event(RemoteDataEvent.REQUEST_FAIL);
 		eventObject.error = 2;
 		eventObject.isPreload = isPreload;
 		eventObject.xhrStatus = s;
 		this.trigger(eventObject);
 	};

 	let _loadedPagesCount = 0;

 	this.getData = function (isPreload) {
 		if (!_busy) {
 			_busy = true;
 			//todo: mund te hiqet ky if, pasi kontrolli behet ne setter perkates 
 			// if(_cumulative && ((_lastop+1) * _recordsPerPage < _source.length)){
 			// 	_currentPageIndex = _lastop;			
 			// 	_busy = false;
 			// }else{
 			let eventObject = jQuery.Event(RemoteDataEvent.REQUEST_BEGUN);
 			eventObject.error = 0;
 			this.trigger(eventObject);

 			let _startPage;
 			let _endPage;
 			//is it next page or previous page
 			if (this.loadedPagesCount > _lastop) {
 				_startPage = _lastop;
 				_endPage = this.loadedPagesCount;
 			} else {
 				_startPage = this.loadedPagesCount;
 				_endPage = _lastop;
 			}

 			_aPromise = _fetchPromise.call(_self, {
 				"startPage": _startPage,
 				"sortData": _sortData,
 				"filterData": _filterData,
 				"recordsPerPage": _recordsPerPage
 			});
 			_aPromise.then(function (result) {
 				_fnUpdateSuccess.call(_self, result, isPreload, _endPage - _startPage);
 			}).catch(function (s) {
 				_fnUpdateFailed.call(_self, s, isPreload);
 			});
 			return _aPromise;
 		} else {
 			//TODO: hidh eventin
 			//RemoteDataEvent.REQUEST_QUEUEING testo nese isDefaultPrevented dhe hidh ose jo RemoteDataEvent.REQUEST_QUEUED dhe shto ne queue kete veprim.
 			//queue duhet te procesohet vetem ne success
 		}
 	};

 	/*
 	 * we can implement : timed refresh - collection is refreshed once in x mins
 	 * odd/even page load refresh - i.e get count if next page is odd
 	 * manual - get page count if user clicks on the refresh icon
 	 */
 	this.refresh = function () {
 		//force getting total count of records again
 		_isSynced = false;
 		this.getData();
 	};

 	this.init = function () {
 		if ((_reset || _source == null || _source.length == 0) && (!_isSynced))
 			this.currentPageIndex = 0;
 		return _aPromise;
 	};

 	let _reset = false;
 	this.reset = function () {
 		_reset = true;
 		_isSynced = false;
 		return this.init();
 	};

 	this.nextPage = function () {
 		if (this.currentPageIndex < this.totalPages)
 			++this.currentPageIndex;
 		return _aPromise;
 	};

 	this.previousPage = function () {
 		return (this.currentPageIndex > 1) && (--this.currentPageIndex > -1);
 	};

 	this.lastPage = function () {
 		return (this.currentPageIndex < this.totalPages) && ((this.currentPageIndex = this.totalPages) > -1);
 	};

 	this.firstPage = function () {
 		return (this.currentPageIndex > 1) && ((this.currentPageIndex = 1) > -1);
 	};
 	/*
 	 *	TODO: will load all pages between currentPageIndex and pg
 	 *	If we want to avoid this we should manage the loaded pages with an additional map pageIndex : {startRi, endRi} 
 	 *	but maintenance will become very complex because if we change recordPerPage we will need to re map loaded pages.
 	 */
 	this.gotoPage = function (pg) {
 		return (this.currentPageIndex != pg) && ((this.currentPageIndex = pg) > -1);
 	};

 	this.nextRecord = function () {
 		return (this.currentCumulativeRecordIndex < this.totalRecords - 1) && (++this.currentCumulativeRecordIndex > -1);
 	};

 	this.previousRecord = function () {
 		return (_currentCumulativeRecordIndex > 0) && (--this.currentCumulativeRecordIndex > -1);
 	};

 	this.lastRecord = function () {
 		return (_currentCumulativeRecordIndex < this.totalRecords - 1) && ((this.currentCumulativeRecordIndex = this.totalRecords - 1) > -1);
 	};

 	this.firstRecord = function () {
 		return (_currentCumulativeRecordIndex > 0) && ((this.currentCumulativeRecordIndex = 0) > -1);
 	};

 	this.gotoRecord = function (ri) {
 		return (_currentCumulativeRecordIndex != ri) && ((this.currentCumulativeRecordIndex = ri) > -1);
 	};

 	if (_autoInit) {
 		this.init();
 	}
 };
 RemoteArray.prototype = Object.create(EventDispatcher.prototype);
 RemoteArray.prototype.ctor = 'RemoteArray';
 RemoteArray.prototype.constructor = RemoteArray;