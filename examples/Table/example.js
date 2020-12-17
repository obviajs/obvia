var myTable = new Table({
    id: 'table',
    components: [
        {
            ctor: THead,
            props: {
                id: 'thead',
                components: [
                    {
                        ctor: Tr,
                        props: {
                            components: [
                                {
                                    ctor: Th,
                                    props: {
                                        id: 'th',
                                        components: [
                                            {
                                                ctor: Label,
                                                props: {
                                                    label: "Price"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    ctor: Th,
                                    props: {
                                        id: 'th',
                                        components: [
                                            {
                                                ctor: Label,
                                                props: {
                                                    label: "Quantity"
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
            ctor: Tr,
            props: {
                components: [
                    {
                        ctor: Td,
                        props: {
                            id: 'td',
                            components: [
                                {
                                    ctor: Label,
                                    props: {
                                        label: "5"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        ctor: Td,
                        props: {
                            id: 'td',
                            components: [
                                {
                                    ctor: Label,
                                    props: {
                                        label: "10"
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

myTable.render().then(function (cmpInstance)
{
    $('#root').append(cmpInstance.$el);
});