/**
 * This is a Spacing Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var SpacingEditor = function (_props, overrided = false) {
    var _self = this;
 
    var _dpColSpan = new Array(12);
    var _dpOffset = new Array(12);
    var _dpMt = new Array(6);
    var _dpMb = new Array(6);
    
    for(let i=0;i<12;i++){
        _dpColSpan[i] = {value:i+1, label:"col-"+(i+1)};
        _dpOffset[i] = {value:i, label:"offset-"+i};
        if(i<6){
            _dpMt[i] = {value:i, label:"mt-"+i};
            _dpMb[i] = {value:i, label:"mb-"+i};
        } 
    }

    var _defaultParams = {
        type: ContainerType.NONE,
        "components": [
            {
                "constructor": "Container",
                "props": {
                    "type": "row",
                    spacing:{mb:1},
                    "components": [
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_80",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "colSpan",
                                            "dataProvider": _dpColSpan,
                                            labelField:"label",
                                            valueField:"value"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_84",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "offset",
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
                "constructor": "Container",
                "props": {
                    "type": "row",
                    "components": [
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_82",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "mb",
                                            "dataProvider": _dpMb,
                                            labelField:"label",
                                            valueField:"value"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_86",
                                type: ContainerType.COLUMN,
                                spacing:{colSpan:6},
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "mt",
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
        ]
    };
    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props);
};

//component prototype
SpacingEditor.prototype.ctor = 'SpacingEditor';

