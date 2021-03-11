var myWizard = new Wizard({
    id: "wizard",
    stepPath: "attr.step",
    detailsPath: "attr.details",
    loop: true,
    components: [{
            ctor: Container,
            props: {
                attr: {
                    "step": "Step 1",
                    "details": "Detaje Personale"
                },
                id: "container_row",
                type: ContainerType.ROW,
                classes: ["row"],
                components: [{
                        ctor: Container,
                        props: {
                            id: "col_container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form_group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Emri i kompanise*",
                                            }
                                        },
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "input_field",
                                                type: ContainerType.NONE,
                                                classes: ["input-field"],
                                                components: [{
                                                        ctor: Label,
                                                        props: {
                                                            id: "user",
                                                            labelType: LabelType.i,
                                                            classes: ["fa", "fa-user"],

                                                        }
                                                    },
                                                    {
                                                        ctor: TextInput,
                                                        props: {
                                                            id: "email-input",
                                                            type: TextInputType.EMAIL,
                                                            placeholder: "Emri i kompanise",
                                                            classes: ["form-control"]

                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Limiti i debise",
                                            }
                                        },
                                        {

                                            ctor: TextInput,
                                            props: {
                                                id: "email-input",
                                                type: TextInputType.EMAIL,
                                                placeholder: "Limiti i debise",
                                                classes: ["form-control"]

                                            }
                                        }
                                    ]
                                }
                            }]
                        }
                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Gjendja e monedhes vendase",
                                            }
                                        },
                                        {

                                            ctor: TextInput,
                                            props: {
                                                id: "email-input",
                                                type: TextInputType.EMAIL,
                                                placeholder: "Gjendja e monedhes vendase",
                                                classes: ["form-control"]
                                            }

                                        }
                                    ]
                                }
                            }]
                        }

                    }
                ]
            }
        },
        {
            ctor: Container,
            props: {
                attr: {
                    "step": "Step 2",
                    "details": "Te pergjithshme"
                },
                id: "container-row",
                type: ContainerType.ROW,
                classes: ["row"],
                components: [{
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Kodi*",
                                            }
                                        },
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "input-field",
                                                type: ContainerType.NONE,
                                                classes: ["input-field"],
                                                components: [{
                                                        ctor: Label,
                                                        props: {
                                                            id: "user",
                                                            labelType: LabelType.i,
                                                            classes: ["fa", "fa-info"],

                                                        }
                                                    },
                                                    {
                                                        ctor: TextInput,
                                                        props: {
                                                            id: "email-input",
                                                            type: TextInputType.EMAIL,
                                                            placeholder: "ex:0800 123 4568",
                                                            classes: ["form-control"]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Gjendja e celur",
                                            }
                                        },
                                        {

                                            ctor: TextInput,
                                            props: {
                                                id: "email-input",
                                                type: TextInputType.EMAIL,
                                                placeholder: "Gjendja e celur",
                                                classes: ["form-control"]

                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Zona*",
                                            }
                                        },
                                        {

                                            ctor: TextInput,
                                            props: {
                                                id: "email-input",
                                                type: TextInputType.EMAIL,
                                                placeholder: "Zona",
                                                classes: ["form-control"]
                                            }

                                        }
                                    ]
                                }
                            }]
                        }

                    }
                ]
            }
        },
        {
            ctor: Container,
            props: {
                attr: {
                    "step": "Step 3",
                    "details": "Kontakt"
                },
                id: "container-row",
                type: ContainerType.ROW,
                classes: ["row"],
                components: [{
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Monedha/Kursi*",
                                            }
                                        },
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "input-field",
                                                type: ContainerType.NONE,
                                                classes: ["input-field"],
                                                components: [{
                                                        ctor: Label,
                                                        props: {
                                                            id: "user",
                                                            labelType: LabelType.i,
                                                            classes: ["fa", "fa-money"],

                                                        }
                                                    },
                                                    {
                                                        ctor: TextInput,
                                                        props: {
                                                            id: "email-input",
                                                            type: TextInputType.EMAIL,
                                                            placeholder: "eur, usd, all, aus",
                                                            classes: ["form-control"]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col-container",
                            type: ContainerType.COLUMN,
                            classes: ["col-4"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "form-group",
                                    type: ContainerType.NONE,
                                    classes: ["form-group"],
                                    components: [{
                                            ctor: Label,
                                            props: {
                                                id: "company-name",
                                                labelType: LabelType.Label,
                                                label: "Ne Date",
                                            }
                                        },
                                        {

                                            ctor: TextInput,
                                            props: {
                                                id: "email-input",
                                                type: TextInputType.EMAIL,
                                                placeholder: "Ne Date",
                                                classes: ["form-control"]

                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    }

                ]
            }
        }
    ]
});

myWizard.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});