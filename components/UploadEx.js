/**
 * This is an UploadEx Element
 *
 * Kreatx 2019
 */

var UploadEx = function (_props, overrided = false) {
    var _self = this;
    var _cmp;
    var _upload, _lblFileName, _btnRemove, _removeColumn, _iconLbl, _lblFileSize;
    var _lastFileTypeIcon;
    var upload_change = function(e){

        var classes = _iconLbl.classes.slice(0);
        if(_lastFileTypeIcon)
            classes = classes.splice(classes.indexOf(_lastFileTypeIcon),1);
        classes.pushUnique("fas");
        classes.pushUnique("fa-lg");
        classes.pushUnique("align-middle");
        classes.pushUnique(getFontAwesomeIconFromMIME(e.target.files[0].type));
        _iconLbl.classes = classes; 
        
        console.log("File(s) selected, type: "+e.target.files[0].type+" "+getFontAwesomeIconFromMIME(e.target.files[0].type));
        var arr = [];
        for(var i=0;i<e.target.files.length;i++){
            arr.push(e.target.files[i].name);
        }
        _lblFileName.label = arr.join(",");
        _self.$el.trigger(e);
        //e.target.files[0].name
        _lastFileTypeIcon = getFontAwesomeIconFromMIME(e.target.files[0].type);
        
        _lblFileSize.label = formatBytes(e.target.files[0].size);
    }
    
    var selectBtn_click = function(){
        _upload.fileDialog();
        console.log("selectBtn_click");
    }

    var uploadBtn_click = function(){

    }

    var downloadBtn_click = function(){

    }


    var removeBtn_click = function(){

    }

    var _container;
    
    var fnContainerDelayInit = whenDefined(this, "guid", function(){
        _container = {
            constructor: Container,
            props: {
                id: _self.id,
                guid: _self.guid,
                type: ContainerType.NONE,
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
                                                    label:"filename.jpg"
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
                                        classes:["border"],
                                        components:[]
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

    Object.defineProperty(this, "upload", 
    {
        get: function upload() 
        {
            return _upload;
        }
    });
    
    this.template = function () { 
        fnContainerDelayInit();
        _cmp = Component.fromLiteral(_container);
        _upload = _cmp.children[this.my("mainRow")].children[this.my("fileNameColumn")].children[this.my("uploadInput")];
        _iconLbl = _cmp.children[this.my("mainRow")].children[this.my("iconColumn")].children[this.my("iconLbl")];

        _lblFileName = _cmp.children[this.my("mainRow")].children[this.my("fileNameColumn")].children[this.my("fileName")];
        _lblFileSize = _cmp.children[this.my("mainRow")].children[this.my("fileSizeColumn")].children[this.my("fileSize")];
       
        _btnRemove = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("removeColumn")].children[this.my("removeBtn")];
        _removeColumn = _cmp.children[this.my("mainRow")].children[this.my("controlsColumn")].children[this.my("controlsCont")].children[this.my("controlsRow")].children[this.my("removeColumn")];
        this.$el = _cmp.$el;
        return null;
    };

    var _defaultParams = {
        multiple: false,
        showBtnRemove: false,
        dataProvider: [],
        valueField: "id",
        value: [],

    };

    var _multiple, _accept, _showBtnRemove;

    _props = extend(false, false, _defaultParams, _props);

    this.beforeAttach = function() {
        this.initEvents(this.$el, 0);
    }

    Component.call(this, _props);

    if(_props.multiple)
        this.multiple = _props.multiple;
    if(_props.accept)
        this.accept = _props.accept;  
    if(_props.showBtnRemove!=null)
        this.showBtnRemove = _props.showBtnRemove;

    this.render = function () {
        return this.$el;
    };
    
};

UploadEx.prototype.ctor = 'UploadEx';