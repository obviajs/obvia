/**
 * This is an Upload Input Element
 *
 * Kreatx 2019
 */

//component definition
var Upload = function (_props) {
    let _self = this,
        _files;
    let _changeHandler = function (e) {
        _files = Array.fromIterator(e.target.files);
    };

    Object.defineProperty(this, "files", {
        get: function files() {
            return _files;
        },
        set: function files(v) {
            if (_files != v)
                _files = v;
        }
    });

    Object.defineProperty(this, "multiple", {
        get: function multiple() {
            return _multiple;
        },
        set: function multiple(v) {
            if (_multiple != v) {
                _multiple = v;
                if (_multiple) {
                    if (this.$el)
                        this.$el.attr("multiple", _multiple);
                } else {
                    if (this.$el)
                        this.$el.removeAttr('multiple');
                }
            }
        }
    });

    Object.defineProperty(this, "accept", {
        get: function accept() {
            return _accept;
        },
        set: function accept(v) {
            if (_accept != v) {
                _accept = v;
                if (_accept) {
                    if (this.$el)
                        this.$el.attr("accept", _accept);
                } else {
                    if (this.$el)
                        this.$el.removeAttr('accept');
                }
            }
        }
    });

    this.reset = function () {
        this.$el.wrap('<form class="d-none">').closest('form').get(0).reset();
        this.$el.unwrap();
    };

    this.fileDialog = function () {
        this.$el.click();
    };

    this.template = function () {
        return "<input data-triggers='change' type='file' id='" + this.domID + "'>";
    };

    let _defaultParams = {
        multiple: false
    };

    _props = extend(false, false, _defaultParams, _props);

    let _multiple;
    let _accept;
    let _promise;
    let _change = _props.change;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(_self, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _changeHandler.apply(_self, arguments);
        }
    };

    Component.call(this, _props);

    if (_props.multiple != null)
        this.multiple = _props.multiple;
    if (_props.accept)
        this.accept = _props.accept;
};
//component prototype
Upload.prototype.ctor = 'Upload';