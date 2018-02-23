/**
 * This is a Modal component
 * 
 * Kreatx 2018
 */

//component definition
var Modal = KxGenerator.createComponent({
    beforeAttach: function () {
        this.$body = this.$el.find('#' + this.domID + '-modal-body');
        this.$modal = this.$el.find('#' + this.domID);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            }
        ]
    },

    afterAttach: function () {
        this.$body.html(this.body);

        this.trigger('creationComplete');
    },

    show: function () {
        this.$modal.modal('show');
    },

    hide: function () {
        this.$modal.modal('hide');
    },

    body: function (html) {
        this.$body.html(html);
    },

    template: function () {
        return '<div id="' + this.domID + '-wrapper">' +
            '<div class="modal" id="' + this.domID + '" data-backdrop="static">' +
                '<div class="modal-dialog '+ this.size +'">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h5 class="modal-title" id="' + this.domID + '-modal-title">{title}</h5>' +
                        '</div>' +
                        '<div class="modal-body" id="' + this.domID + '-modal-body">' +

                        '</div>' +
                        '<div class="modal-footer" id="' + this.domID + '-modal-footer">' +

                        '</div>' +
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

//register dom element for this component
KxGenerator.registerDOMElement(Modal, 'kx-modal');