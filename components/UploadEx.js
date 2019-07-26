/**
 * This is an UploadEx Element
 *
 * Kreatx 2019
 */

var UploadEx = function (_props, overrided = false) {
    var _self = this;
    var _cmp;
    var _upload, _lblFileName, _btnRemove, _removeColumn, _iconLbl, _lblFileSize, _progressBar, _progressRow, _btnUpload, _btnDownload, _btnSelect;
    var _lastFileTypeIcon;

    var upload_change = function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
        _self.value = e.target.files;
    }

    var init = function(files){
        if((Array.isArray(files) || BinUtils.isFileList(files)) && files.length>0)
        {
            if(files[0]["url"]==null){
                _btnDownload.enabled = false;
            }

            if(BinUtils.isFile(files[0]) || BinUtils.isBlob(files[0])){
                _btnUpload.enabled = true;
            }

            var classes = _iconLbl.classes.slice(0);
            if(_lastFileTypeIcon)
                classes = classes.splice(classes.indexOf(_lastFileTypeIcon),1);
            classes.pushUnique("fas");
            classes.pushUnique("fa-lg");
            classes.pushUnique("align-middle");
            if(files.length>1)
                _lastFileTypeIcon = "fa-files";
            else if(files.length>0){
                _lastFileTypeIcon = getFontAwesomeIconFromMIME(files[0].type);
                if(_lastFileTypeIcon==null)  
                    _lastFileTypeIcon = "fa-file";  
            }
            else
                _lastFileTypeIcon = null;
            if(_lastFileTypeIcon!=null)  
                classes.pushUnique(_lastFileTypeIcon);
            
            _iconLbl.classes = classes; 
            
            //console.log("File(s) selected, type: "+e.target.files[0].type+" "+_lastFileTypeIcon);
            var arr = [], size;
            for(var i=0;i<files.length;i++){
                arr.push(files[i].name);
                if(files[i].size && !isNaN(files[i].size))
                    if(size==null)
                        size = 0;
                    size += files[i].size;
            }
            _lblFileName.label = arr.length>0?arr.join(","):"No file selected.";
            if(size==null)
                _lblFileSize.label = "";
            else
                _lblFileSize.label = formatBytes(size); 
        }else{
            _btnDownload.enabled = false;
            _btnUpload.enabled = false;
            _btnRemove.enabled = false;
        }
    }

    var selectBtn_click = function(){
        _upload.fileDialog();
        console.log("selectBtn_click");
    }
    
    this.ajaxUpload = function(queuee = false){
        if(_form && _form.ctor && _form.ctor == 'Form'){
            _form.removeFormData(_upload.id+"[]");
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

            for(var i=0;i<_upload.files.length;i++){
                if("size" in _upload.files[i] && !("url" in _upload.files[i])){
                    _form.addFormData(_upload.id+"[]", _upload.files[i]);
                }
            }
            if(!queuee)
                _form.post();
        }
    }

    this.ajaxDownload = function(){
        if(_value && Array.isArray(_value) && _value.length>0)
            downloadFromUrl(_value[0].name, _value[0].url).then().catch();
    }

    var uploadBtn_click = function(e){
        _self.ajaxUpload();
    }
    var _ajaxUpload_error = function(e, jqXHR,  textStatus, errorThrown){
        setTimeout(_ajaxUpload_complete, 500);
    }
    var _ajaxUpload_success = function(e, data, textStatus, jqXHR){
        setTimeout(_ajaxUpload_complete, 500);
        for(var i=0;i<_value.length;i++){
            if(data[_upload.id]){
                _value[i].url = data[_upload.id][i].url;
            }
        }
    }
    var _ajaxUpload_progress = function(e, xhrProgressEvt){
        _progressBar.valueNow = xhrProgressEvt.percentage;
    }
    var _ajaxUpload_started = function(e){
        if(_showProgress){
             var classes = _progressRow.classes.slice(0);
            classes.splice(classes.indexOf("d-none"),1);
            _progressBar.valueNow = 0;
            _progressRow.classes = classes; 
        } 
    }
    var _ajaxUpload_complete = function(e){
        if(_showProgress){
            var classes = _progressRow.classes.slice(0);
            classes.pushUnique("d-none");
            _progressRow.classes = classes; 
        }
    }

    var downloadBtn_click = function(){
        _self.ajaxDownload();
    }

    var removeBtn_click = function(){
        this.value = null;
    }

    var _container;
    
    var fnContainerDelayInit = whenDefined(this, "guid", function(){
        _container = {
            constructor: Container,
            props: {
                id: "main_"+_self.guid,
                guid: _self.guid,
                type: ContainerType.NONE,
                afterAttach: _registerSurrogate,
                //width:,
                components:[
                    {
                        constructor: Container,
                        props: {
                            id: "mainRow_"+_self.guid,
                            type: ContainerType.ROW,
                            height: 30,
                            components:[
                                {
                                    constructor: Container,
                                    props: {
                                        id: "iconColumn_"+_self.guid,
                                        type: ContainerType.COLUMN,
                                        spacing: {colSpan:1,pr:0, pl:5},
                                        classes:["border"],
                                        components:[
                                            {
                                                constructor: Label,
                                                props: {
                                                    id: "iconLbl_"+_self.guid,
                                                    labelType: LabelType.i
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    constructor: Container,
                                    props: {
                                        id: "fileNameColumn_"+_self.guid,
                                        type: ContainerType.COLUMN,
                                        spacing: {colSpan:7},
                                        classes:["border"],
                                        components:[
                                            {
                                                constructor: Label,
                                                props: {
                                                    id: "fileName_"+_self.guid,
                                                    label:"No file selected."
                                                }
                                            },
                                            {
                                                constructor: Upload,
                                                props: {
                                                    id: "uploadInput_"+_self.guid,
                                                    classes:["d-none"],
                                                    change: upload_change
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    constructor: Container,
                                    props: {
                                        id: "fileSizeColumn_"+_self.guid,
                                        type: ContainerType.COLUMN,
                                        spacing: {colSpan:1},
                                        classes:["border"],
                                        components:[
                                            {
                                                constructor: Label,
                                                props: {
                                                    id: "fileSize_"+_self.guid,
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    constructor: Container,
                                    props: {
                                        id: "controlsColumn_"+_self.guid,
                                        type: ContainerType.COLUMN,
                                        spacing: {colSpan:3,pl:0},
                                        classes:["border"],
                                        components:[
                                            {
                                            constructor: Container,
                                                props: {
                                                    spacing: {h:100, ml:0},
                                                    id: "controlsCont_"+_self.guid,
                                                    width:150,
                                                    classes:["border"],
                                                    components:[
                                                        {
                                                            constructor: Container,
                                                            props: {
                                                                id: "controlsRow_"+_self.guid,
                                                                type: ContainerType.ROW,
                                                                spacing: {h:10},
                                                                components:[
                                                                    {
                                                                        constructor: Container,
                                                                        props: {
                                                                            id: "selectColumn_"+_self.guid,
                                                                            type: ContainerType.COLUMN,
                                                                            spacing: {colSpan:3,pl:0},
                                                                            classes:["border"],
                                                                            components:[
                                                                                {
                                                                                    constructor: Button,
                                                                                    props: {
                                                                                        id: "selectBtn_"+_self.guid,
                                                                                        type: "button",
                                                                                        components: [{
                                                                                            constructor: Label,
                                                                                            props: {
                                                                                                id: 'fa',
                                                                                                labelType: LabelType.i,
                                                                                                classes: ["fas","fa-folder-open"]
                                                                                            }
                                                                                        }],
                                                                                        click: selectBtn_click
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    },
                                                                    {
                                                                        constructor: Container,
                                                                        props: {
                                                                            id: "uploadColumn_"+_self.guid,
                                                                            type: ContainerType.COLUMN,
                                                                            spacing: {colSpan:3,pl:0},
                                                                            classes:["border"],
                                                                            components:[
                                                                                {
                                                                                    constructor: Button,
                                                                                    props: {
                                                                                        id: "uploadBtn_"+_self.guid,
                                                                                        type: "button",
                                                                                        enabled:false,
                                                                                        components: [{
                                                                                            constructor: Label,
                                                                                            props: {
                                                                                                id: 'fa',
                                                                                                labelType: LabelType.i,
                                                                                                classes: ["fas","fa-cloud-upload-alt"]
                                                                                            }
                                                                                        }],
                                                                                        click: uploadBtn_click
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    },
                                                                    {
                                                                        constructor: Container,
                                                                        props: {
                                                                            id: "downloadColumn_"+_self.guid,
                                                                            type: ContainerType.COLUMN,
                                                                            spacing: {colSpan:3,pl:0},
                                                                            classes:["border"],
                                                                            components:[
                                                                                {
                                                                                    constructor: Button,
                                                                                    props: {
                                                                                        id: "downloadBtn_"+_self.guid,
                                                                                        type: "button",
                                                                                        enabled:false,
                                                                                        components: [{
                                                                                            constructor: Label,
                                                                                            props: {
                                                                                                id: 'fa',
                                                                                                labelType: LabelType.i,
                                                                                                classes: ["fas","fa-cloud-download-alt"]
                                                                                            }
                                                                                        }],
                                                                                        click: downloadBtn_click
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    },
                                                                    {
                                                                        constructor: Container,
                                                                        props: {
                                                                            id: "removeColumn_"+_self.guid,
                                                                            type: ContainerType.COLUMN,
                                                                            spacing: {colSpan:3,pl:0},
                                                                            classes:["border"],
                                                                            components:[
                                                                                {
                                                                                    constructor: Button,
                                                                                    props: {
                                                                                        id: "removeBtn_"+_self.guid,
                                                                                        type: "button",
                                                                                        enabled:false,
                                                                                        components: [{
                                                                                            constructor: Label,
                                                                                            props: {
                                                                                                id: 'fa',
                                                                                                labelType: LabelType.i,
                                                                                                classes: ["fas","fa-trash"]
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
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        constructor: Container,
                        props: {
                            id: "progressRow_"+_self.guid,
                            type: ContainerType.ROW,
                            height: 5,
                            classes:["d-none"],
                            components:[
                                {
                                    constructor: Container,
                                    props: {
                                        id: "progressColumn_"+_self.guid,
                                        type: ContainerType.COLUMN,
                                        spacing: {colSpan:12,pl:0},
                                        classes:["border", "progress"],
                                        height: 5,
                                        components:[
                                            {
                                                constructor: ProgressBar,
                                                props: {
                                                    id:"progressbar_"+_self.guid,
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
                            ]
                        }
                    }
                ]                                   
            }
        };
    });

    Object.defineProperty(this, "multiple", 
    {
        get: function multiple() 
        {
            return _multiple;
        },
        set: function multiple(v) 
        {
            if(_multiple != v)
            {  
                var fn = whenDefined(_upload, "multiple", function(){
                    _upload.multiple = _multiple = v;
                });
                fn();
            }
        }
    });
    Object.defineProperty(this, "accept", 
    {
        get: function accept() 
        {
            return _accept;
        },
        set: function accept(v) 
        {
            if(_accept != v)
            {  
                var fn = whenDefined(_upload, "accept", function(){
                    _upload.accept = _accept = v;
                });
                fn();
            }
        }
    });

    Object.defineProperty(this, "showBtnRemove", 
    {
        get: function showBtnRemove() 
        {
            return _showBtnRemove;
        },
        set: function showBtnRemove(v) 
        {
            if(_showBtnRemove != v)
            {  
                var fn = whenDefined(_btnRemove, "id", function(){
                    if(v){
                        var classes = _btnRemove.classes.slice(0);
                        classes = classes.splice(classes.indexOf("d-none"),1);
                        _btnRemove.classes = classes;  

                        classes = _removeColumn.classes.slice(0);
                        classes = classes.splice(classes.indexOf("d-none"),1);
                        _removeColumn.classes = classes; 
                    }else{
                        var classes = _btnRemove.classes.slice(0);
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

    Object.defineProperty(this, "showProgress", 
    {
        get: function showProgress() 
        {
            return _showProgress;
        },
        set: function showProgress(v) 
        {
            if(_showProgress != v)
            {  
                _showProgress = v;
                if(!_showProgress){
                    var classes = _progressRow.classes.slice(0);
                    classes.pushUnique("d-none");
                    _progressRow.classes = classes; 
                }
            }
        }
    });

    Object.defineProperty(this, "upload", 
    {
        get: function upload() 
        {
            return _upload;
        }
    });

    Object.defineProperty(this, "value",
    {
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
    var _setValue = function(v){
        if (v) {
            if(!Array.isArray(v) && !BinUtils.isFileList(v))
                _value = _upload.files = [v];
            else{
                if(BinUtils.isFileList(v)){
                    v = Array.fromIterator(v);
                }
                _value = _upload.files = v;
            }
            init(_value);
        } else {
            init([{url:"", name:"", size:"", type:""}]);
            _upload.reset();
        }
    }

    this.template = function () { 
        fnContainerDelayInit();
        _container.props.ownerDocument = this.ownerDocument;
        _cmp = Component.fromLiteral(_container);
        _upload = _cmp.children[this.my("mainRow")].children[this.my("fileNameColumn")].children[this.my("uploadInput")];
        _iconLbl = _cmp.children[this.my("mainRow")].children[this.my("iconColumn")].children[this.my("iconLbl")];
        _progressRow = _cmp.children[this.my("progressRow")];
        _progressBar = _cmp.children[this.my("progressRow")].children[this.my("progressColumn")].children[this.my("progressbar")];  

        _lblFileName = _cmp.children[this.my("mainRow")].children[this.my("fileNameColumn")].children[this.my("fileName")];
        _lblFileSize = _cmp.children[this.my("mainRow")].children[this.my("fileSizeColumn")].children[this.my("fileSize")];
        _btnSelect = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("selectColumn")].children[this.my("selectBtn")];
        _btnUpload = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("uploadColumn")].children[this.my("uploadBtn")];
        _btnDownload = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("downloadColumn")].children[this.my("downloadBtn")];
        _btnRemove = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("removeColumn")].children[this.my("removeBtn")];
        _removeColumn = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("removeColumn")];
        this.$el = _cmp.$el;
        return null;
    };

    var _registerSurrogate = function(e){
         //init events for this surrogate component.
        _self.initEvents(this.$el, 0);
    }

    var _defaultParams = {
        multiple: true,
        value: [],
        form: null,
        showProgress: true
    };

    var _multiple, _accept, _showBtnRemove, _form, _value, _showProgress;

    _props = extend(false, false, _defaultParams, _props);
    _showProgress = _props.showProgress;

    Component.call(this, _props, false, true);

    if(_props.multiple!=null)
        this.multiple = _props.multiple;
    if(_props.accept)
        this.accept = _props.accept;  
    if(_props.showBtnRemove!=null)
        this.showBtnRemove = _props.showBtnRemove;
    if(_props.value!=null)
        _setValue(_props.value);
        
    _form = _props.form;
};
UploadEx.prototype.ctor = 'UploadEx';