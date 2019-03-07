var myLabel = {constructor: "Label",
    props:{
        id: 'label',
        label: 'Label'
    }
};

var myModal = new Modal({
    id: 'autocomplete-modal',
    size: 'modal-lg',
    title: 'Vlerat e Autocomplete',
    body: '<div class="row">' +
        '<div class="col-sm-12">' +
        '<div class="table-responsive" style="margin-left:10px;">' +
        '<table id="combo_category_table" class="table table-striped table-bordered table-hover display" style="width: 100%">' +
        '<thead>' +
        '<tr>' +
        '<th>Emri</th>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>'
});


myModal.on('creationComplete', function (e) {
    //trigger autocomplete complete
    e.stopPropagation();
   
    myModal.show();
}); 
myModal.addComponent(myLabel,0);
$('#root').append(myModal.render());

console.log("Modal after adding a new component",myModal);