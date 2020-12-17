/**
 * This is an Image Element
 * 
 * Kreatx 2018
 */

//component definition
var Image = function (_props) {
    Object.defineProperty(this, "src", {
        get: function src() {
            return _src;
        },
        set: function src(v) {
            if (_src != v) {
                _src = v;
                if (this.$el)
                    this.$el.attr('src', v);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "title", {
        get: function title() {
            return _title;
        },
        set: function title(v) {
            if (_title != v) {
                _title = v;
                if (this.$el)
                    this.$el.attr('title', v);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "alt", {
        get: function alt() {
            return _alt;
        },
        set: function alt(v) {
            if (_alt != v) {
                _alt = v;
                if (this.$el)
                    this.$el.attr('alt', v);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "height", {
        get: function height() {
            return _height;
        },
        set: function height(v) {
            if (_height != v) {
                _height = v;
                if (this.$el)
                    this.$el.attr('height', v);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "width", {
        get: function width() {
            return _width;
        },
        set: function width(v) {
            if (_width != v) {
                _width = v;
                if (this.$el)
                    this.$el.attr('width', v);
            }
        },
        enumerable: true
    });

    this.beforeAttach = function () {
        if (_props.width) {
            this.width = _props.width;
        }
        if (_props.height) {
            this.height = _props.height;
        }
        if (_props.alt) {
            this.alt = _props.alt;
        }
        if (_props.title) {
            this.title = _props.title;
        }
    }

    this.template = function () {
        return '<img id="' + this.domID + '" src="' + this.src + '">';
    };
    var _defaultParams = {
        width: 0,
        height: 0,
        title: undefined,
        alt: undefined
    };

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["load"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    let _width, _height, _alt, _title;
    let _src = _props.src;
    let _load = _props.load;

    Component.call(this, _props, true);

    this.render = function () {
        if (this.$el.complete) {
            this.trigger('load');
        }
        this.trigger('beginDraw');
        this.trigger('endDraw');
        return Promise.resolve(this);
    };
};
Image.prototype.ctor = 'Image';