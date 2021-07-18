var myTabNavigator = new TabNavigator({
    id: 'tabNav',
    components: [
        {
            ctor: Tab,
            props: {
                id: 'tab1',
                label: 'Tab 1',
                components: [
                    {
                        ctor: TextInput,
                        props: {
                            id: 'text',
                            label: 'Text Label',
                            spacing: { mb: '5' },
                            value: "1000"
                        }
                    }
                ]
            }
        }
    ]

});

  myTabNavigator.render().then(function (cmpInstance)
  {
    $('#root').append(cmpInstance.$el);
  });