/**
 * This is a Form component
 * 
 * Kreatx 2018
 */
var Form = function (_props) {
    let _formData, _action, _method, _self = this;

    Object.defineProperty(this, "method", {
        get: function method() {
            return _method;
        },
        set: function method(v) {
            if (_method != v) {
                if (_method) {
                    if (this.$el) {
                        this.$el.attr('method', v);
                        _method = v;
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('method');
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "action", {
        get: function action() {
            return _action;
        },
        set: function action(v) {
            if (_action != v) {
                if (_action) {
                    if (this.$el) {
                        this.$el.attr('action', v);
                        _action = v;
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('action');
                    }
                }
            }
        },
        enumerable: true
    });

    this.clear = function () {
        this.components.forEach(function (component) {
            try {
                if (typeof this[component.props.id].child.value == "string")
                    this[component.props.id].child.value = "";
                else this[component.props.id].child.value = [];
            } catch (error) {

            }
        }.bind(this));
    };

    this.serialize = function (encode = false) {
        let value = {};
        this.components.forEach(function (component) {
            value[component.props.id] = this[component.props.id].child.value;
        }.bind(this));

        let serialized = JSON.stringify(value);
        if (encode) {
            serialized = btoa(serialized);
        }
        return serialized;
    };

    this.template = function () {
        return "<form id='" + this.domID + "' method='" + _method + "' action='" + _action + "'></form>";
    };

    this.addFormData = function (name, value) {
        if (!_formData) {
            _formData = new FormData(this.$el[0]);
        }
        _formData.append(name, value);
    };

    this.removeFormData = function (name) {
        if (_formData) {
            if (typeof _formData["delete"] == 'function') {
                _formData.delete(name);
            } else {
                let _formData2 = new FormData();
                for (let pair of _formData.entries()) {
                    if (pair[0] != name) {
                        _formData2.append(pair[0], pair[1]);
                    }
                }
                _formData = _formData2;
            }
        }
    };

    this.getFormData = function () {
        if (!_formData) {
            _formData = new FormData(this.$el[0]);
        }
        return _formData;
    };

    this.resetFormData = function () {
        _formData = undefined;
    };

    this.reset = function () {
        this.$el.get(0).reset();
    };

    let _xhrProgress = function (e) {
        let postProgress = jQuery.Event(FormEventType.POST_PROGRESS);
        if (e.originalEvent.lengthComputable) {
            let total = postProgress.total = e.originalEvent.total;
            let loaded = postProgress.loaded = e.originalEvent.loaded;

            let percentage = (loaded * 100) / total;
            if (percentage >= 100) {
                // process completed  
            }
            postProgress.percentage = percentage;
        }
        postProgress.originalEvent = e;
        _self.trigger(postProgress, [_self]);
    };

    let _xhrStarted = function (e) {
        let postStarted = jQuery.Event(FormEventType.POST_STARTED);
        postStarted.originalEvent = e;
        _self.trigger(postStarted, [_self]);
    };

    let _requestComplete = function (e) {
        let postComplete = jQuery.Event(FormEventType.POST_COMPLETE);
        postComplete.originalEvent = e;
        _self.trigger(postComplete, [_self]);
    };

    let _xhrRejected = function (e) {
        let postError = jQuery.Event(FormEventType.POST_ERROR);
        postError.originalEvent = e;
        _self.trigger(postError, [_self]);
    };

    let _xhrResolved = function (e) {
        let postSuccess = jQuery.Event(FormEventType.POST_SUCCESS);
        postSuccess.originalEvent = e;
        _self.trigger(postSuccess, [_self]);
    };

    let _apiClient = new ApiClient();
    this.post = function (dataType) {
        let type = dataType ? dataType : "json";
        _apiClient.on("xhrProgress", _xhrProgress);
        _apiClient.on("xhrStarted", _xhrStarted);
        _apiClient.on("xhrRejected", _xhrRejected);
        _apiClient.on("xhrResolved", _xhrResolved);
        return _apiClient.body(this.getFormData())
            .type('multipart/form-data')
            .query()
            .path()
            .headers() //additional headers information
        [_method.toLowerCase()](_action, type).finally(_requestComplete);
    };

    let _defaultParams = {
        method: "POST",
        type: ""
    };

    _props = extend(false, false, _defaultParams, _props);
    _formData = null;
    _action = _props.action;
    _method = _props.method;

    let r = Container.call(this, _props);
    return r;
};
Form.prototype.ctor = 'Form';