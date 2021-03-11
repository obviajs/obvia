var myForm = new Container(
    {
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
                                    "label": "Te dhena te Pergjithshme",
                                    "labelType": "label",
                                    "components": [],
                                    "sortChildren": false,
                                    "guid": "3d85a549-1ce1-4a97-afcd-1a3b45D75908",
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
                                                "guid": "bb634b4e-632c-491a-835a-7b0c13674867",
                                                "id": "firstname",
                                                "index": 0,
                                                "spacing": {},
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "classes": []
                                            }
                                        },
                                        "name": "firstname",
                                        "label": "Emri",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "b265f5af-fb1c-460e-8ae7-b152d48376d0",
                                        "id": "f_firstname",
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
                                        "placeholder": "Emri"
                                    }
                                }, {
                                    "ctor": "RequiredFieldValidator",
                                    "props": {
                                        "controlToValidate": "firstname",
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
                                                "guid": "5c67112e-0149-4619-a54e-f66f3ed2a2e2",
                                                "id": "lastname",
                                                "index": 0,
                                                "spacing": {},
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "classes": []
                                            }
                                        },
                                        "name": "lastname",
                                        "label": "Mbiemri",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "593d7d56-4d03-4055-a97c-b98254a20ae4",
                                        "id": "f_lastname",
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
                                        "placeholder": "Mbiemri"
                                    }
                                }, {
                                    "ctor": "RequiredFieldValidator",
                                    "props": {
                                        "controlToValidate": "lastname",
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
                                                "guid": "08c29e33-ce9e-4d91-9f95-ec6b4e3e83dd",
                                                "id": "company_representative",
                                                "index": 0,
                                                "spacing": {},
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "classes": []
                                            }
                                        },
                                        "name": "company_representative",
                                        "label": "Perfaqesuesi i kompanise",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "ab0f250b-184d-4742-8c22-0059708ad81c",
                                        "id": "f_company_representative",
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
                                        "placeholder": "Person i autorizuar per shitjet ne kompani"
                                    }
                                }, {
                                    "ctor": "RequiredFieldValidator",
                                    "props": {
                                        "controlToValidate": "company_representative",
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
                                                    "guid": "ec0a3cc9-4e44-4b5e-ba52-277d7d35d84a",
                                                    "id": "nipt",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "classes": []
                                                }
                                            },
                                            "name": "nipt",
                                            "label": "Nipt",
                                            "width": "100%",
                                            "sortChildren": false,
                                            "guid": "5f289f2a-f440-4e19-b0b5-4f950db6d67f",
                                            "id": "f_nipt",
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
                                            "placeholder": "NIPT-i i kompanise"
                                        }
                                    },
                                    {
                                        "ctor": "RequiredFieldValidator",
                                        "props": {
                                            "controlToValidate": "nipt",
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
                                                "ctor": "TextInput",
                                                "props": {
                                                    "value": "",
                                                    "type": "text",
                                                    "autocomplete": "off",
                                                    "components": [],
                                                    "sortChildren": false,
                                                    "guid": "ffbe4914-6e5a-4e6d-a29b-ff2c492c7bb1",
                                                    "id": "email",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "classes": []
                                                }
                                            },
                                            "name": "email",
                                            "label": "E-Mail",
                                            "width": "100%",
                                            "sortChildren": false,
                                            "guid": "1821961a-39bd-4fa8-9985-f7a9a99a1e6d",
                                            "id": "f_email",
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
                                            "controlToValidate": "email",
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
                                                "ctor": "TextInput",
                                                "props": {
                                                    "value": "",
                                                    "type": "text",
                                                    "autocomplete": "off",
                                                    "components": [],
                                                    "sortChildren": false,
                                                    "guid": "fcadccae-5f15-4eb0-9fc9-fb69987d5466",
                                                    "id": "phone_number",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "classes": []
                                                }
                                            },
                                            "name": "phone_number",
                                            "label": "Nr. telefoni",
                                            "width": "100%",
                                            "sortChildren": false,
                                            "guid": "9d0d2b96-862e-49c2-9be1-495444d9b1cc",
                                            "id": "f_phone_number",
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
                                            "controlToValidate": "phone_number",
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
                                            "ctor": "TextInput",
                                            "props": {
                                                "value": "",
                                                "type": "text",
                                                "autocomplete": "off",
                                                "components": [],
                                                "sortChildren": false,
                                                "guid": "d03b627e-6a15-4432-a3e5-84c8cd28536e",
                                                "id": "phone_number_other",
                                                "index": 0,
                                                "spacing": {},
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "classes": []
                                            }
                                        },
                                        "name": "phone_number_other",
                                        "label": "Nr. telefoni (tjeter)",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "f2292068-df7b-42b6-90df-2a0d50c22e83",
                                        "id": "f_phone_number_other",
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
                                                "guid": "7c528309-11be-4b8c-82c0-6cdc4773c680",
                                                "id": "contact_form",
                                                "index": 0,
                                                "spacing": {},
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "classes": []
                                            }
                                        },
                                        "name": "contact_form",
                                        "label": "Pika e kontaktit",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "a77b4231-9f9a-429a-b2b5-50a892d41577",
                                        "id": "f_contact_form",
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
                                        "placeholder": "Skype WhatsApp Viber "
                                    }
                                }]
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
                                            "ctor": "TextInput",
                                            "props": {
                                                "value": "",
                                                "type": "text",
                                                "autocomplete": "off",
                                                "components": [],
                                                "sortChildren": false,
                                                "guid": "04cfdfa6-69e6-4f25-a172-bd62dc0edd49",
                                                "id": "website",
                                                "index": 0,
                                                "spacing": {},
                                                "css": {},
                                                "visible": true,
                                                "enabled": true,
                                                "classes": []
                                            }
                                        },
                                        "name": "website",
                                        "label": "Website",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "61d8dc18-308b-41dd-a3ed-c4d245b09947",
                                        "id": "f_website",
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
                                }]
                            }
                        },
                        {
                            "ctor": "Container",
                            "props": {
                                "type": "",
                                "classes": ["col"],
                                "components": [
   
                                ]
                            }
                        },
                        {
                            "ctor": "Container",
                            "props": {
                                "type": "",
                                "classes": ["col"],
                                "components": [
   
                                ]
                            }
                        },
                        {
                            "ctor": "Container",
                            "props": {
                                "type": "",
                                "classes": ["col"],
                                "components": [
   
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
                                "ctor": "Label",
                                "props": {
                                    "label": "Adresa",
                                    "labelType": "label",
                                    "components": [],
                                    "sortChildren": false,
                                    "guid": "3d85a549-1ce1-4a97-afcd-1a3b45c75908",
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
                                "classes": ["col-6"],
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
                                                    "guid": "bc47e284-e82d-4332-a390-3e9357439cbd",
                                                    "id": "address",
                                                    "index": 0,
                                                    "spacing": {},
                                                    "css": {},
                                                    "visible": true,
                                                    "enabled": true,
                                                    "classes": []
                                                }
                                            },
                                            "name": "address",
                                            "label": "Adresa",
                                            "width": "100%",
                                            "sortChildren": false,
                                            "guid": "dc305f1a-4db4-49cf-9d7e-6c17dd564933",
                                            "id": "f_address",
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
                                            "placeholder": ""
                                        }
                                    },
                                    {
                                        "ctor": "RequiredFieldValidator",
                                        "props": {
                                            "controlToValidate": "address",
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
                                            "ctor": "AutoCompleteEx",
                                            "props": {
                                                "labelField": "state",
                                                "valueField": "state_id",
                                                "value": [],
                                                "guid": "56eeb687-0e6e-481c-afc5-c44bffcddea7",
                                                "id": "state",
                                                "css": {
                                                    "border-radius": ".2rem"
                                                }
   
                                            }
                                        },
                                        "name": "state",
                                        "label": "Shteti",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "13b8e3c5-06bc-4bf4-8659-9b8474527958",
                                        "id": "f_state",
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
                                        "placeholder": ""
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
                                            "ctor": "AutoCompleteEx",
                                            "props": {
                                                "labelField": "city",
                                                "valueField": "city_id",
                                                "value": [],
                                                "guid": "56eeb687-0e6e-481c-afc5-c44bffcddea7",
                                                "id": "city",
                                                "css": {
                                                    "border-radius": ".2rem"
                                                }
   
                                            }
                                        },
                                        "name": "formField",
                                        "label": "Qyteti",
                                        "width": "100%",
                                        "sortChildren": false,
                                        "guid": "13b8e3c5-06bc-4bf4-8659-9b8474527958",
                                        "id": "formField_15",
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
                                        "placeholder": ""
                                    }
                                }]
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