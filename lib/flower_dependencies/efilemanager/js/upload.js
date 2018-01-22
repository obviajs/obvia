(function () {

    var selectors = {
        documentCategories: $('#document-categories'),
        forms: $('#document-categories-forms'),
        formsId: '#document-categories-forms',
        selectId : 'document-categories-select'
    };

    var documentVersionSelectors = {
        documentCategories: $('#document-revision-categories'),
        forms: $('#document-revision-categories-forms'),
        formsId: '#document-revision-categories-forms',
        selectId : 'document-revision-categories-select'
    };

    var documentUploadSettings = {
        limit: 1,
        maxSize: null,
        fileMaxSize: null,
        extensions: null, //['jpg', 'jpeg', 'png', 'audio/mp3', 'text/plain']
        theme: 'dragdrop',
        changeInput: '<div class="fileuploader-input">' +
        '<div class="fileuploader-input-inner">' +
        '<img src="resources/inner_resources/efilemanager/img/upload-file.png">' +
        '<h3 class="fileuploader-input-caption"><span>Drag and drop</span></h3>' +
        '<p>ose</p>' +
        '<div class="fileuploader-input-button"><span>Zgjidh dokument</span></div>' +
        '</div>' +
        '</div>',
        captions: {
            button: function(options) { return 'Zgjidh ' + (options.limit == 1 ? 'dokument' : 'dokumenta'); },
            feedback: function(options) { return 'Drag&Drop ' + (options.limit == 1 ? 'dokument' : 'dokumenta') + ' '; },
            feedback2: function(options) { return options.length + ' ' + (options.length > 1 ? ' dokumenta u' : ' dokument u') + (options.length > 1 ? ' zgjodhen' : ' zgjodh'); },
            drop: 'Vendos dokumentat ketu per te ngarkuar',
            paste: '<div class="fileuploader-pending-loader"><div class="left-half" style="animation-duration: ${ms}s"></div><div class="spinner" style="animation-duration: ${ms}s"></div><div class="right-half" style="animation-duration: ${ms}s"></div></div> Pasting a file, click here to cancel.',
            removeConfirmation: 'Are you sure you want to remove this file?',
            errors: {
                filesLimit: 'Only ${limit} files are allowed to be uploaded.',
                filesType: 'Only ${extensions} files are allowed to be uploaded.',
                fileSize: '${name} is too large! Please choose a file up to ${fileMaxSize}MB.',
                filesSizeAll: 'Files that you choosed are too large! Please upload files up to ${maxSize} MB.',
                fileName: 'File with the name ${name} is already selected.',
                folderUpload: 'You are not allowed to upload folders.'
            }
        },

        thumbnails: {
            box: '<div class="fileuploader-items">' +
            '<ul class="fileuploader-items-list"></ul>' +
            '</div>',
            boxAppendTo: null,
            item: '<li class="fileuploader-item">' +
            '<div class="columns">' +
            '<div class="column-thumbnail">${image}</div>' +
            '<div class="column-title">' +
            '<div title="${name}">${name}</div>' +
            '<span>${size2}</span>' +
            '</div>' +
            '<div class="column-actions">' +
            '<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i></i></a>' +
            '</div>' +
            '</div>' +
            '<div class="progress-bar2">${progressBar}<span></span></div>' +
            '</li>',
            item2: '<li class="fileuploader-item">' +
            '<div class="columns">' +
            '<a href="${data.url}" target="_blank">' +
            '<div class="column-thumbnail">${image}</div>' +
            '<div class="column-title">' +
            '<div title="${name}">${name}</div>' +
            '<span>${size2}</span>' +
            '</div>' +
            '</a>' +
            '<div class="column-actions">' +
            '<a href="${file}" class="fileuploader-action fileuploader-action-download" title="Download" download><i></i></a>' +
            '<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i></i></a>' +
            '</div>' +
            '</div>' +
            '</li>',
            itemPrepend: false,
            removeConfirmation: false,
            startImageRenderer: true,
            synchronImages: true,
            canvasImage: {
                width: null,
                height: null
            },
            _selectors: {
                list: '.fileuploader-items-list',
                item: '.fileuploader-item',
                start: '.fileuploader-action-start',
                retry: '.fileuploader-action-retry',
                remove: '.fileuploader-action-remove'
            },
            beforeShow: function(parentEl, newInputEl, inputEl) {
                // your callback here
            },
            onItemShow: function(item, listEl, parentEl, newInputEl, inputEl) {
                if(item.choosed){
                    item.html.find('.column-actions').prepend(
                        '<a class="fileuploader-action fileuploader-action-start" title="Start upload" style="display: none"><i></i></a>'
                    );

                    $('#submit-document').html(
                        '<a class="btn btn-sm btn-primary" onclick="startUpload(\'once\');">Ngarko</a> ' +
                        '<a class="btn btn-sm btn-danger" onclick="startUpload(\'encrypted\');">Ngarko te kriptuar</a> ' +
                        '<a class="btn btn-sm btn-default" onclick="startUpload(\'unlimited\');">Ngarko & i Ri</a>'
                    );
                }

            },
            onItemRemove: function(itemEl, listEl, parentEl, newInputEl, inputEl) {
                itemEl.children().animate({'opacity': 0}, 200, function() {
                    setTimeout(function() {
                        itemEl.slideUp(200, function() {
                            itemEl.remove();
                            $('#submit-document').html("");
                        });
                    }, 100);
                });
            },
            onImageLoaded: function(itemEl, listEl, parentEl, newInputEl, inputEl) {
                // your callback here
            },
        },
        upload: {
            url: '?efilemanager/upload_file',
            data: {},
            type: 'POST',
            enctype: 'multipart/form-data',
            start: false,
            synchron: true,
            beforeSend: function (item, listEl, parentEl, newInputEl, inputEl, callback) {
                if (!validateForms($('.formHtml'))) {
                    stopFocus = 0;
                    callback(false);
                    return;
                }

                var dataString = getFormsFilledData($('.formHtml'));
                dataString += "&documentCategory="+selectedCategory(selectors.selectId).value;
                dataString += "&id_document="+document_node.id_document;
                dataString += "&id_group="+document_node.id_group;
                dataString += "&is_group="+document_node.is_group;
                dataString += "&specified_doc_name="+$('#upload-doc-name').val();
                dataString += "&extension=" + item.extension;
                dataString += (uploadMode == 'encrypted') ? "&encrypted=1" : '';
                item.upload.data.formData = window.btoa(dataString);

                if (uploadMode == 'encrypted') {
                    //encrypt
                    bootbox.prompt({
                        title: "Vendosni nje Fjalekalim!",
                        inputType: 'password',
                        callback: function(result) {
                            if (result && result != '') {
                                var reader = new FileReader();
                                reader.readAsDataURL(item.file);
                
                                reader.onload = function (e) {
                                    var encrypted = CryptoJS.AES.encrypt(e.target.result, result).toString();

                                    var formData = new FormData();
                                    var blob = new Blob([encrypted], { type: 'kxencrypted' });
                                    formData.append('file', blob, item.file.name + '.kxencrypted');
                                    formData.append('formData', item.upload.data.formData);

                                    var request = new XMLHttpRequest();
                                    request.open('POST', '?efilemanager/upload_file');
                                    request.send(formData);
                                    request.onreadystatechange = function () {
                                        if (request.readyState === 4) {
                                            var response = JSON.parse(request.responseText);
                                            $('#add_document_modal').modal('hide');
                                            bootbox.alert(response.message);
                                        }
                                    }
                                }
                            }
                        }
                    });
                } else {
                    callback(true);
                }
                
            },
            onSuccess: function(data, item, listEl, parentEl, newInputEl, inputEl, textStatus, jqXHR) {
                data = JSON.parse(data);
                if(data.error == 0){
                    item.remove();
                    if (uploadMode == 'once' || uploadMode == 'encrypted'){
                        $('#add_document_modal').modal('hide');
                    }else{

                    }
                }else{

                }
                bootbox.alert(data.message);

            },
            onError: function(item, listEl, parentEl, newInputEl, inputEl, jqXHR, textStatus, errorThrown) {
                var progressBar = item.html.find('.progress-bar2');

                if(progressBar.length > 0) {
                    progressBar.find('span').html(0 + "%");
                    progressBar.find('.fileuploader-progressbar .bar').width(0 + "%");
                    item.html.find('.progress-bar2').fadeOut(400);
                }

                item.upload.status != 'cancelled' && item.html.find('.fileuploader-action-retry').length == 0 ? item.html.find('.column-actions').prepend(
                    '<a class="fileuploader-action fileuploader-action-start" title="Start upload" style="display: none"><i></i></a>'
                ) : null;
            },
            onProgress: function(data, item, listEl, parentEl, newInputEl, inputEl) {
                var progressBar = item.html.find('.progress-bar2');

                if(progressBar.length > 0) {
                    progressBar.show();
                    progressBar.find('span').html(data.percentage + "%");
                    progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
                }
            },
            onComplete: function(listEl, parentEl, newInputEl, inputEl, jqXHR, textStatus) {
                // your callback here
            },
        },

        dragDrop: {
            // set drag&drop container {null, String, jQuery Object}
            // example: 'body'
            // example: $('body')
            container: null,

            // Callback fired on entering with dragged files the drop container
            onDragEnter: function(event, listEl, parentEl, newInputEl, inputEl) {
                // callback will go here
            },

            // Callback fired on leaving with dragged files the drop container
            onDragLeave: function(event, listEl, parentEl, newInputEl, inputEl) {
                // callback will go here
            },

            // Callback fired on dropping the dragged files in drop container
            onDrop: function(event, listEl, parentEl, newInputEl, inputEl) {
                // callback will go here
            },

        },

        onSelect: function(item, listEl, parentEl, newInputEl, inputEl) {
            $('#drop-document-area').attr('class', 'col-md-4');
            $('#document-specifications-area').show();
            $('#upload-doc-name').val(item.title);
            renderFilePreferencesView(selectors, {});

        },

        afterSelect: function(listEl, parentEl, newInputEl, inputEl) {

        },

        onRemove: function(item, listEl, parentEl, newInputEl, inputEl) {

            return true;
        },
        onEmpty: function(listEl, parentEl, newInputEl, inputEl) {

        }


    };

    var documentVersionUploadSettings = {
        limit: 1,
        maxSize: null,
        fileMaxSize: null,
        extensions: null, //['jpg', 'jpeg', 'png', 'audio/mp3', 'text/plain']
        theme: 'dragdrop',
        changeInput: '<div class="fileuploader-input">' +
        '<div class="fileuploader-input-inner">' +
        '<img src="resources/inner_resources/efilemanager/img/upload-file.png">' +
        '<h3 class="fileuploader-input-caption"><span>Drag and drop</span></h3>' +
        '<p>ose</p>' +
        '<div class="fileuploader-input-button"><span>Zgjidh dokument</span></div>' +
        '</div>' +
        '</div>',
        captions: {
            button: function(options) { return 'Zgjidh ' + (options.limit == 1 ? 'dokument' : 'dokumenta'); },
            feedback: function(options) { return 'Drag&Drop ' + (options.limit == 1 ? 'dokument' : 'dokumenta') + ' '; },
            feedback2: function(options) { return options.length + ' ' + (options.length > 1 ? ' dokumenta u' : ' dokument u') + (options.length > 1 ? ' zgjodhen' : ' zgjodh'); },
            drop: 'Vendos dokumentat ketu per te ngarkuar',
            paste: '<div class="fileuploader-pending-loader"><div class="left-half" style="animation-duration: ${ms}s"></div><div class="spinner" style="animation-duration: ${ms}s"></div><div class="right-half" style="animation-duration: ${ms}s"></div></div> Pasting a file, click here to cancel.',
            removeConfirmation: 'Are you sure you want to remove this file?',
            errors: {
                filesLimit: 'Only ${limit} files are allowed to be uploaded.',
                filesType: 'Only ${extensions} files are allowed to be uploaded.',
                fileSize: '${name} is too large! Please choose a file up to ${fileMaxSize}MB.',
                filesSizeAll: 'Files that you choosed are too large! Please upload files up to ${maxSize} MB.',
                fileName: 'File with the name ${name} is already selected.',
                folderUpload: 'You are not allowed to upload folders.'
            }
        },

        thumbnails: {
            box: '<div class="fileuploader-items">' +
            '<ul class="fileuploader-items-list"></ul>' +
            '</div>',
            boxAppendTo: null,
            item: '<li class="fileuploader-item">' +
            '<div class="columns">' +
            '<div class="column-thumbnail">${image}</div>' +
            '<div class="column-title">' +
            '<div title="${name}">${name}</div>' +
            '<span>${size2}</span>' +
            '</div>' +
            '<div class="column-actions">' +
            '<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i></i></a>' +
            '</div>' +
            '</div>' +
            '<div class="progress-bar2">${progressBar}<span></span></div>' +
            '</li>',
            item2: '<li class="fileuploader-item">' +
            '<div class="columns">' +
            '<a href="${data.url}" target="_blank">' +
            '<div class="column-thumbnail">${image}</div>' +
            '<div class="column-title">' +
            '<div title="${name}">${name}</div>' +
            '<span>${size2}</span>' +
            '</div>' +
            '</a>' +
            '<div class="column-actions">' +
            '<a href="${file}" class="fileuploader-action fileuploader-action-download" title="Download" download><i></i></a>' +
            '<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i></i></a>' +
            '</div>' +
            '</div>' +
            '</li>',
            itemPrepend: false,
            removeConfirmation: false,
            startImageRenderer: true,
            synchronImages: true,
            canvasImage: {
                width: null,
                height: null
            },
            _selectors: {
                list: '.fileuploader-items-list',
                item: '.fileuploader-item',
                start: '.fileuploader-action-start',
                retry: '.fileuploader-action-retry',
                remove: '.fileuploader-action-remove'
            },
            beforeShow: function(parentEl, newInputEl, inputEl) {
                // your callback here
            },
            onItemShow: function(item, listEl, parentEl, newInputEl, inputEl) {
                if(item.choosed){
                    item.html.find('.column-actions').prepend(
                        '<a class="fileuploader-action fileuploader-action-start" title="Start upload" style="display: none"><i></i></a>'
                    );

                    $('#submit-document-revision').html(
                        '<a class="btn btn-sm btn-primary" onclick="startUpload(\'once\');">Ngarko</a> '
                    );
                }

            },
            onItemRemove: function(itemEl, listEl, parentEl, newInputEl, inputEl) {
                itemEl.children().animate({'opacity': 0}, 200, function() {
                    setTimeout(function() {
                        itemEl.slideUp(200, function() {
                            itemEl.remove();
                            $('#submit-document-revision').html("");
                        });
                    }, 100);
                });
            },
            onImageLoaded: function(itemEl, listEl, parentEl, newInputEl, inputEl) {
                // your callback here
            },
        },
        upload: {
            url: '?efilemanager/upload_version',
            data: {},
            type: 'POST',
            enctype: 'multipart/form-data',
            start: false,
            synchron: true,
            beforeSend: function(item, listEl, parentEl, newInputEl, inputEl) {
                var dataString = getFormsFilledData($('.formHtml'));
                dataString += "&parent_id="+version_obj.key;
                dataString += "&documentCategory="+selectedCategory(documentVersionSelectors.selectId).value;
                item.upload.data.formData = window.btoa(dataString);

                if(!validateForms($('.formHtml'))){
                    stopFocus = 0;
                    return false;
                }

                return true;
            },
            onSuccess: function(data, item, listEl, parentEl, newInputEl, inputEl, textStatus, jqXHR) {
                data = JSON.parse(data);
                if(data.error == 0){
                    item.remove();
                    if(uploadMode == 'once'){
                        $('#add_version_modal').modal('hide');
                    }else{

                    }
                }else{

                }
                bootbox.alert(data.message);

            },
            onError: function(item, listEl, parentEl, newInputEl, inputEl, jqXHR, textStatus, errorThrown) {
                var progressBar = item.html.find('.progress-bar2');

                if(progressBar.length > 0) {
                    progressBar.find('span').html(0 + "%");
                    progressBar.find('.fileuploader-progressbar .bar').width(0 + "%");
                    item.html.find('.progress-bar2').fadeOut(400);
                }

                item.upload.status != 'cancelled' && item.html.find('.fileuploader-action-retry').length == 0 ? item.html.find('.column-actions').prepend(
                    '<a class="fileuploader-action fileuploader-action-start" title="Start upload" style="display: none"><i></i></a>'
                ) : null;
            },
            onProgress: function(data, item, listEl, parentEl, newInputEl, inputEl) {
                var progressBar = item.html.find('.progress-bar2');

                if(progressBar.length > 0) {
                    progressBar.show();
                    progressBar.find('span').html(data.percentage + "%");
                    progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
                }
            },
            onComplete: function(listEl, parentEl, newInputEl, inputEl, jqXHR, textStatus) {
                // your callback here
            },
        },

        dragDrop: {
            // set drag&drop container {null, String, jQuery Object}
            // example: 'body'
            // example: $('body')
            container: null,

            // Callback fired on entering with dragged files the drop container
            onDragEnter: function(event, listEl, parentEl, newInputEl, inputEl) {
                // callback will go here
            },

            // Callback fired on leaving with dragged files the drop container
            onDragLeave: function(event, listEl, parentEl, newInputEl, inputEl) {
                // callback will go here
            },

            // Callback fired on dropping the dragged files in drop container
            onDrop: function(event, listEl, parentEl, newInputEl, inputEl) {
                // callback will go here
            },

        },

        onSelect: function(item, listEl, parentEl, newInputEl, inputEl) {
            $('#drop-document-version-area').attr('class', 'col-md-4');
            $('#document-revision-specifications-area').show();

            renderFilePreferencesView(documentVersionSelectors, {
                selectStatus: 'disabled',
                documentId: version_obj.key
            });

        },

        afterSelect: function(listEl, parentEl, newInputEl, inputEl) {

        },

        onRemove: function(item, listEl, parentEl, newInputEl, inputEl) {

            return true;
        },
        onEmpty: function(listEl, parentEl, newInputEl, inputEl) {

        }


    };

    $('#file-upload-input').fileuploader(documentUploadSettings);

    $('#revision-file-upload-input').fileuploader(documentVersionUploadSettings);
})();
