var myLabel = {ctor: "Label",
    props:{
        id: 'label',
        label: 'Label'
    }
};

var myModal = new Modal({
    id: 'autocomplete-modal',
    size: ModalSize.LARGE,
    title: 'Vlerat e Autocomplete',
 
});

myModal.on('creationComplete', function (e) {
    //trigger autocomplete complete
    e.stopPropagation();
   
    myModal.show();
}); 
myModal.addComponent(myLabel, 0);
myModal.renderPromise().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);
});

console.log("Modal after adding a new component",myModal);