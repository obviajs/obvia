/**
 * This is a SingleUpload Element
 *
 * Kreatx 2019
 */

var SingleUpload = function (_props, overrided = false) {
    var _self = this;
    var _cmp;
    var _upload, _lblFileName;

    var upload_change = function(e){
        console.log("File(s) selected");
        var arr = [];
        for(var i=0;i<e.target.files.length;i++){
            arr.push(e.target.files[i].name);
        }
        _lblFileName.label = arr.join(",");
        //e.target.files[0].name
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

    var _container = {
        constructor: Container,
        props: {
            id: "mainContainer",
            type: ContainerType.NONE,
            //width:,
            components:[
                {
                    constructor: Container,
                    props: {
                        id: "mainRow",
                        type: ContainerType.ROW,
                        height: 30,
                        components:[
                            {
                                constructor: Container,
                                props: {
                                    id: 'fileNameColumn',
                                    type: ContainerType.COLUMN,
                                    spacing: {colSpan:9},
                                    classes:["border"],
                                    components:[
                                        {
                                            constructor: Label,
                                            props: {
                                                id: 'fileName',
                                                label:"filename.jpg"
                                            }
                                        },
                                        {
                                            constructor: Upload,
                                            props: {
                                                id: 'uploadInput',
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
                                    id: 'controlsColumn',
                                    type: ContainerType.COLUMN,
                                    spacing: {colSpan:3,pl:0},
                                    classes:["border"],
                                    components:[
                                        {
                                        constructor: Container,
                                            props: {
                                                spacing: {h:100},
                                                id: 'controlsCont',
                                                components:[
                                                    {
                                                        constructor: Container,
                                                        props: {
                                                            id: 'controlsRow',
                                                            type: ContainerType.ROW,
                                                            spacing: {h:10},
                                                            components:[
                                                                {
                                                                    constructor: Container,
                                                                    props: {
                                                                        id: 'selectColumn',
                                                                        type: ContainerType.COLUMN,
                                                                        spacing: {colSpan:3,pl:0},
                                                                        classes:["border"],
                                                                        components:[
                                                                            {
                                                                                constructor: Button,
                                                                                props: {
                                                                                    id: 'selectBtn',
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
                                                                        id: 'uploadColumn',
                                                                        type: ContainerType.COLUMN,
                                                                        spacing: {colSpan:3,pl:0},
                                                                        classes:["border"],
                                                                        components:[
                                                                            {
                                                                                constructor: Button,
                                                                                props: {
                                                                                    id: 'uploadBtn',
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
                                                                        id: 'downloadColumn',
                                                                        type: ContainerType.COLUMN,
                                                                        spacing: {colSpan:3,pl:0},
                                                                        classes:["border"],
                                                                        components:[
                                                                            {
                                                                                constructor: Button,
                                                                                props: {
                                                                                    id: 'downloadBtn',
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
                                                                        id: 'removeColumn',
                                                                        type: ContainerType.COLUMN,
                                                                        spacing: {colSpan:3,pl:0},
                                                                        classes:["border"],
                                                                        components:[
                                                                            {
                                                                                constructor: Button,
                                                                                props: {
                                                                                    id: 'removeBtn',
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
                        id: "progressRow",
                        type: ContainerType.ROW,
                        height: 5,
                        classes:["d-none"],
                        components:[
                            {
                                constructor: Container,
                                props: {
                                    id: 'progressColumn',
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
                whenDefined(_upload, "multiple", function(){
                    _upload.multiple = _multiple = v;
                });
                
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
                whenDefined(_upload, "accept", function(){
                    _upload.accept = _accept = v;
                });
            }
        }
    });

    this.template = function () { 
        _cmp = Component.fromLiteral(_container);
        _upload = _cmp.children["mainRow"].children["fileNameColumn"].children["uploadInput"];
        _lblFileName = _cmp.children["mainRow"].children["fileNameColumn"].children["fileName"];
        
        this.$el = _cmp.$el;
        return null;
    };

    var _defaultParams = {
        multiple: false,
        dataProvider: [],
        valueField: "id",
        value: [],
    };
    var _multiple;
    var _accept;

    _props = extend(false, false, _defaultParams, _props);

    Component.call(this, _props);

    if(_props.multiple)
        this.multiple = _props.multiple;
    if(_props.accept)
        this.accept = _props.accept;  

    this.render = function () {
        return this.$el;
    };
};

SingleUpload.prototype.ctor = 'SingleUpload';