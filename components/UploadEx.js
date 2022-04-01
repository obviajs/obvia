/**
 * This is an UploadEx Element
 *
 * Kreatx 2019
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { Label, LabelType } from "/obvia/components/Label.js";
import { Form } from "/obvia/components/Form/Form.js";
import { Upload } from "/obvia/components/Form/Upload.js";
import { Link } from "/obvia/components/Link/Link.js";
import { ProgressBar, ProgressBarStyle } from "/obvia/components/ProgressBar/ProgressBar.js";
import { whenDefined } from "/obvia/lib/DecoratorUtils.js";
import { BinUtils } from "/obvia/lib/BinUtils.js";
import { getFontAwesomeIconFromMIME } from "/obvia/lib/my.js";
import { downloadFromUrl } from "/obvia/lib/my.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { FormEventType } from "/obvia/components/Form/FormEventType.js";
var UploadEx = function (_props)
{
    let _self = this;
    let _upload, _lblFileName, _btnRemove, _iconLbl, _lblFileSize, _progressBar, _progressRow, _btnUpload, _btnSelect, _additionalProperties, _action, _downloadUrl;
    let _lastFileTypeIcon, _autoUpload, _readOnly;

    let upload_change = function (e)
    {
        e.stopPropagation();
        e.stopImmediatePropagation();
        _self.value = e.target.files;
    };

    let _init = function (files)
    {
        if ((Array.isArray(files) || BinUtils.isFileList(files)) && files.length > 0)
        {

            if (BinUtils.isFile(files[0]) || BinUtils.isBlob(files[0]))
            {
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
            else if (files.length > 0 && files[0].type)
            {
                _lastFileTypeIcon = getFontAwesomeIconFromMIME(files[0].type);
                if (_lastFileTypeIcon == null)
                    _lastFileTypeIcon = "fa-file";
            } else
            {
                let ind = classes.indexOf(_lastFileTypeIcon);
                classes.splice(ind, 1);
                _lastFileTypeIcon = null;
            }
            if (_lastFileTypeIcon != null)
                classes.pushUnique(_lastFileTypeIcon);

            _iconLbl.classes = classes;

            //console.log("File(s) selected, type: "+e.target.files[0].type+" "+_lastFileTypeIcon);
            let arr = [],
                size;

            let alit = {
                ctor: "Link",
                props: {

                }
            };
            let lit = {
                ctor: "Label",
                props: {
                    label: ""
                },
                classes: ["mr-2"]
            };
            let acmps = [];
            for (let i = 0; i < files.length; i++)
            {
                if (files[i].url || _downloadUrl)
                {
                    let clit = ObjectUtils.deepCopy(alit);
                    clit.props.label = files[i].name;
                    clit.props.href = files[i].url || _downloadUrl;
                    acmps.push(clit);
                    acmps.push(lit);
                } else
                    arr.push(files[i].name);
                if (files[i].size && !isNaN(files[i].size))
                {
                    if (size == null)
                        size = 0;
                    size += files[i].size;
                }
            }
            _lblFileName.removeAllChildren();
            if (acmps.length > 0)
            {
                _lblFileName.label = "";
                _lblFileName.addComponents(acmps);
            } else
                _lblFileName.label = arr.length > 0 ? arr.join(",") : "No file selected.";
            if (isNaN(size))
                _lblFileSize.label = "";
            else
                _lblFileSize.label = StringUtils.formatBytes(size);
        } else
        {
            _btnUpload.enabled = false;
            _btnRemove.enabled = false;
        }
    };

    let selectBtn_click = function ()
    {
        _upload.fileDialog();
        console.log("selectBtn_click");
    };

    this.ajaxUpload = function (queuee = false)
    {
        if (_form && _form.ctor && _form.ctor == 'Form')
        {
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

            for (let i = 0; i < _upload.files.length; i++)
            {
                if ("size" in _upload.files[i] && !("url" in _upload.files[i]))
                {
                    _form.addFormData(_upload.id + "[]", _upload.files[i]);
                }
            }
            if (!queuee)
                return _form.post();
        }
    };

    this.ajaxDownload = function (i)
    {
        if (_value && Array.isArray(_value) && _value.length > 0 && i < _value.length)
            downloadFromUrl(_value[i].name, _value[i][_fullUrlField]).then().catch();
    };

    let uploadBtn_click = function (e)
    {
        _self.ajaxUpload();
    };

    let _ajaxUpload_error = function (e, jqXHR, textStatus, errorThrown)
    {
        setTimeout(_ajaxUpload_complete, 500);
    };

    let _ajaxUpload_success = function (e)
    {
        setTimeout(_ajaxUpload_complete, 500);
        let data = e.originalEvent.responseObject.response;
        for (let i = 0; i < _value.length; i++)
        {
            if (data[_upload.id])
            {
                for (let prop in data[_upload.id][i])
                {
                    _value[i][prop] = data[_upload.id][i][prop];
                }
            }
        }
        _init(_value);
    };

    let _ajaxUpload_progress = function (e, xhrProgressEvt)
    {
        _progressBar.valueNow = e.percentage;
        _btnUpload.fa.css.color = "blue";
    };

    let _ajaxUpload_started = function (e)
    {
        if (_showProgress)
        {
            let classes = _progressRow.classes.slice(0);
            classes.splice(classes.indexOf("d-none"), 1);
            _progressBar.valueNow = 0;
            _progressRow.classes = classes;
        }
    };

    let _ajaxUpload_complete = function (e)
    {
        if (_showProgress)
        {
            let classes = _progressRow.classes.slice(0);
            classes.pushUnique("d-none");
            _progressRow.classes = classes;
        }
        _btnUpload.fa.css.color = "";
    };

    let removeBtn_click = function ()
    {
        this.value = null;
        _upload.reset();
        _setValue();
    };

    let _cmps;

    let fnContainerDelay_init = function ()
    {
        _cmps = [{
            ctor: Container,
            props: {
                id: "mainRow",
                type: "",
                css: {
                    "display": "flex"
                },
                components: [
                    {
                        ctor: Label,
                        props: {
                            id: "wrapIconLbl",
                            width: 50,
                            components: [
                                {
                                    ctor: Label,
                                    props: {
                                        id: "iconLbl",
                                        labelType: LabelType.i
                                    }
                                }
                            ]
                        }
                    },
                    {
                        ctor: Label,
                        props: {
                            id: "fileName",
                            label: "No file selected.",
                            width: "100%"
                        }
                    },
                    {
                        ctor: Form,
                        props: {
                            id: "form",
                            components: [
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
                        ctor: Label,
                        props: {
                            id: "fileSize",
                            width: 100
                        }
                    },
                    {
                        ctor: Link,
                        props: {
                            id: "selectBtn",
                            type: "button",
                            href: "javascript:void(0)",
                            css: {
                                "width": "45px"
                            },
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
                        ctor: Link,
                        props: {
                            id: "uploadBtn",
                            type: "button",
                            href: "javascript:void(0)",
                            css: {
                                "width": "45px"
                            },
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
                        ctor: Link,
                        props: {
                            id: "removeBtn",
                            type: "button",
                            href: "javascript:void(0)",
                            css: {
                                "width": "45px"
                            },
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
        },
        {
            ctor: Container,
            props: {
                id: "progressRow",
                type: "",
                height: 5,
                classes: ["d-none"],
                components: [{
                    ctor: Container,
                    props: {
                        id: "progressColumn",
                        type: "",
                        spacing: {
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
                                classes: ["bg-info", ProgressBarStyle.PROGRESS, ProgressBarStyle.PROGRESS_ANIMATED, ProgressBarStyle.PROGRESS_STRIPED]
                            }
                        }]
                    }
                }]
            }
        }
        ];
    };

    Object.defineProperty(this, "multiple", {
        get: function multiple()
        {
            return _multiple;
        },
        set: function multiple(v)
        {
            if (_multiple != v)
            {
                let fn = whenDefined(_upload, "multiple", function ()
                {
                    _upload.multiple = _multiple = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "action", {
        get: function action()
        {
            return _action;
        },
        set: function action(v)
        {
            if (_action != v)
            {
                if (_form)
                {
                    _form.action = v;
                }
                _action = v;
            }
        }
    });

    Object.defineProperty(this, "autoUpload", {
        get: function autoUpload()
        {
            return _autoUpload;
        },
        set: function autoUpload(v)
        {
            if (_autoUpload != v)
            {
                _autoUpload = v;
            }
        }
    });
    Object.defineProperty(this, "readOnly", {
        get: function readOnly()
        {
            return _readOnly;
        },
        set: function readOnly(v)
        {
            if (_readOnly != v)
            {
                _readOnly = v;
                _btnSelect.display = !v;
                _btnRemove.display = !v;
                _btnUpload.display = !v;
            }
        }
    });

    Object.defineProperty(this, "additionalProperties", {
        get: function additionalProperties()
        {
            return _additionalProperties;
        },
        set: function additionalProperties(v)
        {
            if (_additionalProperties != v)
            {
                _additionalProperties = v;
            }
        }
    });

    Object.defineProperty(this, "accept", {
        get: function accept()
        {
            return _accept;
        },
        set: function accept(v)
        {
            if (_accept != v)
            {
                let fn = whenDefined(_upload, "accept", function ()
                {
                    _upload.accept = _accept = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "showBtnRemove", {
        get: function showBtnRemove()
        {
            return _showBtnRemove;
        },
        set: function showBtnRemove(v)
        {
            if (_showBtnRemove != v)
            {
                let fn = whenDefined(_btnRemove, "id", function ()
                {
                    if (v)
                    {
                        let classes = _btnRemove.classes.slice(0);
                        classes = classes.splice(classes.indexOf("d-none"), 1);
                        _btnRemove.classes = classes;
                    } else
                    {
                        let classes = _btnRemove.classes.slice(0);
                        classes.pushUnique("d-none");
                        _btnRemove.classes = classes;
                    }
                    _showBtnRemove = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "showProgress", {
        get: function showProgress()
        {
            return _showProgress;
        },
        set: function showProgress(v)
        {
            if (_showProgress != v)
            {
                _showProgress = v;
                if (!_showProgress)
                {
                    let classes = _progressRow.classes.slice(0);
                    classes.pushUnique("d-none");
                    _progressRow.classes = classes;
                }
            }
        }
    });

    Object.defineProperty(this, "downloadUrl", {
        get: function downloadUrl()
        {
            return _downloadUrl;
        },
        set: function downloadUrl(v)
        {
            if (_downloadUrl != v)
            {
                _downloadUrl = v;
            }
        }
    });

    Object.defineProperty(this, "upload", {
        get: function upload()
        {
            return _upload;
        }
    });

    Object.defineProperty(this, "value", {
        get: function value()
        {
            let f = false;
            if (_value)
            {
                let len = _value.length;
                for (let i = 0; i < len && !f; i++)
                {
                    if (!_value[i].url)
                    {
                        f = true;
                    }
                }
            }
            return f ? null : _value;
        },
        set: function value(v)
        {
            if (_value != v)
            {
                _setValue(v);
                if (_autoUpload && _value)
                {
                    let len = _value.length, f = false;
                    for (let i = 0; i < len && !f; i++)
                    {
                        if (!_value[i].url)
                        {
                            f = true;
                        }
                    }
                    if (f)
                    {
                        this.ajaxUpload().then(
                            () =>
                            {
                                _self.$el.trigger("change");
                            }
                        );
                    } else
                        _self.$el.trigger("change");
                } else
                {
                    _self.$el.trigger("change");
                }
            }
        }
    });

    let _setValue = function (v)
    {
        if (v)
        {
            if (!Array.isArray(v) && !BinUtils.isFileList(v))
                _value = _upload.files = [v];
            else
            {
                if (BinUtils.isFileList(v))
                {
                    v = Array.fromIterator(v);
                }
                _value = _upload.files = v;
            }
            for (let i = 0; i < _value.length; i++)
            {
                _value[0] = Object.assign(_value[0], _additionalProperties);
            }
            _init(_value);
        } else
        {
            _value = null;
            _init([{
                url: "",
                name: "",
                size: "",
                type: ""
            }]);
            _upload.reset();
        }
    };

    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _form = this.mainRow.form;
            _upload = this.mainRow.form.uploadInput;
            _upload.name = _upload.id + "[]";

            _iconLbl = this.mainRow.wrapIconLbl.iconLbl;
            _progressRow = this.progressRow;
            _progressBar = this.progressRow.progressColumn.progressbar;
            _lblFileName = this.mainRow.fileName;
            _lblFileSize = this.mainRow.fileSize;
            _btnSelect = this.mainRow.selectBtn;
            _btnUpload = this.mainRow.uploadBtn;
            _btnRemove = this.mainRow.removeBtn;

            if (_props.multiple != null)
                this.multiple = _props.multiple;
            if (_props.accept)
                this.accept = _props.accept;
            if (_props.showBtnRemove != null)
                this.showBtnRemove = _props.showBtnRemove;
            if (_props.value)
                _setValue(_props.value);
            if (_props.fullUrlField)
            {
                _fullUrlField = _props.fullUrlField;
            }
            if (_props.additionalProperties)
            {
                _additionalProperties = _props.additionalProperties;
            }
            if (_action == null && _props.action)
            {
                _self.action = _props.action;
            }
            if (_autoUpload == null && _props.autoUpload)
            {
                _self.autoUpload = _props.autoUpload;
            }
            if (_readOnly == null && _props.readOnly)
            {
                _self.readOnly = _props.readOnly;
            }
            if (_downloadUrl == null && _props.downloadUrl)
            {
                _self.downloadUrl = _props.downloadUrl;
            }
            e.preventDefault();
        }
    };

    let _defaultParams = {
        multiple: true,
        showProgress: true,
        fullUrlField: "full_url",
        type: "",
        autoUpload: true,
        readOnly: false,
        classes: ["form-control", "form-control-sm"],
    };

    let _multiple, _accept, _showBtnRemove, _form, _value, _showProgress, _fullUrlField;
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _showProgress = _props.showProgress;
    fnContainerDelay_init();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    _form = _props.form;
    return r;
};
UploadEx.prototype.ctor = 'UploadEx';
DependencyContainer.getInstance().register("UploadEx", UploadEx, DependencyContainer.simpleResolve);
export
{
    UploadEx
};