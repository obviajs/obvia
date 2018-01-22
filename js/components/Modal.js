/**
 * This is a Modal component
 * 
 * Kreatx 2018
 */

//component definition
var Modal = KxGenerator.createComponent({

    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function(){
        return {
           title: this.title
        }
    },

    beforeAttach: function () {
        
    },

    afterAttach: function () {
        $('#' + this.id + '-modal-body').html(this.body);
    },

    show: function () {
        $('#' + this.id).modal('show');
    },

    hide: function () {
        $('#' + this.id).modal('hide');
    },

    body: function (html) {
        $('#' + this.id + '-modal-body').html(html);
    },

    template: function () {
        return '<div class="modal" id="' + this.id + '" data-backdrop="static">' +
            '<div class="modal-dialog '+ this.size +'">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '<h5 class="modal-title" id="' + this.id + '-modal-title">{title}</h5>' +
                    '</div>' +
                    '<div class="modal-body" id="' + this.id + '-modal-body">' +

                    '</div>' +
                    '<div class="modal-footer" id="' + this.id + '-modal-footer">' +

                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Modal.type = 'modal';
