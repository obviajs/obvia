var BrowserManager = function () {
    this.$el = $(this);
    let _self = this;
    let _states = [];
    let _title = document.title;
    let _oldHash;
    let _hash = location.hash;
    let _base = location.origin;
    let _url = location.href;

    let _hashchange = function (e) {
        _hash = location.hash;
    };
    // 
    let _popstate = function (e) {
		let state = e.originalEvent.state;
        _oldHash = _hash;
        _hash = location.hash;
        _title = document.title;
        _url = location.href;
        if (state !== null) {
		}
		let ind = indexOfObject(_states, "url", _hash, _states.length - 1, backWards = true);
		if (ind < 0) {
			//nuk ekziston
			_states.push({ "state": null, "title": null, "url": _hash, "scrollX": window.scrollX, "scrollY": window.scrollY });
		} else { 
			
        }

        let evt = jQuery.Event('hashchange');
        evt.oldValue = _oldHash;
        evt.newValue = _hash;
        _self.trigger(evt);
    };

    this.pushState = function (state, title, url) {
        if (isObject(state)) {
            if (!state.guid) {
                state.guid = StringUtils.guid();
            }
        }
        _states.push({ "state": state, "title": title, "url": url, "scrollX": window.scrollX, "scrollY": window.scrollY });
        history.pushState(state, title, url);
        
        _oldHash = _hash;
        _hash = location.hash;
    };

    this.init = function () {
        $(window).on("hashchange", _hashchange);
        $(window).on('popstate', _popstate);
    };
    
    Object.defineProperty(this, "title", {
        get: function title() {
            return _title;
        },
        set: function title(v) { 
            if (_title != v) { 
                document.title = _title = v;
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "url", {
        get: function url() {
            return _url;
        },
        set: function url(v) { 
            if (_url != v) { 
                window.location.href = _url = v;
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "base", {
        get: function base() {
            return _base;
        },
        configurable: true
    });

    Object.defineProperty(this, "hash", {
        get: function hash() {
            return _hash;
        },
        set: function hash(v) { 
            if (_hash != v) {
                location.hash = _hash = v;
            }
        },
        configurable: true
    });
};
BrowserManager.ctor = "BrowserManager";
BrowserManager.instance = null;
BrowserManager.getInstance = function () {
    if (!BrowserManager.instance)
        BrowserManager.instance = new BrowserManager();
    return BrowserManager.instance;
};     
BrowserManager.prototype = Object.create(EventDispatcher.prototype);