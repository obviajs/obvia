/**
 * This is an MultiUpload Element
 *
 * Kreatx 2019
 */

var MultiUpload = function (_props) {
    let _self = this;
    let _cmps, _lblDrop, _dropContainer, _listRepeater, _progressRow, _progressBar;
    let _dataProvider;

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            if (_dataProvider != v) {
                _dataProvider = v;
            }
        }
    });

    let fnContainerDelayInit = function () {
        _cmps = [{
                ctor: Repeater,
                props: {
                    id: "listRepeater",
                    rendering: {
                        direction: "vertical",
                        separator: false
                    },
                    dataProvider: _dataProvider,
                    components: [{
                        ctor: UploadEx,
                        props: {
                            id: "upload",
                            change: _upload_change,
                            form: _form,
                            value: "{currentItem}",
                            multiple: false,
                            showProgress: false
                        }
                    }]
                }
            },
            {
                ctor: Container,
                props: {
                    id: "dropContainer",
                    type: ContainerType.NONE,
                    width: "100%",
                    height: 50,
                    classes: ["rounded-lg", "border"],
                    components: [{
                        ctor: Label,
                        props: {
                            id: "infoLabel",
                            label: 'Drag and Drop File or Click Me',
                            classes: ["text-center"],
                            labelType: LabelType.p
                        }
                    }]
                }
            },
            {
                ctor: Container,
                props: {
                    id: "progressRow",
                    type: ContainerType.NONE,
                    classes: ["d-none", "progress"],
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
            }
        ];
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            _lblDrop = this.dropContainer.infoLabel;
            _dropContainer = this.dropContainer;
            _listRepeater = this.listRepeater;
            _progressRow = this.progressRow;
            _progressBar = this.progressRow.progressbar;
            _lblDrop.on('click', _clickHandler);
            e.preventDefault();
            _form = _form == null ? _self.parentForm : _form;
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            $("html").on("dragover", _htmlDragOverHandler);
            $("html").on("drop", _htmlDropHandler);
            $("html").on("dragleave", _htmlDragLeaveHandler);
            _dropContainer.on('dragenter', _dragEnterHandler);
            _dropContainer.on('dragover', _dragOverHandler);
            _dropContainer.on('drop', _dropHandler);
            _dropContainer.on('dragleave', _dragLeaveHandler);
        }
    };

    //TODO: on dp change set binding for show/hide trash icon

    let _htmlDragOverHandler = function (e) {
        let t = e.originalEvent.dataTransfer.types;
        if (t.includes("Files")) {
            e.preventDefault();
            e.stopPropagation();
            _lblDrop.label = "Drag here";
        }
    };

    let _htmlDropHandler = function (e) {
        let t = e.originalEvent.dataTransfer.types;
        if (t.includes("Files")) {
            e.preventDefault();
            e.stopPropagation();
            _lblDrop.label = "Drag and Drop File or Click Me";
        }
    };

    let _htmlDragLeaveHandler = function (e) {
        let t = e.originalEvent.dataTransfer.types;
        if (t.includes("Files")) {
            _lblDrop.label = "Drag and Drop File or Click Me";
        }
    };

    let _dragEnterHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drop";
    };

    let _dragOverHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drop";
    };

    let _dropHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drag and Drop File or Click Me";

        for (let n = 0; n < e.originalEvent.dataTransfer.files.length; n++) {
            let len = _listRepeater["upload"] ? _listRepeater["upload"].length : 0;
            let allUsed = true;
            let i, rowUpl;
            for (i = 0; i < len && allUsed; i++) {
                rowUpl = _listRepeater["upload"][i];
                if (rowUpl.upload.files.length == 0 || !("size" in rowUpl.upload.files[0])) {
                    allUsed = false;
                    break;
                }
            }
            if (allUsed) {
                _dataProvider.push([e.originalEvent.dataTransfer.files[n]]);
            } else {
                //_dataProvider[i] 
                rowUpl.value = e.originalEvent.dataTransfer.files[n];
            }
        };
        /*
        //TODO: add this file to one of the free upload sloats or add a new slot then add file
       

        let file = e.originalEvent.dataTransfer.files;

        let fd = new FormData();

        fd.append('file', file[0]);

        uploadData(fd);
        */
    };
    let _dragLeaveHandler = function (e) {
        _lblDrop.label = "Drag and Drop File or Click Me";
    };


    let _clickHandler = function (e) {
        let fnUplRowAdded = function () {
            _listRepeater.off("onRowAdd", fnUplRowAdded);
            let len = _listRepeater["upload"].length;
            let rowUpl = _listRepeater["upload"][len - 1];
            rowUpl.upload.fileDialog();
        };

        let len = _listRepeater["upload"] ? _listRepeater["upload"].length : 0;
        let allUsed = true;
        for (let i = 0; i < len && allUsed; i++) {
            let rowUpl = _listRepeater["upload"][i];
            if (rowUpl.upload.files.length == 0 || !("size" in rowUpl.upload.files[0])) {
                allUsed = false;
                rowUpl.upload.fileDialog();
                break;
            }
        }
        if (allUsed) {
            _listRepeater.on("onRowAdd", fnUplRowAdded);
            _listRepeater.dataProvider.push({});
        }
    };

    let _upload_change = function (e) {
        console.log("UPL CHANGE: ", arguments);
        let last = _listRepeater.dataProvider.last();
        //last = Array.fromIterator(this.value);
    };

    this.ajaxUpload = function () {
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
        let len = _listRepeater["upload"] ? _listRepeater["upload"].length : 0;
        let rp = new Array(len);
        for (let i = 0; i < len; i++) {
            let rowUpl = _listRepeater["upload"][i];
            rp[i] = rowUpl.ajaxUpload(i == len - 1 ? false : true);
        }
        return Promise.all(rp);
    };

    let _ajaxUpload_error = function (e, jqXHR, textStatus, errorThrown) {
        setTimeout(_ajaxUpload_complete, 500);
    };

    let _ajaxUpload_success = function (e, data, textStatus, jqXHR) {
        setTimeout(_ajaxUpload_complete, 500);
    };

    let _ajaxUpload_progress = function (e, xhrProgressEvt) {
        _progressBar.valueNow = xhrProgressEvt.percentage;
    };

    let _ajaxUpload_started = function (e) {
        let classes = _progressRow.classes.slice(0);
        classes.splice(classes.indexOf("d-none"), 1);
        _progressBar.valueNow = 0;
        _progressRow.classes = classes;
    };

    let _ajaxUpload_complete = function (e) {
        let classes = _progressRow.classes.slice(0);
        classes.pushUnique("d-none");
        _progressRow.classes = classes;
    };

    let _defaultParams = {
        showBtnRemove: false,
        dataProvider: [],
        form: null
    };

    let _accept, _showBtnRemove, _form;

    _props = extend(false, false, _defaultParams, _props);
    this.dataProvider = new ArrayEx(_props.dataProvider);
    _form = _props.form;

    fnContainerDelayInit();
    _props.components = _cmps;
    Container.call(this, _props);

    if (_props.accept)
        this.accept = _props.accept;
    if (_props.showBtnRemove != null)
        this.showBtnRemove = _props.showBtnRemove;

    let _destruct = this.destruct;
    this.destruct = function (mode = 1) {
        $("html").off("dragover", _htmlDragOverHandler);
        $("html").off("drop", _htmlDropHandler);
        $("html").off("dragleave", _htmlDragLeaveHandler);

        _dropContainer.off('dragenter', _dragEnterHandler);
        _dropContainer.off('dragover', _dragOverHandler);
        _dropContainer.off('drop', _dropHandler);
        _dropContainer.off('dragleave', _dragLeaveHandler);
        _lblDrop.off('click', _clickHandler);
        _destruct(mode);
    };
};
MultiUpload.prototype.ctor = 'MultiUpload';