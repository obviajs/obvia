/**
 * This is an MultiUpload Element
 *
 * Kreatx 2019
 */

var MultiUpload = function (_props, overrided = false) {
    var _self = this;
    let _cmps, _lblDrop, _dropContainer, _listRepeater, _progressRow, _progressBar;
    var _dataProvider;

    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                _dataProvider = v;
            }
        }
    });

    var fnContainerDelayInit = function(){
        _cmps = [
                    {
                        ctor: Repeater,
                        props: {
                            id: "listRepeater",
                            rendering: {
                                direction: "vertical",
                                separator: false
                            },
                            dataProvider: _dataProvider,
                            components: [
                                {
                                    ctor: UploadEx,
                                    props: {
                                        id: "upload",
                                        change: _upload_change,
                                        form: _form,
                                        value: "{currentItem}",
                                        multiple: false,
                                        showProgress: false
                                    }
                                }
                            ]
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
                            components:[
                                {
                                    ctor: Label,
                                    props: {
                                        id: "infoLabel",
                                        label: 'Drag and Drop File or Click Me',
                                        classes: ["text-center"],
                                        labelType: LabelType.p
                                    }
                                }
                            ]
                        }
                    },
                    {
                        ctor: Container,
                        props: {
                            id: "progressRow",
                            type: ContainerType.NONE,
                            classes:["d-none", "progress"],
                            height: 5,
                            components:[
                                {
                                    ctor: ProgressBar,
                                    props: {
                                        id:"progressbar",
                                        valueNow: 0,
                                        valueMin: 0,
                                        valueMax: 100,
                                        width: "100%",
                                        height: "100%",
                                        classes: [BgStyle.BG_INFO, ProgressBarStyle.PROGRESS, ProgressBarStyle.PROGRESS_ANIMATED, ProgressBarStyle.PROGRESS_STRIPED]
                                    }
                                }
                            ]
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

    var _htmlDragOverHandler = function(e){
        let t = e.originalEvent.dataTransfer.types;
        if (t.includes("Files")){
            e.preventDefault();
            e.stopPropagation();
            _lblDrop.label = "Drag here";
        }
    }

    var _htmlDropHandler = function(e){
        let t = e.originalEvent.dataTransfer.types;
        if (t.includes("Files")){
            e.preventDefault();
            e.stopPropagation();
            _lblDrop.label = "Drag and Drop File or Click Me";
        }
    }
    var _htmlDragLeaveHandler = function(e){
        let t = e.originalEvent.dataTransfer.types;
        if (t.includes("Files")){
            _lblDrop.label = "Drag and Drop File or Click Me";
        }
    }

    var _dragEnterHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drop";
    }

    var _dragOverHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drop";
    }
    
    var _dropHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drag and Drop File or Click Me";
        
        for(var n=0;n<e.originalEvent.dataTransfer.files.length;n++)
        {
            var len = _listRepeater["upload"] ? _listRepeater["upload"].length : 0;
            var allUsed = true;
            var i, rowUpl;
            for(i=0;i<len && allUsed;i++){
                rowUpl = _listRepeater["upload"][i];
                if(rowUpl.upload.files.length==0 || !("size" in rowUpl.upload.files[0])){
                    allUsed = false;
                    break;
                }
            }
            if(allUsed){
                _dataProvider.push([e.originalEvent.dataTransfer.files[n]]);
            }else{
                //_dataProvider[i] 
                rowUpl.value = e.originalEvent.dataTransfer.files[n];
            }
        }
        /*
        //TODO: add this file to one of the free upload sloats or add a new slot then add file
       

        var file = e.originalEvent.dataTransfer.files;

        var fd = new FormData();

        fd.append('file', file[0]);

        uploadData(fd);
        */
    }
    var _dragLeaveHandler = function(e){
        _lblDrop.label = "Drag and Drop File or Click Me";
    }


    var _clickHandler = function(e){
        var fnUplRowAdded = function(){
            _listRepeater.off("onRowAdd", fnUplRowAdded);
            var len = _listRepeater["upload"].length;
            var rowUpl = _listRepeater["upload"][len-1];
            rowUpl.upload.fileDialog();
        };

        var len = _listRepeater["upload"] ? _listRepeater["upload"].length : 0;
        var allUsed = true;
        for(var i=0;i<len && allUsed;i++){
            var rowUpl = _listRepeater["upload"][i];
            if(rowUpl.upload.files.length==0 || !("size" in rowUpl.upload.files[0])){
                allUsed = false;
                rowUpl.upload.fileDialog();
                break;
            }
        }
        if(allUsed){
            _listRepeater.on("onRowAdd", fnUplRowAdded);
            _listRepeater.dataProvider.push({});
        }
    }
    
    var _upload_change = function(e){
        console.log("UPL CHANGE: ", arguments);
        var last = _listRepeater.dataProvider.last();
        //last = Array.fromIterator(this.value);
    }

    this.ajaxUpload = function(){
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
        var len = _listRepeater["upload"] ? _listRepeater["upload"].length : 0;
        for(var i=0;i<len;i++){
            var rowUpl = _listRepeater["upload"][i];
            rowUpl.ajaxUpload(i==len-1?false:true);
        }
    }

    var _ajaxUpload_error = function(e, jqXHR,  textStatus, errorThrown){
        setTimeout(_ajaxUpload_complete, 500);
    }
    var _ajaxUpload_success = function(e, data, textStatus, jqXHR){
        setTimeout(_ajaxUpload_complete, 500);
    }
    var _ajaxUpload_progress = function(e, xhrProgressEvt){
        _progressBar.valueNow = xhrProgressEvt.percentage;
    }
    var _ajaxUpload_started = function(e){
        var classes = _progressRow.classes.slice(0);
        classes.splice(classes.indexOf("d-none"),1);
        _progressBar.valueNow = 0;
        _progressRow.classes = classes; 
    }
    var _ajaxUpload_complete = function(e){
        var classes = _progressRow.classes.slice(0);
        classes.pushUnique("d-none");
        _progressRow.classes = classes; 
    }

    var _registerSurrogate = function(e){
        //init events for this surrogate component.
       _self.initEvents(this.$el, 0);
    }
    var _defaultParams = {
        showBtnRemove: false,
        dataProvider: [],
        form: null
    };
    var _isSurrogate = true;
    var _accept, _showBtnRemove, _form;

    _props = extend(false, false, _defaultParams, _props);
    this.dataProvider = new ArrayEx(_props.dataProvider);
    _form = _props.form;
    
    fnContainerDelayInit();
    _props.components = _cmps;
    Container.call(this, _props, true, true);

    if(_props.accept)
        this.accept = _props.accept;  
    if(_props.showBtnRemove!=null)
        this.showBtnRemove = _props.showBtnRemove;
       
    var base = this.base;
    this.destruct = function (mode = 1) {
        $("html").off("dragover", _htmlDragOverHandler);
        $("html").off("drop", _htmlDropHandler);
        $("html").off("dragleave", _htmlDragLeaveHandler);

        _dropContainer.off('dragenter', _dragEnterHandler);
        _dropContainer.off('dragover', _dragOverHandler);
        _dropContainer.off('drop', _dropHandler);
        _dropContainer.off('dragleave', _dragLeaveHandler);
        _lblDrop.off('click', _clickHandler);
        base.destruct(mode);
    };
};

MultiUpload.prototype.ctor = 'MultiUpload';