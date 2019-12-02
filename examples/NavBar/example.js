let myNavBar = new NavBar({
    id: "navbar",
    height: "35",
    classes: ['navbar'],
    components: [
        {
            ctor: "Label",
            props: {
                id: "label",
                label: "Label"
            }
        }
    ]
})

$('#root').append(myNavBar.render());