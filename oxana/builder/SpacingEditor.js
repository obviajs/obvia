/**
 * This is a SpacingEditor Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var SpacingEditor = function (_props, overrided = false) {
    var _self = this;
 
    var _dpColSpan = SpacingEditor.dpColSpan;
    var _dpOffset = SpacingEditor.dpOffset;
    var _dpMt = SpacingEditor.dpMt;
    var _dpMb = SpacingEditor.dpMb;
    var _initDP = function()
    {
        if(!SpacingEditor.init){
            for(let i=0;i<12;i++){
                _dpColSpan[i] = {value:i+1, label:"col-"+(i+1)};
                _dpOffset[i] = {value:i, label:"offset-"+i};
                if(i<6){
                    _dpMt[i] = {value:i, label:"mt-"+i};
                    _dpMb[i] = {value:i, label:"mb-"+i};
                } 
            }
            SpacingEditor.init = true;
        }
    }
    
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            _initDP();
            this.$container = this.$el;
            fnContainerDelayInit();
            this.components = _cmps;
            this.addComponents();
            _colSpan = this.children[this.components[0].props.id].children[this.components[0].props.components[0].props.id].children[this.my("colSpan")];
            _offset = this.children[this.components[0].props.id].children[this.components[0].props.components[1].props.id].children[this.my("offset")];
            _mb = this.children[this.components[1].props.id].children[this.components[1].props.components[0].props.id].children[this.my("mb")];
            _mt = this.children[this.components[1].props.id].children[this.components[1].props.components[1].props.id].children[this.my("mt")];
            if(_props.value){
                this.value = _props.value;
            }
            e.preventDefault();
        }
    }
    let _cmps, _colSpan, _offset, _mb, _mt;
    var fnContainerDelayInit = function(){
        _cmps = 
        [
            {
                ctor: "Container",
                "props": {
                    "type": "row",
                    spacing:{mb:1},
                    "components": [
                        {
                            ctor: "Container",
                            "props": {
                                "id": "workArea_80",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        ctor: "Select",
                                        "props": {
                                            "id": "colSpan_"+_self.guid,
                                            "dataProvider": _dpColSpan,
                                            labelField:"label",
                                            valueField:"value"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            ctor: "Container",
                            "props": {
                                "id": "workArea_84",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        ctor: "Select",
                                        "props": {
                                            "id": "offset_"+_self.guid,
                                            "dataProvider": _dpOffset,
                                            labelField:"label",
                                            valueField:"value"
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "Component_79"
                }
            },
            {
                ctor: "Container",
                "props": {
                    "type": "row",
                    "components": [
                        {
                            ctor: "Container",
                            "props": {
                                "id": "workArea_82",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        ctor: "Select",
                                        "props": {
                                            "id": "mb_"+_self.guid,
                                            "dataProvider": _dpMb,
                                            labelField:"label",
                                            valueField:"value"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            ctor: "Container",
                            "props": {
                                "id": "workArea_86",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        ctor: "Select",
                                        "props": {
                                            "id": "mt_"+_self.guid,
                                            "dataProvider": _dpMt,
                                            labelField:"label",
                                            valueField:"value"
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "Component_81"
                }
            }
        ];
    };
    var _defaultParams = {
        type: ContainerType.NONE,
        "components": []
    };
    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props);
    let _value;

    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if(v.colSpan)
                    _colSpan.value = v.colSpan;
                if(v.offset)
                    _offset.value = v.offset;
                if(v.mb)
                    _mb.value = v.mb;
                if(v.mt)
                    _mt.value = v.mt;
                this.trigger('change');
            }
        },
        enumerable:true
    });
};

//component prototype
SpacingEditor.prototype.ctor = 'SpacingEditor';
SpacingEditor.init = false;
SpacingEditor.dpColSpan = new Array(12);
SpacingEditor.dpOffset = new Array(12);
SpacingEditor.dpMt = new Array(6);
SpacingEditor.dpMb = new Array(6);

