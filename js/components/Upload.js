/**
 * This is an Upload Component
 * 
 * Kreatx 2018
 */

//component definition
var Upload = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            dropString: "Drag & Drop",
            orString: "or",
            browseString: "Browse",
            shownActions: false
        }
    },

    beforeAttach: function () {  
        this.browseBtn = this.$el.find("#browse-" + this.domID);
        this.dropTarget = this.$el.find("#drop-" + this.domID);
        this.fileList = this.$el.find("#files-" + this.domID);
        this.actionsBar = this.$el.find("#actions-" + this.domID);
        this.resumable = this.init();
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.resumable, events: {
                    'fileAdded': this.fileAddedHandler.bind(this)
                }
            },
        ]
    },

    afterAttach: function (e) {
        if (e.target.id == this.domID + '-wrapper') {
            this.trigger('creationComplete');
        }
    },

    init: function () {
        var resumable = new Resumable({
            target: this.target,
            query: { upload_token: 'my_token' }
        });

        resumable.assignBrowse(this.browseBtn);
        if (this.allowDrop)
            resumable.assignDrop(this.dropTarget);
        
        return resumable;
    },

    fileAddedHandler: function (file, event) {
        this.appendToFileList(file);
        if (this.resumable.files.length < 1)
            this.hideActions();     
        if (this.resumable.files.length >= 1)
            this.showActions(); 
        if (this.resumable.files.length >= 4) {
            this.fileList.slimScroll({
                height: '250px',
                size: '5px',
                color: '#CCCCCC',
                railColor: '#CCCCCC',
                railVisible: true
            });
        }
    },

    showActions: function () {
        var model = this.getModel();
        model.shownActions = true;
    },

    hideActions: function () {
        var model = this.getModel();
        model.shownActions = false;
    },

    buildPreview: function (file, img) {
        var reader = new FileReader();
        reader.onload = function (event) {
            img[0].src = event.target.result;
        }

        reader.readAsDataURL(file);
    },

    appendToFileList: function (rf) {
        console.log(rf.file)
        var template =  '<div class="row col-md-12 mt-3">' +
                            '<div class="img-container float-left">' +
                                '<img class="rounded" width="40" height="40" />' +
                            '</div>' +
                            '<div class="float-left mx-2">' +
                                '<div class="file-title">' +
                                    rf.file.name +
                                '</div>' +
                                '<div class="file-size">' +
                                    formatBytes(rf.file.size) +
                                '</div>' +
                            '</div>' +   
                            '<div style="position:absolute; right:0">' +
                                '<div class="file-remove">' +
                                    '<button type="button" class="remove-btn btn btn-sm btn-danger"><i class="fas fa-times-circle"></i> Remove</button>' +
                                '</div>' +
                            '</div>' + 
                        '</div><hr>'; 
        template = $(template);

        template.on('click', '.remove-btn', (function (context, file) {
            return function () { 
                context.resumable.removeFile(rf);
                template.remove();
                if (context.resumable.files.length < 1) {
                    context.fileList.html(""); 
                    context.hideActions();
                }   

                if (context.resumable.files.length < 4){
                    context.fileList.slimScroll({
                        destroy: true
                    })
                    context.fileList[0].style= ''
                }
            }
        })(this, rf.file))
        
        this.fileList.append(template);
        if (rf.file.type == "image/jpeg")
            this.buildPreview(rf.file, template.find("img"));
        else {
            template.find("img").remove();
            template.find(".img-container").append('<i class="far fa-file fa-3x"></i>');
        }
    },

    enable: function () {
       
        return this;
    },

    disable: function () {

        return this;
    },

    template: function () {
        return  "<div id='" + this.domID + "-wrapper' class='col-lg-" + this.colspan + "'>" +
                    "<div class='col-md-12 kx-upload'>" +
                        "<div class='col-md-12 kx-drop-area' id='drop-" + this.domID + "'>" +
                            "<div class='row'>" +
                                "<div class='mt-5' style='margin:auto'>{model.dropString}</div>"+
                            "</div>" +
                            "<div class='row'>" +
                                "<div style='margin:auto'>{model.orString}</div>"+
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='mt-3 mb-5' style='margin:auto'>" +
                                    "<span class='btn btn-secondary' id='browse-" + this.domID + "'>{model.browseString}</span>" +
                                "</div>"+
                            "</div>" +
                        "</div>" +
                        "<div class='col-md-12' id='files-" + this.domID + "'>" +
                        "</div>" +
                        "<div class='col-md-12 row mt-3' rv-if='model.shownActions' id='actions-" + this.domID + "'>" +
                            "<button type='button' class='btn btn-sm btn-primary'><i class='fas fa-cloud-upload-alt'></i> Upload</button>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Upload.type = 'upload';

//register dom element for this component
KxGenerator.registerDOMElement(Upload, 'kx-upload');

