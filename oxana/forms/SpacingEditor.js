/**
 * This is a SpacingEditor Definition Element
 * 
 * Kreatx 2018
 */
import {Container} from "/flowerui/components/Container.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var SpacingEditor = function (_props) {
    var _self = this;
    let _value;
 
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
    
    this.endDraw = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            _colSpan = this.Component_79.workArea_80.colSpan;
            _offset = this.Component_79.workArea_84.offset;
            _mb = this.Component_81.workArea_82.mb;
            _mt = this.Component_81.workArea_86.mt;
            if(_props.value){
                this.value = _props.value;
            }
            e.preventDefault();
        }
    }
    let _cmps, _colSpan, _offset, _mb, _mt;

    let changColSpan = function(){
       _value.colSpan = this.value;
    }
    let changeOffset = function(){
        _value.offset = this.value;
    }
    let changeMB = function(){
        _value.mb = this.value;
    }
    let changeMt = function(){
        _value.mt = this.value;
    }
    
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
                                            "id": "colSpan",
                                            "dataProvider": _dpColSpan,
                                            labelField:"label",
                                            valueField:"value",
                                            change: changColSpan
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
                                            "id": "offset",
                                            "dataProvider": _dpOffset,
                                            labelField:"label",
                                            valueField:"value",
                                            change: changeOffset
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
                                            "id": "mb",
                                            "dataProvider": _dpMb,
                                            labelField:"label",
                                            valueField:"value",
                                            change: changeMB
                                    
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
                                            "id": "mt",
                                            "dataProvider": _dpMt,
                                            labelField:"label",
                                            valueField:"value", 
                                            change: changeMt
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
    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _initDP();
    fnContainerDelayInit();
    _props.components = _cmps;
            
    Container.call(this, _props);
    
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
