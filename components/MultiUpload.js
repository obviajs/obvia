/**
 * This is an MultiUpload Element
 *
 * Kreatx 2019
 */

var MultiUpload = function (_props, overrided = false) {
    var _self = this;
    var _cmp, _lblDrop, _dropContainer, _listRepeater;
    var _dataProvider = new ArrayEx([]);
    var _container;

    var fnContainerDelayInit = whenDefined(this, "guid", function(){
        _container = { 
            constructor: Container,
            props: {
                type: ContainerType.NONE,
                id: _self.id,
                guid: _self.guid,
                components: [
                    {
                        constructor: Repeater,
                        props: {
                            id: "listRepeater_"+_self.guid,
                            rendering: {
                                direction: "vertical",
                                separator: false
                            },
                            dataProvider: _dataProvider,
                            components: [
                                {
                                    constructor: UploadEx,
                                    props: {
                                        id: "upload_"+_self.guid,
                                        change: _upload_change,
                                        form: _form,
                                        value: "{currentItem}"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        constructor: Container,
                        props: {
                            id: "dropContainer_"+_self.guid,
                            type: ContainerType.NONE,
                            width: "100%",
                            height: 50,
                            classes: ["rounded-lg", "border"],
                            components:[
                                {
                                    constructor: Label,
                                    props: {
                                        id: "label_"+_self.guid,
                                        label: 'Drag and Drop File or Click Me',
                                        classes: ["text-center"],
                                        labelType: LabelType.paragraph
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };
    });

    this.template = function () { 
        fnContainerDelayInit();
        _cmp = Component.fromLiteral(_container);
        
        _lblDrop = _cmp.children[this.my("dropContainer")].children[this.my("label")];
        _dropContainer = _cmp.children[this.my("dropContainer")];
        _listRepeater = _cmp.children[this.my("listRepeater")];

        _cmp.on("creationComplete", function(){
            $("html").on("dragover", _htmlDragOverHandler); 
            $("html").on("drop", _htmlDropHandler);
            $("html").on("dragleave", _htmlDragLeaveHandler);
            _dropContainer.on('dragenter', _dragEnterHandler);
            _dropContainer.on('dragover', _dragOverHandler);
            _dropContainer.on('drop', _dropHandler);
            _dropContainer.on('dragleave', _dragLeaveHandler);
            _lblDrop.on('click', _clickHandler);
                
        });
       
        this.$el = _cmp.$el;
        return null;
    };
    //TODO: on dp change set binding for show/hide trash icon

    var _htmlDragOverHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drag here";
    }

    var _htmlDropHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drag and Drop File or Click Me";
    }
    var _htmlDragLeaveHandler = function(e){
        _lblDrop.label = "Drag and Drop File or Click Me";
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
    var _files = [];

    var _dropHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        _lblDrop.label = "Drag and Drop File or Click Me";
        _files.splicea(_files.length, 0, Array.fromIterator(e.originalEvent.dataTransfer.files));

        for(var n=0;n<e.originalEvent.dataTransfer.files.length;n++)
        {
            var len = _listRepeater[_self.my("upload")] ? _listRepeater[_self.my("upload")].length : 0;
            var allUsed = true;
            for(var i=0;i<len && allUsed;i++){
                var rowUpl = _listRepeater[_self.my("upload")][i];
                if(rowUpl.upload.files.length==0){
                    allUsed = false;
                    rowUpl.upload.fileDialog();
                }
            }
            if(allUsed){
                _listRepeater.dataProvider.push(e.originalEvent.dataTransfer.files[n]);
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
            var len = _listRepeater[_self.my("upload")].length;
            var rowUpl = _listRepeater[_self.my("upload")][len-1];
            rowUpl.upload.fileDialog();
        };

        var len = _listRepeater[_self.my("upload")] ? _listRepeater[_self.my("upload")].length : 0;
        var allUsed = true;
        for(var i=0;i<len && allUsed;i++){
            var rowUpl = _listRepeater[_self.my("upload")][i];
            if(rowUpl.upload.files.length==0){
                allUsed = false;
                rowUpl.upload.fileDialog();
            }
        }
        if(allUsed){
            _listRepeater.on("onRowAdd", fnUplRowAdded);
            _listRepeater.dataProvider.push({});
        }
    }
    
    var _upload_change = function(e){
        console.log("UPL CHANGE: ", arguments);
        _files.splicea(_files.length, 0, Array.fromIterator(e.target.files));
    }

    var _defaultParams = {
        multiple: false,
        showBtnRemove: false,
        dataProvider: [],
        form: null
    };

    var _multiple, _accept, _showBtnRemove, _form;

    _props = extend(false, false, _defaultParams, _props);
    
    this.beforeAttach = function() {
        this.initEvents(this.$el, 0);
    }
    _form = _props.form;
    Component.call(this, _props, true);

    if(_props.multiple)
        this.multiple = _props.multiple;
    if(_props.accept)
        this.accept = _props.accept;  
    if(_props.showBtnRemove!=null)
        this.showBtnRemove = _props.showBtnRemove;
   
    
    var base = this.base;
    this.destruct = function (mode=1)
    {
        $("html").off("dragover", _htmlDragOverHandler);  
        $("html").off("drop", _htmlDropHandler);
        $("html").off("dragleave", _htmlDragLeaveHandler);

        _dropContainer.off('dragenter', _dragEnterHandler);
        _dropContainer.off('dragover', _dragOverHandler);
        _dropContainer.off('drop', _dropHandler);
        _dropContainer.off('dragleave', _dragLeaveHandler);
        _lblDrop.off('click', _clickHandler);
        base.destruct(mode);
    }

    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _files;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                _dataProvider = v;
            }
        }
    });
};

MultiUpload.prototype.ctor = 'MultiUpload';