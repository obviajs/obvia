var myToggle = new FormField({
    id: 'formFieldEx2',
    label: 'Example  Input',
    placeholder: 'Example  Input',
    name: 'formFieldEx2',
    size: FormFieldSize.SMALL,
    component: {
        ctor: Toggle,
        props: {
            id: 'checkbox',
            value: 1,
            checked: true,
            change: changeTest,
            props: {
                "checkBox": {
                    classes: [ToggleBgStyle.BG_INFO]
                },
                "span": {
                    classes: ["round"]
                }
            }
        }
    }
});
function changeTest(){
    console.log("Toggle ChangeTest");
}
myToggle.render().then(function(cmpInstance){
    $('#root').append(cmpInstance.$el);
});
