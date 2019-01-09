var myTabNavigator = new TabNavigator({
    id: 'tabNav',
    components: [
        {
            constructor: Tab,
            props: {
                id: 'tab1',
                label: 'Tab 1',
                components: [
                    {
                        constructor: TextInput,
                        props: {
                            id: 'text',
                            colspan: '6',
                            label: 'Text Label',
                            spacing: { mb: '5' },
                            versionStyle: '',
                            blockProcessAttr: false,
                            required: true,
                            value: "1000"
                        }
                    }
                ]
            }
        }
    ]

});

myTabNavigator.on('creationComplete', function(e){
    loader.hide();
    myTabNavigator.selectedIndex = 0;
});

$('#root').append(myTabNavigator.render());