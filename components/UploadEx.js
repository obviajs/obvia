/**
 * This is an UploadEx Element
 *
 * Kreatx 2019
 */
var UploadEx = function (_props) {
    let _self = this;
    let _upload, _lblFileName, _btnRemove, _removeColumn, _iconLbl, _lblFileSize, _progressBar, _progressRow, _btnUpload, _btnDownload, _btnSelect;
    let _lastFileTypeIcon;

    let upload_change = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        _self.value = e.target.files;
    };

    let _init = function (files) {
        if ((Array.isArray(files) || BinUtils.isFileList(files)) && files.length > 0) {
            if (files[0]["url"] == null) {
                _btnDownload.enabled = false;
            }

            if (BinUtils.isFile(files[0]) || BinUtils.isBlob(files[0])) {
                _btnUpload.enabled = true;
            }

            let classes = _iconLbl.classes.slice(0);
            if (_lastFileTypeIcon)
                classes = classes.splice(classes.indexOf(_lastFileTypeIcon), 1);
            classes.pushUnique("fas");
            classes.pushUnique("fa-lg");
            classes.pushUnique("align-middle");
            if (files.length > 1)
                _lastFileTypeIcon = "fa-files";
            else if (files.length > 0) {
                _lastFileTypeIcon = getFontAwesomeIconFromMIME(files[0].type);
                if (_lastFileTypeIcon == null)
                    _lastFileTypeIcon = "fa-file";
            } else
                _lastFileTypeIcon = null;
            if (_lastFileTypeIcon != null)
                classes.pushUnique(_lastFileTypeIcon);

            _iconLbl.classes = classes;

            //console.log("File(s) selected, type: "+e.target.files[0].type+" "+_lastFileTypeIcon);
            let arr = [],
                size;
            for (let i = 0; i < files.length; i++) {
                arr.push(files[i].name);
                if (files[i].size && !isNaN(files[i].size))
                    if (size == null)
                        size = 0;
                size += files[i].size;
            }
            _lblFileName.label = arr.length > 0 ? arr.join(",") : "No file selected.";
            if (size == null)
                _lblFileSize.label = "";
            else
                _lblFileSize.label = formatBytes(size);
        } else {
            _btnDownload.enabled = false;
            _btnUpload.enabled = false;
            _btnRemove.enabled = false;
        }
    };

    let selectBtn_click = function () {
        _upload.fileDialog();
        console.log("selectBtn_click");
    };

    this.ajaxUpload = function (queuee = false) {
        if (_form && _form.ctor && _form.ctor == 'Form') {
            _form.removeFormData(_upload.id + "[]");
            _form.off(FormEventType.POST_ERROR, _ajaxUpload_error);
            _form.off(FormEventType.POST_SUCCESS, _ajaxUpload_success);
            _form.off(FormEventType.POST_PROGRESS, _ajaxUpload_progress);
            _form.off(FormEventType.POST_COMPLETE, _ajaxUpload_complete);
            _form.off(FormEventType.POST_STARTED, _ajaxUpload_started);

            _form.on(FormEventType.POST_ERROR, _ajaxUpload_error);
            _form.on(FormEventType.POST_SUCCESS, _ajaxUpload_success);
            _form.on(FormEventType.POST_PROGRESS, _ajaxUpload_progress);
            _form.on(FormEventType.POST_COMPLETE, _ajaxUpload_complete);
            _form.on(FormEventType.POST_STARTED, _ajaxUpload_started);

            for (let i = 0; i < _upload.files.length; i++) {
                if ("size" in _upload.files[i] && !("url" in _upload.files[i])) {
                    _form.addFormData(_upload.id + "[]", _upload.files[i]);
                }
            }
            if (!queuee)
                return _form.post();
        }
    };

    this.ajaxDownload = function () {
        if (_value && Array.isArray(_value) && _value.length > 0)
            downloadFromUrl(_value[0].name, _value[0].url).then().catch();
    };

    let uploadBtn_click = function (e) {
        _self.ajaxUpload();
    };

    let _ajaxUpload_error = function (e, jqXHR, textStatus, errorThrown) {
        setTimeout(_ajaxUpload_complete, 500);
    };

    let _ajaxUpload_success = function (e, data, textStatus, jqXHR) {
        setTimeout(_ajaxUpload_complete, 500);
        for (let i = 0; i < _value.length; i++) {
            if (data[_upload.id]) {
                _value[i].url = data[_upload.id][i].url;
            }
        }
    };

    let _ajaxUpload_progress = function (e, xhrProgressEvt) {
        _progressBar.valueNow = xhrProgressEvt.percentage;
    };

    let _ajaxUpload_started = function (e) {
        if (_showProgress) {
            let classes = _progressRow.classes.slice(0);
            classes.splice(classes.indexOf("d-none"), 1);
            _progressBar.valueNow = 0;
            _progressRow.classes = classes;
        }
    };

    let _ajaxUpload_complete = function (e) {
        if (_showProgress) {
            let classes = _progressRow.classes.slice(0);
            classes.pushUnique("d-none");
            _progressRow.classes = classes;
        }
    };

    let downloadBtn_click = function () {
        _self.ajaxDownload();
    };

    let removeBtn_click = function () {
        this.value = null;
    };

    let _cmps;

    let fnContainerDelay_init = function () {
        _cmps = [{
                ctor: Container,
                props: {
                    id: "mainRow",
                    type: ContainerType.ROW,
                    height: 30,
                    components: [{
                            ctor: Container,
                            props: {
                                id: "iconColumn",
                                type: ContainerType.COLUMN,
                                spacing: {
                                    colSpan: 1
                                },
                                classes: ["border"],
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: "iconLbl",
                                        labelType: LabelType.i
                                    }
                                }]
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "fileNameColumn",
                                type: ContainerType.COLUMN,
                                spacing: {
                                    colSpan: 7
                                },
                                classes: ["border"],
                                components: [{
                                        ctor: Label,
                                        props: {
                                            id: "fileName",
                                            label: "No file selected."
                                        }
                                    },
                                    {
                                        ctor: Upload,
                                        props: {
                                            id: "uploadInput",
                                            classes: ["d-none"],
                                            change: upload_change
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "fileSizeColumn",
                                type: ContainerType.COLUMN,
                                spacing: {
                                    colSpan: 1
                                },
                                classes: ["border"],
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: "fileSize",
                                    }
                                }]
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "controlsColumn",
                                type: ContainerType.BTN_GROUP,
                                role: "group",
                                spacing: {
                                    colSpan: 3,
                                    pr: 0,
                                    pl: 0
                                },
                                components: [{
                                        ctor: Button,
                                        props: {
                                            id: "selectBtn",
                                            type: "button",
                                            components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'fa',
                                                    labelType: LabelType.i,
                                                    classes: ["fas", "fa-folder-open"]
                                                }
                                            }],
                                            click: selectBtn_click
                                        }
                                    },
                                    {
                                        ctor: Button,
                                        props: {
                                            id: "uploadBtn",
                                            type: "button",
                                            enabled: false,
                                            components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'fa',
                                                    labelType: LabelType.i,
                                                    classes: ["fas", "fa-cloud-upload-alt"]
                                                }
                                            }],
                                            click: uploadBtn_click
                                        }
                                    },
                                    {
                                        ctor: Button,
                                        props: {
                                            id: "downloadBtn",
                                            type: "button",
                                            enabled: false,
                                            components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'fa',
                                                    labelType: LabelType.i,
                                                    classes: ["fas", "fa-cloud-download-alt"]
                                                }
                                            }],
                                            click: downloadBtn_click
                                        }
                                    },
                                    {
                                        ctor: Button,
                                        props: {
                                            id: "removeBtn",
                                            type: "button",
                                            enabled: false,
                                            components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'fa',
                                                    labelType: LabelType.i,
                                                    classes: ["fas", "fa-trash"]
                                                }
                                            }],
                                            click: removeBtn_click
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                ctor: Container,
                props: {
                    id: "progressRow",
                    type: ContainerType.ROW,
                    height: 5,
                    classes: ["d-none"],
                    components: [{
                        ctor: Container,
                        props: {
                            id: "progressColumn",
                            type: ContainerType.COLUMN,
                            spacing: {
                                colSpan: 12,
                                pl: 0
                            },
                            classes: ["border", "progress"],
                            height: 5,
                            components: [{
                                ctor: ProgressBar,
                                props: {
                                    id: "progressbar",
                                    valueNow: 0,
                                    valueMin: 0,
                                    valueMax: 100,
                                    width: "100%",
                                    height: "100%",
                                    classes: [BgStyle.BG_INFO, ProgressBarStyle.PROGRESS, ProgressBarStyle.PROGRESS_ANIMATED, ProgressBarStyle.PROGRESS_STRIPED]
                                }
                            }]
                        }
                    }]
                }
            }
        ];
    };

    Object.defineProperty(this, "multiple", {
        get: function multiple() {
            return _multiple;
        },
        set: function multiple(v) {
            if (_multiple != v) {
                let fn = whenDefined(_upload, "multiple", function () {
                    _upload.multiple = _multiple = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "accept", {
        get: function accept() {
            return _accept;
        },
        set: function accept(v) {
            if (_accept != v) {
                let fn = whenDefined(_upload, "accept", function () {
                    _upload.accept = _accept = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "showBtnRemove", {
        get: function showBtnRemove() {
            return _showBtnRemove;
        },
        set: function showBtnRemove(v) {
            if (_showBtnRemove != v) {
                let fn = whenDefined(_btnRemove, "id", function () {
                    if (v) {
                        let classes = _btnRemove.classes.slice(0);
                        classes = classes.splice(classes.indexOf("d-none"), 1);
                        _btnRemove.classes = classes;

                        classes = _removeColumn.classes.slice(0);
                        classes = classes.splice(classes.indexOf("d-none"), 1);
                        _removeColumn.classes = classes;
                    } else {
                        let classes = _btnRemove.classes.slice(0);
                        classes.pushUnique("d-none");
                        _btnRemove.classes = classes;

                        classes = _removeColumn.classes.slice(0);
                        classes.pushUnique("d-none");
                        _removeColumn.classes = classes;
                    }
                    _showBtnRemove = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "showProgress", {
        get: function showProgress() {
            return _showProgress;
        },
        set: function showProgress(v) {
            if (_showProgress != v) {
                _showProgress = v;
                if (!_showProgress) {
                    let classes = _progressRow.classes.slice(0);
                    classes.pushUnique("d-none");
                    _progressRow.classes = classes;
                }
            }
        }
    });

    Object.defineProperty(this, "upload", {
        get: function upload() {
            return _upload;
        }
    });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _setValue(v);
                _self.$el.trigger("change");
            }
        }
    });

    let _setValue = function (v) {
        if (v) {
            if (!Array.isArray(v) && !BinUtils.isFileList(v))
                _value = _upload.files = [v];
            else {
                if (BinUtils.isFileList(v)) {
                    v = Array.fromIterator(v);
                }
                _value = _upload.files = v;
            }
            _init(_value);
        } else {
            _init([{
                url: "",
                name: "",
                size: "",
                type: ""
            }]);
            _upload.reset();
        }
    };

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _upload = this.mainRow.fileNameColumn.uploadInput;
            _iconLbl = this.mainRow.iconColumn.iconLbl;
            _progressRow = this.progressRow;
            _progressBar = this.progressRow.progressColumn.progressbar;
            _lblFileName = this.mainRow.fileNameColumn.fileName;
            _lblFileSize = this.mainRow.fileSizeColumn.fileSize;
            _btnSelect = this.mainRow.controlsColumn.selectBtn;
            _btnUpload = this.mainRow.controlsColumn.uploadBtn;
            _btnDownload = this.mainRow.controlsColumn.downloadBtn;
            _btnRemove = this.mainRow.controlsColumn.removeBtn;
            _removeColumn = this.mainRow.controlsColumn.removeColumn;

            if (_props.multiple != null)
                this.multiple = _props.multiple;
            if (_props.accept)
                this.accept = _props.accept;
            if (_props.showBtnRemove != null)
                this.showBtnRemove = _props.showBtnRemove;
            if (_props.value)
                _setValue(_props.value);
            e.preventDefault();

            _form = _form == null ? _self.parentForm : _form;
        }
    };

    let _defaultParams = {
        multiple: true,
        value: [],
        form: null,
        showProgress: true
    };

    let _multiple, _accept, _showBtnRemove, _form, _value, _showProgress;

    _props = extend(false, false, _defaultParams, _props);
    _showProgress = _props.showProgress;
    fnContainerDelay_init();
    _props.components = _cmps;
    Container.call(this, _props);
    _form = _props.form;
};
UploadEx.prototype.ctor = 'UploadEx';