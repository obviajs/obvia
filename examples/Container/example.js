var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var myContainer = new Container({
    id: 'nestedLayout',
    components:[
        {
            constructor: Container,
            props: {
                id: '',
                type: ContainerType.ROW,
                components:[
                    {
                        constructor: Container,
                        props: {
                            id: '',
                            type: ContainerType.COLUMN,
                            spacing: {colSpan:6},
                            components:[
                                {
                                    constructor: Container,
                                    props: {
                                        id: '',
                                        type: ContainerType.ROW,
                                        components:[
                                            {
                                                constructor: Container,
                                                props: {
                                                    id: '', 
                                                    classes:["border"],
                                                    components:[
                                                        {
                                                            constructor: Label,
                                                            props: {
                                                                id: 'label',
                                                                label: '1st Row'
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
                                        id: '',
                                        type: ContainerType.ROW,
                                        components:[
                                            {
                                                constructor: Container,
                                                props: {
                                                    id: '',
                                                    classes:["border"],
                                                    components:[
                                                        {
                                                            constructor: Label,
                                                            props: {
                                                                id: 'label',
                                                                label: '2nd Row'
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
                            id: '',
                            type: ContainerType.COLUMN,
                            spacing: {colSpan:6},
                            classes:["border"],
                            components:[
                                {
                                    constructor: Label,
                                    props: {
                                        id: 'label',
                                        label: 'Spans 2 Rows'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
});
myContainer.on('creationComplete', function(e){
    loader.hide();    
});
$('#root').append(myContainer.render());