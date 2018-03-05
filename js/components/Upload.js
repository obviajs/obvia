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
            shownActions: false,
            enabled: true,
            uploadOnProgress: false,
            uploadBtnClass: "btn btn-sm btn-primary",
            progressBarCSS: "width: 0%"
            // chunkSize: 1 * 1024 * 1024 //1 MB
        }
    },

    beforeAttach: function () {  
        this.browseBtn = this.$el.find("#browse-" + this.domID);
        this.dropTarget = this.$el.find("#drop-" + this.domID);
        this.fileList = this.$el.find("#files-" + this.domID);
        this.actionsBar = this.$el.find("#actions-" + this.domID);
        this.uploadBtn = null;
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
                    'fileAdded': this.fileAddedHandler.bind(this),
                    'progress': this.uploadProgress.bind(this),
                    'complete': this.uploadComplete.bind(this),
                    'error': this.errorHandler.bind(this)
                }
            }
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
            query: { upload_token: 'kx' },
        });

        resumable.assignBrowse(this.browseBtn);
        if (this.allowDrop)
            resumable.assignDrop(this.dropTarget);
        
        return resumable;
    },

    errorHandler: function (file, message) {
        bootbox.alert(message);
    },

    fileAddedHandler: function (file, event) {
        console.log(file)
        //allowed type control
        if (this.allowedExtensions && this.allowedExtensions.indexOf(fileExtension(file.file.name)) == -1) {
            this.resumable.removeFile(file); 
            return;
        }

        //multiple control
        if (!this.multiple && this.resumable.files.length > 1) {
            this.resumable.removeFile(file); 
            return;
        }

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
                railVisible: true,
                start: 'bottom',
            });

            this.fileList.slimScroll({ scrollTo: this.fileList[0].scrollHeight })
        }
    },

    uploadHandler: function (e) {
        this.resumable.upload();

        var model = this.getModel();
        model.uploadOnProgress = true;
        model.uploadBtnClass = "btn btn-sm btn-warning";
        this.uploadBtn.html("<i class='fas fa-pause'></i> Pause");

        this.uploadBtn.off('click');
        this.uploadBtn.on('click', this.pauseHandler.bind(this));

        this.fileList.find('.remove-btn').prop('disabled', true);
    },
   
    uploadProgress: function () {
        var model = this.getModel();
        model.progressBarCSS = "width: " + 100 * this.resumable.progress() + "%";
    },

    uploadComplete: function () {
        this.resetUpload();
        bootbox.alert("Upload Success");
    },

    pauseHandler: function () {
        var model = this.getModel();
        model.uploadBtnClass = "btn btn-sm btn-success";

        this.resumable.pause();
        this.uploadBtn.off('click');
        this.uploadBtn.on('click', this.uploadHandler.bind(this));
        this.uploadBtn.html("<i class='fas fa-play'></i> Resume");
    },

    resetUpload: function () {
        var model = this.getModel();
        model.uploadBtnClass = "btn btn-sm btn-primary";
        model.uploadOnProgress = false;
        model.progressBarCSS = "width: 0%";
        model.shownActions = false;

        this.uploadBtn.html("<i class='fas fa-cloud-upload-alt'></i> Upload");
        this.resumable.files = [];
        this.fileList.slimScroll({
            destroy: true
        });
        this.fileList[0].style = ''
        this.fileList.html("");  
        this.browseBtn.prop('disabled', false);
    },

    showActions: function () {
        var model = this.getModel();
        model.shownActions = true;

        this.uploadBtn = this.$el.find("#upload-" + this.domID);
        this.uploadBtn.off('click');
        this.uploadBtn.on('click', this.uploadHandler.bind(this));
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
        var template =  '<div id="template-' + rf.file.uniqueIdentifier + '-' + this.domID +'" class="row col-md-12 mt-3">' +
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
                    });
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
        var model = this.getModel();
        model.enabled = true;
        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;
        return this;
    },

    template: function () {
        return  "<div id='" + this.domID + "-wrapper' class='col-lg-" + this.colspan + "'>" +
                    "<div class='col-md-12 kx-upload'>" +
                        "<div class='col-md-12 kx-drop-area' id='drop-" + this.domID + "' rv-if='allowDrop'>" +
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
                        "<div class='col-md-12' rv-unless='allowDrop'>" +
                            "<span class='btn btn-secondary' id='browse-" + this.domID + "'>{model.browseString}</span>" +
                        "</div>" +
                        "<div class='col-md-12' id='files-" + this.domID + "'>" +
                        "</div>" +
                        "<div class='col-md-12 mt-3' rv-if='model.shownActions' id='actions-" + this.domID + "'>" +
                            "<div class='row'>" +
                                "<div class='col-md-12 mb-2'>" +
                                    "<div rv-if='model.uploadOnProgress' class='progress'>" +
                                        "<div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' rv-style='model.progressBarCSS'></div>" +
                                    "</div>" +
                                "</div>" +  
                            "</div>" +      
                            "<p>"+
                                "<button id='upload-" + this.domID + "' type='button' rv-enabled='model.enabled' rv-class='model.uploadBtnClass' style='color: white;'><i class='fas fa-cloud-upload-alt'></i> Upload</button>" +
                            "</p>"+
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

