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
        this.$upload = this.createUpload();
        this.$listContainer = this.$el.find('.list-container');
        if (typeof this.dataProvider == "string") {
            //remote cursor array 
            var rca = new RemoteCursorArray();
            rca.getData_Action = this.dataProvider;
            rca.recordsPerPage = 100;
            rca.on(RemoteCursorEventType.REQUEST_SUCCESS, function (e) {
                this.dataProvider = rca.source;
                this.$list = this.createList();
            }.bind(this));

            rca.init();
        } else {
            this.$list = this.createList();
        }

        
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
                    'click': this.handleUploadClick.bind(this)
                }
            },
        ]
    },

    afterAttach: function (e) {
        if (e.target.id == this.domID + '-wrapper') {
            this.createModal();
            this.$listContainer.html(this.$list);
        }
    },

    handleUploadClick: function (e) {
        this.modal.show();
    },

    createList: function () {
        this.direction = this.direction == undefined || this.direction == null ? 'vertical' : this.direction;

        this.list = new List({
            id: 'list',
            colspan: '6',
            direction: this.direction,
            seperator: true,
            defaultItem: this.defaultItem,
            dataProvider: this.dataProvider,
            embedded: true,
            value: this.value,
            components: [
                {
                    constructor: Label,
                    props: {
                        id: 'no',
                        class: 'col-sm-1',
                        label: "{" + this.noLabelValue + "}"
                    }
                },
                {
                    constructor: Label,
                    props: {
                        id: 'name',
                        class: 'col-sm-9',
                        label: "{" + this.nameLabelValue + "}",
                        hyperlink: "{" + this.downloadLink + "}",
                        target: "_blank"
                    }
                },
                {
                    constructor: Button,
                    props: {
                        id: 'button',
                        type: "button",
                        value: "Delete",
                        class: "btn btn-sm btn-danger",
                        onclick: this.deleteFromListHandler.bind(this),
                        embedded: true  
                    }
                }
            ],
            // onclick: this.onclick,
            // onchange: this.onchange
        }).on('creationComplete', function (e) {
            e.stopPropagation();
        }.bind(this)).on('change', function () {
            this.value = this.list.value;
        }.bind(this));
        
        return this.list.render();
    },

    createModal: function () {
        this.modal = new Modal({
            id: 'upload-modal-' + this.id,
            size: 'modal-lg',
            title: 'Upload Document',
            body: ''
        });
        var modal = this.modal;
        
        modal.parent = this;
        modal.parentType = 'autocomplete';

        var _self = this;
        modal.on('creationComplete', function (e) {
            e.stopPropagation();
            modal.$body.html(_self.$upload);
        });

        this.$modalContainer.html(modal.render());
    },

    createUpload: function () {
        this.upload = new Upload({
            id: 'upload' + this.id,
            colspan: '12',
            multiple: this.multiple || true,
            allowedExtensions: this.allowedExtensions || undefined,
            allowDrop: true,
            target: this.action,
            onupload: this.uploadHandler.bind(this)
        });

        var _self = this;
        this.upload.on('creationComplete', function (e) {
            e.stopPropagation();
            _self.trigger('creationComplete');
        });

        return this.upload.render();
    },

    deleteFromListHandler: function (e, repeaterArgs) {
        console.log(repeaterArgs);
        this.list.removeRow(repeaterArgs.currentIndex + 1);
    },

    uploadHandler: function (files) {
        this.modal.hide();
        var repIndex = 0;
        var no = 0;
        if (this.list.dataProvider.length > 0) {
            repIndex = this.list.dataProvider.length;
            no = parseInt(this.list.dataProvider[repIndex - 1][this.noLabelValue]);
        }
        
        files.forEach(function (rf, index) {
            var item = {
                "id": rf.file.uniqueIdentifier,
                "no": no + index + 1,
                "file": rf.file.name,
                "deleteAction": this.defaultItem[this.deleteAction] + "?id=" + rf.file.uniqueIdentifier,
                "downloadLink": this.defaultItem[this.downloadLink] + "?id=" + rf.file.uniqueIdentifier
            };
            
            this.list.addRow(item, repIndex + index + 1);
        }.bind(this));
        
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
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>" +    
                    "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                    "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                    "<div class='input-container'>" +
                        "<div>" +
                            "<button id='upload-" + this.domID + "' type='button' class='btn btn-primary' rv-enabled='model.enabled' style='color: white;'><i class='fas fa-cloud-upload-alt'></i> Upload</button>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-sm-12 list-container'></div>" +
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
FormUpload.type = 'form_upload';

//register dom element for this component
KxGenerator.registerDOMElement(FormUpload, 'kx-formupload');

