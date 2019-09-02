/**
 * This is a Spacing Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var SpacingEditor = function (_props, overrided = false) {
    var _self = this;
 
    var dpColSpan;
    var dpOffset;




   


    var _defaultParams = {
        "components": [
            {
                "constructor": "Container",
                "props": {
                    "type": "row",
                    "components": [
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_80",
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "colSpan",
                                            "dataProvider": dpColSpan
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_84",
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "offset",
                                            "dataProvider": dpOffset
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
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "select_101",
                                            "dataProvider": [
                                                {
                                                    "value": "1",
                                                    "text": "Shqiperi"
                                                },
                                                {
                                                    "value": "2",
                                                    "text": "Greqi"
                                                },
                                                {
                                                    "value": "3",
                                                    "text": "SHBA"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "constructor": "Container",
                            "props": {
                                "id": "workArea_86",
                                "components": [
                                    {
                                        "constructor": "Select",
                                        "props": {
                                            "id": "select_96",
                                            "dataProvider": [
                                                {
                                                    "value": "1",
                                                    "text": "Shqiperi"
                                                },
                                                {
                                                    "value": "2",
                                                    "text": "Greqi"
                                                },
                                                {
                                                    "value": "3",
                                                    "text": "SHBA"
                                                }
                                            ]
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

