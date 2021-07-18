var myLabel = {
    ctor: "Label",
    props: {
        id: 'label',
        label: 'Label'
    }
};

var myModal = new Modal({
    id: 'autocomplete-modal',
    size: ModalSize.LARGE,
    title: 'Vlerat e Autocomplete',
    components: {
        "modalBody": [{
            ctor: TextInput,
            props: {
                id: "modalBody",
                placeholder: "input",
                classes: ["form-group"]
            }
        }],
        "modalFooter": [{
            ctor: Button,
            props: {
                id: "modalFooter",
                classes: ["btn", "btn-primary"],
                label: "Accept"
            }
        }]
    }

});

myModal.on('endDraw', function (e) {
    //trigger autocomplete complete
    e.stopPropagation();

    myModal.show();
});
myModal.addComponent(myLabel, 0);
myModal.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

console.log("Modal after adding a new component", myModal);