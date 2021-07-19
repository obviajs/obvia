/**
 * This is a Code Element
 * 
 * Kreatx 2019
 */
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { coroutine } from "/obvia/lib/coroutine.js";

var Code = function (_props) {
    let _self = this,
        _cmInst, _errors = [],
        _mode, _theme, _content, _readOnly, _nocursor;
    let _codeArea;
    let _cmps = [{
        ctor: TextArea,
        props: {
            id: 'codeArea',
            classes: ["d-none"]
        }
    }];

    this.insertTextAtCursor = function (text) {
        if (_cmInst) {
            let doc = _cmInst.getDoc();
            let cursor = doc.getCursor();
            //var line = doc.getLine(cursor.line);
            if (cursor.line != 0)
                doc.replaceRange(text, cursor);
        }
    };

    Object.defineProperty(this, "cmInst", {
        get: function cmInst() {
            return _cmInst;
        },
        enumerable: true
    });

    Object.defineProperty(this, "errors", {
        get: function errors() {
            return _errors;
        },
        enumerable: true
    });

    Object.defineProperty(this, "content", {
        get: function content() {
            if (_cmInst) {
                _content = _cmInst.getValue();
            }
            return _content;
        },
        set: function content(v) {
            if (this.content != v) {
                _content = v;
                if (_cmInst) {
                    _cmInst.setValue(_content);
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "readOnly", {
        get: function readOnly() {
            return _readOnly;
        },
        set: function readOnly(v) {
            if (_readOnly != v) {
                if (_readOnly) {
                    _nocursor = false;
                }
                _readOnly = v;
                if (_cmInst) {
                    _cmInst.setOption('readOnly', _readOnly);
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "nocursor", {
        get: function nocursor() {
            return _nocursor;
        },
        set: function nocursor(v) {
            if (_nocursor != v) {
                _nocursor = v;
                if (_cmInst) {
                    if (_nocursor)
                        _cmInst.setOption('readOnly', 'nocursor');
                    else if (_readOnly)
                        _cmInst.setOption('readOnly', true);
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "theme", {
        get: function theme() {
            return _theme;
        },
        set: function theme(v) {
            if (_theme != v) {
                _theme = v;
                if (_cmInst) {
                    CodeTheme.require(_theme).then(function () {
                        _cmInst.setOption("theme", _theme);
                    });
                }
            }
        },
        enumerable: true
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            this.$container = this.$el;
            //let arrInst = this.addComponents(_cmps);

            //e.preventDefault();

        }
    }

    this.afterAttach = function (e) {
        e.preventDefault();
        _codeArea = this.codeArea;
        coroutine(function* () {
            yield CodeMode.require(_mode.name);
            yield CodeTheme.require(_theme);
        }).then(function () {
            _cmInst = CodeMirror.fromTextArea(_codeArea.$el[0], _props);
            _cmInst.setValue(_content);
            _cmInst.setSize('100%', '100%');
            _cmInst.on("changes", _changes);
            _cmInst.on("gutterClick", function (cm, n) {
                let info = _cmInst.lineInfo(n);
                _cmInst.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : _makeMarker());
            });
        });
    };

    let _changes = function (cm, changes) {
        let evt = jQuery.Event("changes");
        evt.changes = changes;
        evt.cmInst = cm;
        _self.trigger(evt);
    }

    let _toggleFullScreen = function () {
        _cmInst.setOption("fullScreen", !_cmInst.getOption("fullScreen"));
    };

    let _exitFullScreen = function () {
        if (_cmInst.getOption("fullScreen")) _cmInst.setOption("fullScreen", false);
    };

    let _makeMarker = function () {
        let marker = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = "●";
        return marker;
    };

    let _defaultParams = {
        mode: {
            name: "javascript",
            globalVars: true,
            json: false
        },
        theme: "default",
        lineNumbers: true,
        styleActiveLine: true,
        scrollbarStyle: "simple",
        foldGutter: true,
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        matchBrackets: true,
        autoCloseBrackets: true,
        indentWithTabs: true,
        lint: {
            "onUpdateLinting": function (_errs) {
                _errors = _errs;
            },
            "getAnnotations": function (cm, updateLinting, options) {
                let errors = CodeMirror.lint.javascript(cm, options);
                updateLinting(errors);
                _errors = errors;
            },
            "async": true
        },
        //readOnly: 'nocursor',
        extraKeys: {
            "F11": _toggleFullScreen,
            "Esc": _exitFullScreen,
            "Ctrl-Space": "autocomplete",
            "Alt-F": "findPersistent"
        },
        attr: {
            "data-triggers": "change changes"
        },
        content: "",
        readOnly: false,
        nocursor: false
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _content = _props.content;
    _mode = _props.mode;
    _theme = _props.theme;
    _readOnly = _props.readOnly;
    _nocursor = _props.nocursor;
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
};
Code.prototype.ctor = 'Code';
export {
    Code
};