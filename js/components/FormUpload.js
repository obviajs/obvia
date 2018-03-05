/**
 * This is a Form Upload Element
 * 
 * Kreatx 2018
 */

//component definition
var FormUpload = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            enabled: true
        }
    },
    
    beforeAttach: function () {
        this.$uploadBtn = this.$el.find("#upload-" + this.domID);
        this.$modalContainer = this.$el.find('#' + this.domID + '-upload-modal');
        this.modal = null;
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$uploadBtn, events: {
                    'click': this.uploadHandler.bind(this)
                }
            },
        ]
    },

    afterAttach: function (e) {
        if (e.target.id == this.domID + '-wrapper') {
            this.createModal();
            this.trigger('creationComplete');
        }
    },

    uploadHandler: function (e) {
        this.modal.show();
    },

    createModal: function () {
        this.modal = new Modal({
            id: 'upload-modal-' + this.domID,
            size: 'modal-lg',
            title: 'Upload Document',
            body: ''
        });
        var modal = this.modal;
        
        modal.parent = this;
        modal.parentType = 'autocomplete';

        var up = this.createUpload();
        modal.on('creationComplete', function (e) {
            e.stopPropagation();
            modal.$body.html(up);
        });

        this.$modalContainer.html(modal.render());
    },

    createUpload: function () {
        this.upload = new Upload({
            id: 'upload' + this.domID,
            colspan: '12',
            multiple: false,
            allowDrop: true,
            target: this.action
        });

        this.upload.on('creationComplete', function (e) {
            e.stopPropagation();
        });

        return this.upload.render();
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;
        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = true;
        return this;
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='form-group col-lg-" + this.colspan + " rowspan" + this.rowspan + " resizable'>" +    
                    "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                    "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                    "<div class='input-container'>" +
                        "<p>" +
                            "<button id='upload-" + this.domID + "' type='button' class='btn btn-primary' rv-enabled='model.enabled' style='color: white;'><i class='fas fa-cloud-upload-alt'></i> Upload</button>" +
                        "</p><hr>" +
                        "<div class='row'>" +
                            "<div class='col-md-12 list-container'></div>" +
                        "</div>" +
                    "</div>" +  
                     "<div id='" + this.domID + "-upload-modal'></div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
FormUpload.type = 'form-upload';

//register dom element for this component
KxGenerator.registerDOMElement(FormUpload, 'kx-formupload');

