var myModal = new Modal({
    id: 'autocomplete-modal-' + this.domID,
    size: 'modal-lg',
    title: 'Vlerat e Autocomplete',
    body: '<div class="row">' +
        '<div class="col-sm-12">' +
        '<div class="table-responsive" style="margin-left:10px;">' +
        '<table id="combo_category_table_' + this.domID + '" class="table table-striped table-bordered table-hover display" style="width: 100%">' +
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

this.$modal = this.modal.$el;
var _self = this;
this.modal.on('creationComplete', function (e) {
    //trigger autocomplete complete
    e.stopPropagation();
    _self.trigger('creationComplete');
})

$('#root').append(myModal.render());