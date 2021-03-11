var myForm = new Container(
    {
        "id": "form",
        "components": [
            {
                "ctor": "Container",
                "props": {
                    "id": "form",
                    "components": [{
                            "ctor": "Container",
                            "props": {
                                "type": "row",
                                "components": [{
                                    "ctor": "Container",
                                    "props": {
                                        "type": "",
                                        "classes": ["col"],
                                        "components": [{
                                            "ctor": "Label",
                                            "props": {
                                                "label": "Te dhena te pergjithshme",
                                                "labelType": "label",
                                                "components": [],
                                                "sortChildren": false,
                                                "guid": "3d85b545-1ce1-4a97-afcd-1a3b45D75908",
                                                "id": "label",
                                                "index": 0,
                                                "spacing": {
                                                    "mt": "3"
                                                },
                                                "attr": {
                                                    "isCmp": true
                                                },
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "draggable": true,
                                                "classes": ["font-weight-bold"]
                                            }
                                        }]
                                    }
                                }]
                            }
                        },
                        {
                            "ctor": "Container",
                            "props": {
                                "type": "row",
                                "components": [{
                                        "ctor": "Container",
                                        "props": {
                                            "type": "",
                                            "classes": ["col"],
                                            "components": [{
                                                "ctor": "FormField",
                                                "props": {
                                                    "component": {
                                                        "ctor": "TextInput",
                                                        "props": {
                                                            "value": "",
                                                            "type": "text",
                                                            "autocomplete": "off",
                                                            "components": [],
                                                            "sortChildren": false,
                                                            "guid": "de334b4e-632c-491a-835a-7b0c13674867",
                                                            "id": "title",
                                                            "index": 0,
                                                            "spacing": {},
                                                            "css": {},
                                                            "visible": true,
                                                            "enabled": true,
                                                            "classes": []
                                                        }
                                                    },
                                                    "label": "Titulli",
                                                    "width": "100%",
                                                    "sortChildren": false,
                                                    "guid": "b265f5af-fb1c-400e-89e7-b152d48376d0",
                                                    "id": "f_title",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "attr": {
                                                        "isCmp": true
                                                    },
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "draggable": true,
                                                    "classes": [],
                                                    "placeholder": "Titulli"
                                                }
                                            }, {
                                                "ctor": "RequiredFieldValidator",
                                                "props": {
                                                    "controlToValidate": "title",
                                                    "errorMessage": "Ju lutem plotesoni kete fushe.",
                                                    "validationGroup": "grp"
                                                }
                                            }]
                                        }
                                    },
                                    {
                                        "ctor": "Container",
                                        "props": {
                                            "type": "",
                                            "classes": ["col"],
                                            "components": [{
                                                "ctor": "FormField",
                                                "props": {
                                                    "component": {
                                                        "ctor": "DateTime",
                                                        "props": {
                                                            "value": "",
                                                            "type": "text",
                                                            "autocomplete": "off",
                                                            "components": [],
                                                            "sortChildren": false,
                                                            "guid": "1c67112e-0149-4619-a54e-a66f3ed2a2e2",
                                                            "id": "startDate",
                                                            "index": 0,
                                                            "spacing": {},
                                                            "css": {},
                                                            "visible": true,
                                                            "enabled": true,
                                                            "classes": []
                                                        }
                                                    },
                                                    "label": "Data e hapjes se procesit",
                                                    "width": "100%",
                                                    "sortChildren": false,
                                                    "guid": "593d7d59-4d03-4055-a97c-b98214a20ae2",
                                                    "id": "f_startDate",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "attr": {
                                                        "isCmp": true
                                                    },
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "draggable": true,
                                                    "classes": [],
                                                    "placeholder": "Data e hapjes se procesit"
                                                }
                                            }, {
                                                "ctor": "RequiredFieldValidator",
                                                "props": {
                                                    "controlToValidate": "startDate",
                                                    "errorMessage": "Ju lutem plotesoni kete fushe.",
                                                    "validationGroup": "grp"
                                                }
                                            }]
                                        }
                                    },
                                    {
                                        "ctor": "Container",
                                        "props": {
                                            "type": "",
                                            "classes": ["col"],
                                            "components": [{
                                                "ctor": "FormField",
                                                "props": {
                                                    "component": {
                                                        "ctor": "TextInput",
                                                        "props": {
                                                            "value": "",
                                                            "type": "text",
                                                            "autocomplete": "off",
                                                            "components": [],
                                                            "sortChildren": false,
                                                            "guid": "78d29e33-ce9e-4d91-9f95-ec6b4e3e83db",
                                                            "id": "startDateOffer",
                                                            "index": 0,
                                                            "spacing": {},
                                                            "css": {},
                                                            "visible": true,
                                                            "enabled": true,
                                                            "classes": []
                                                        }
                                                    },
                                                    "label": "Data e hapjes se pranimit te ofertave",
                                                    "width": "100%",
                                                    "sortChildren": false,
                                                    "guid": "cb0f257b-184d-4742-8c22-0059708ad81c",
                                                    "id": "f_startDateOffer",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "attr": {
                                                        "isCmp": true
                                                    },
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "draggable": true,
                                                    "classes": [],
                                                    "placeholder": "Data e hapjes se pranimit te ofertave"
                                                }
                                            }, {
                                                "ctor": "RequiredFieldValidator",
                                                "props": {
                                                    "controlToValidate": "startDateOffer",
                                                    "errorMessage": "Ju lutem plotesoni kete fushe.",
                                                    "validationGroup": "grp"
                                                }
                                            }]
                                        }
                                    },
                                    {
                                        "ctor": "Container",
                                        "props": {
                                            "type": "",
                                            "classes": ["col"],
                                            "components": [{
                                                    "ctor": "FormField",
                                                    "props": {
                                                        "component": {
                                                            "ctor": "DateTime",
                                                            "props": {
                                                                "value": "",
                                                                "type": "text",
                                                                "autocomplete": "off",
                                                                "components": [],
                                                                "sortChildren": false,
                                                                "guid": "bd0a3cc9-4e44-4b5e-ba52-277d7d35d84a",
                                                                "id": "endDateOffer",
                                                                "index": 0,
                                                                "spacing": {},
                                                                "css": {},
                                                                "visible": true,
                                                                "enabled": true,
                                                                "classes": []
                                                            }
                                                        },
                                                        "label": "Data e mbylljes se pranimit te ofertave",
                                                        "width": "100%",
                                                        "sortChildren": false,
                                                        "guid": "5f289f2a-f440-4e19-a0b7-4f950db6d67f",
                                                        "id": "f_endDateOffer",
                                                        "index": 0,
                                                        "spacing": {},
                                                        "attr": {
                                                            "isCmp": true
                                                        },
                                                        "css": {},
                                                        "visible": true,
                                                        "enabled": true,
                                                        "draggable": true,
                                                        "classes": [],
                                                        "placeholder": "Data e mbylljes se pranimit te ofertave"
                                                    }
                                                },
                                                {
                                                    "ctor": "RequiredFieldValidator",
                                                    "props": {
                                                        "controlToValidate": "endDateOffer",
                                                        "errorMessage": "Ju lutem plotesoni kete fushe.",
                                                        "validationGroup": "grp"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "ctor": "Container",
                            "props": {
                                "type": "row",
                                "components": [{
                                        "ctor": "Container",
                                        "props": {
                                            "type": "",
                                            "classes": ["col"],
                                            "components": [{
                                                    "ctor": "FormField",
                                                    "props": {
                                                        "component": {
                                                            "ctor": "DateTime",
                                                            "props": {
                                                                "inputFormat": "DD/MM/YYYY",
                                                                "outputFormat": "DD-MM-YYYY",
                                                                "displayFormat": "YYYY/MM/DD",
                                                                "value": "27/12/2019"
                                                            }
                                                        },
                                                        "label": "Data e finalizimit te procesit",
                                                        "width": "100%",
                                                        "sortChildren": false,
                                                        "guid": "1821961a-39bd-4fa8-9985-f7a9a99a1e6d",
                                                        "id": "f_endDate",
                                                        "index": 0,
                                                        "spacing": {
                                                            "mt": "3"
                                                        },
                                                        "attr": {
                                                            "isCmp": true
                                                        },
                                                        "css": {},
                                                        "visible": true,
                                                        "enabled": true,
                                                        "draggable": true,
                                                        "classes": [],
                                                        "placeholder": " "
                                                    }
                                                },
                                                {
                                                    "ctor": "RequiredFieldValidator",
                                                    "props": {
                                                        "controlToValidate": "endDate",
                                                        "errorMessage": "Ju lutem plotesoni kete fushe.",
                                                        "validationGroup": "grp"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "ctor": "Container",
                                        "props": {
                                            "type": "",
                                            "classes": ["col"],
                                            "components": [{
                                                    "ctor": "FormField",
                                                    "props": {
                                                        "component": {
                                                            "ctor": "UploadEx",
                                                            "props": {
                                                                "id": "rfcUpload",
                                                                "multiple": true,
                                                                "fullUrlField": "full_url",
                                                                "additionalProperties": {},
                                                                "action": "https://gaia-oshee.oxana.io/?UploadManager/tempUpload"
                                                            }
                                                        },
                                                        "label": "Kerkese per oferte",
                                                        "width": "100%",
                                                        "sortChildren": false,
                                                        "guid": "9d0d2b96-862e-49c2-9be1-495444d9b1cc",
                                                        "id": "f_rfcUpload",
                                                        "index": 0,
                                                        "spacing": {
                                                            "mt": "3"
                                                        },
                                                        "attr": {
                                                            "isCmp": true
                                                        },
                                                        "css": {},
                                                        "visible": true,
                                                        "enabled": true,
                                                        "draggable": true,
                                                        "classes": [],
                                                        "placeholder": ""
                                                    }
                                                },
                                                {
                                                    "ctor": "RequiredFieldValidator",
                                                    "props": {
                                                        "controlToValidate": "rfcUpload",
                                                        "errorMessage": "Ju lutem plotesoni kete fushe.",
                                                        "validationGroup": "grp"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
);

myForm.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});
let validationTrigger = function (e) {
    ValidationManager.getInstance("grp").validate().then((result) => { 
        console.log(`Validation result is: ${result}`);
    });
};

var btn = new Button({
    label: "Validate",
    click: validationTrigger
});

btn.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});