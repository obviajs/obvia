var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var myContainer = new Container({
    id: 'nestedLayout',
    components: [{
        ctor: Container,
        props: {
            id: '',
            type: ContainerType.ROW,
            components: [{
                    ctor: Container,
                    props: {
                        id: '',
                        type: ContainerType.COLUMN,
                        spacing: {
                            colSpan: 6
                        },
                        components: [{
                                ctor: Container,
                                props: {
                                    id: '',
                                    type: ContainerType.ROW,
                                    components: [{
                                        ctor: Container,
                                        props: {
                                            id: '',
                                            classes: ["border"],
                                            components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'label',
                                                    label: '1st Row'
                                                }
                                            }]
                                        }
                                    }]
                                }
                            },
                            {
                                ctor: Container,
                                props: {
                                    id: '',
                                    type: ContainerType.ROW,
                                    components: [{
                                        ctor: Container,
                                        props: {
                                            id: '',
                                            classes: ["border"],
                                            components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'label',
                                                    label: '2nd Row'
                                                }
                                            }]
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
                        id: '',
                        type: ContainerType.COLUMN,
                        spacing: {
                            colSpan: 6
                        },
                        classes: ["border"],
                        components: [{
                            ctor: Label,
                            props: {
                                id: 'label',
                                label: 'Spans 2 Rows'
                            }
                        }]
                    }
                }
            ]
        }
    }]
});
myContainer.on('endDraw', function (e) {
    loader.hide();
});
myContainer.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});