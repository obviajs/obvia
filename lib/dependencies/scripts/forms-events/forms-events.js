/**
 * Forms Events
 * Kreatx 2017
 */
(function () { 
    /**
     * Toastr Config
     */
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "800",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    /**
     * Extends an object
     * @param {object} child object
     * @param {object} parent object
     */
    function assignPrototype(child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    }

    //Cached Selected Forms 
    var currentSelectedForms;

    //Bind two select together
    function bind(autocomplete1, autocomplete2, request, args) {
        autocomplete1.$el.on('change', function () {
            request.call(this, args[0].call(autocomplete1), args[1], args[2]).then(function (fields) {
                autocomplete2.setOptions(fields.map(function (field) {
                    return {
                        value: field.form_field_id,
                        text: field.id,
                        type: field.type || '',
                        friendly: field.label
                    }
                }));
            });
        })
    }

    function unbind(autocomplete) {
        autocomplete.$el.off('change');
    }

    //Get window form_variables globals
    function getFormVariables(selectedForms, callback) {
        window.form_variables = {};
        var forms = Object.keys(JSON.parse(selectedForms));
        AJAX.getFormVariables(forms).then(function (response) { 
            for (var form in response) {
                response[form].forEach(function (item) {
                    try {
                        eval(base64_decode(item));
                    } catch (error) {
                        //skip
                    }
                    
                });
            }

            callback();
        }).catch(function (response) { 
            toastr.error(response.message);
        });
    }

    //truncate string
    function truncate(str, limit) {
        var ending = '...';
        if (str.length > limit) {
            return str.substring(0, limit - ending.length) + ending;
        } else {
            return str;
        }
    }

    //createFile
    function createFile() {
        GUI.IDE.codeEditorWrapper.$el.append("<div id='spinner' class='spinner'></div>");

        GUI.IDE.versionNameModal.footerComponent([
            new Button('enter-name', 'Save <i class="fa fa-check" aria-hidden="true"></i>', 'btn btn-default btn-sm', {}, '', function () {
                if (GUI.IDE.versionNameInput.getText() == '') {
                    toastr.error("Enter a version name");
                    return;
                }

                AJAX.createFile(
                    GUI.IDE.formSelect.getSelectedVal(),
                    GUI.IDE.fieldSelect.getSelectedVal(),
                    GUI.IDE.eventSelect.getSelectedVal(),
                    GUI.IDE.versionNameInput.getText()
                ).then(function (response) {
                    GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                    GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', '');
                    GUI.IDE.codeEditor.codeMirrorInstance.getDoc().setValue(base64_decode(response.content));
                    GUI.IDE.codeEditor.setPanelText("Working on <b><i>" + GUI.IDE.formSelect.getSelectedFriendlyName() + "</i></b> - <b> " + GUI.IDE.fieldSelect.getSelectedFriendlyName() + " </b> <span class='label label-warning'>" + GUI.IDE.eventSelect.getSelectedFriendlyName() + "</span> event <span class='pull-right'><a href='javascript:void(0)' id='show-versions'>" + response.version + "</a></span>");
                    GUI.IDE.versionsBrowser.addFiles(response.versions);
                    GUI.IDE.versionNameModal.hide();
                    State.setState('selectedVersion', GUI.IDE.versionsBrowser.files[0].id);
                }).catch(function (response) {
                    GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                    toastr.error(response.message);

                    GUI.IDE.versionNameModal.hide();
                });
            })
        ]);

        GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
        GUI.IDE.versionNameModal.show();
    }

    //load file
    function loadFile(version) {
        GUI.IDE.codeEditorWrapper.$el.append("<div id='spinner' class='spinner'></div>");

        AJAX.loadFile(
            GUI.IDE.formSelect.getSelectedVal(),
            GUI.IDE.fieldSelect.getSelectedVal(),
            GUI.IDE.eventSelect.getSelectedVal(),
            version || ''
        )
        .then(function (response) {
            GUI.IDE.currentSelected = {
                form: GUI.IDE.formSelect.getSelectedVal(),
                field: GUI.IDE.fieldSelect.getSelectedVal(),
                event: GUI.IDE.eventSelect.getSelectedVal()
            };
            
            GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
            GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', '');
            State.setState('freshApplicationState', false);

            if (response.content) {
                //single version first time
                GUI.IDE.codeEditor.codeMirrorInstance.getDoc().setValue(base64_decode(response.content));
                GUI.IDE.codeEditor.setPanelText("Working on <b><i>" + GUI.IDE.formSelect.getSelectedFriendlyName() + "</i></b> - <b> " + GUI.IDE.fieldSelect.getSelectedFriendlyName() + " </b> <span class='label label-warning'>" + GUI.IDE.eventSelect.getSelectedFriendlyName() + "</span> event <span class='pull-right'><a href='javascript:void(0)' id='show-versions'>" + response.version + "</a></span>");
                
                if (response.hasOwnProperty('versions')) {
                    versions = response.versions;
                    //multiple versions found
                    GUI.IDE.versionsModal.footerComponent([
                        new Button('new-version', 'New <i class="fa fa-plus" aria-hidden="true"></i>', 'btn btn-default btn-sm', {}, '', function () {
                            GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                            GUI.IDE.versionsModal.hide();
                            createFile();
                            GUI.IDE.saveBtn.enable();
                            GUI.IDE.removeBtn.enable();
                            GUI.IDE.deployBtn.enable();
                        }),
                        new Button('pick-version', 'Pick <i class="fa fa-chevron-right" aria-hidden="true"></i>', 'btn btn-default btn-sm', {}, '', function () {
                            GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                            GUI.IDE.versionsModal.hide();
                            State.setState('selectedVersion', GUI.IDE.versionsBrowser.selectedVersion);
                            loadFile(GUI.IDE.versionsBrowser.selectedVersion);
                            GUI.IDE.saveBtn.enable();
                            GUI.IDE.removeBtn.enable();
                            GUI.IDE.deployBtn.enable();
                        }),
                        new Button('diff', 'Diff <i class="fa fa-code-fork" aria-hidden="true"></i>', 'btn btn-sm btn-warning', {}, 'Diff with current version', function () {
                            AJAX.loadFile(
                                GUI.IDE.formSelect.getSelectedVal(),
                                GUI.IDE.fieldSelect.getSelectedVal(),
                                GUI.IDE.eventSelect.getSelectedVal(),
                                GUI.IDE.versionsBrowser.selectedVersion
                            ).then(function (response) {
                                GUI.IDE.versionsModal.hide();
                                GUI.IDE.codeEditor.mergeWith(base64_decode(response.content), response.version);
                            })
                                .catch(function (response) {
                                    GUI.IDE.versionsModal.hide();
                                    toastr.error(response.message);
                                });
                        }, true)
                    ]
                    );
                    GUI.IDE.versionsBrowser.selectedVersion = 0;
                    GUI.IDE.versionsBrowser.addFiles(versions);
                }
            } else {
                var versions = response.versions;
                //multiple versions found
                GUI.IDE.versionsModal.footerComponent([
                    new Button('new-version', 'New <i class="fa fa-plus" aria-hidden="true"></i>', 'btn btn-default btn-sm', {}, '', function () {
                        GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                        GUI.IDE.versionsModal.hide();
                        createFile();
                        GUI.IDE.saveBtn.enable();
                        GUI.IDE.removeBtn.enable();
                        GUI.IDE.deployBtn.enable();
                    }),
                    new Button('pick-version', 'Pick <i class="fa fa-chevron-right" aria-hidden="true"></i>', 'btn btn-default btn-sm', {}, '', function () {
                        GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                        GUI.IDE.versionsModal.hide();
                        State.setState('selectedVersion', GUI.IDE.versionsBrowser.selectedVersion);
                        loadFile(GUI.IDE.versionsBrowser.selectedVersion);
                        GUI.IDE.saveBtn.enable();
                        GUI.IDE.removeBtn.enable();
                        GUI.IDE.deployBtn.enable();
                    }),
                    new Button('diff', 'Diff <i class="fa fa-code-fork" aria-hidden="true"></i>', 'btn btn-sm btn-warning', {}, 'Diff with current version', function () {
                        AJAX.loadFile(
                            GUI.IDE.formSelect.getSelectedVal(),
                            GUI.IDE.fieldSelect.getSelectedVal(),
                            GUI.IDE.eventSelect.getSelectedVal(),
                            GUI.IDE.versionsBrowser.selectedVersion
                        ).then(function (response) { 
                            GUI.IDE.versionsModal.hide();
                            GUI.IDE.codeEditor.mergeWith(base64_decode(response.content), response.version);
                        })
                        .catch(function (response) {
                            GUI.IDE.versionsModal.hide();
                            toastr.error(response.message);
                        });
                    }, true)
                ]
                );
                GUI.IDE.versionsModal.show();
                GUI.IDE.versionsBrowser.selectedVersion = 0;
                GUI.IDE.versionsBrowser.addFiles(versions);
            }

        }).catch(function (response) {
            GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
            toastr.error(response.message);
        });
    }

    /**
     * AJAX REQUESTS
     */

    var AJAX = {
        getFields: function (id, arr = [], directive) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/getFormFields/' + id;
                    var postData = {};

                    if (arr.length > 0) {
                        url = '?forms/getFormFields/' + id;
                        postData = JSON.stringify(arr);
                    }

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: { forms: postData, directive: directive },
                        success: function (response) {
                            resolve(response)
                        }
                    });
                });
            return request;
        },
        getEvents: function (type) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/getEvents';
                    var postData = {
                        type: type
                    }

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: postData,
                        success: function (response) {
                            resolve(response)
                        }
                    });
                });
            return request;
        },
        createFile: function (selectedForm = '', selectedField = '', selectedEvent = '', versionName) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/createScriptFile';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            selectedForm: selectedForm,
                            selectedField: selectedField,
                            selectedEvent: selectedEvent,
                            versionName: versionName,
                            id_process: id_process
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({
                                    message: response.message
                                });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({
                                message: "An error occured on server"
                            });
                        }
                    });
                });
            return request;
        },
        loadFile: function (selectedForm = '', selectedField = '', selectedEvent = '', version = '') {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/loadScriptFile';
                
                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            selectedForm: selectedForm,
                            selectedField: selectedField,
                            selectedEvent: selectedEvent,
                            version: version,
                            id_process: id_process 
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({ message: response.message });
                            }
                            
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({ message: "An error occured on server" });
                        }
                    });
                });
            return request;
        },
        saveFile: function (currentSelected, content, versionName) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/saveScriptFile';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            selectedForm: currentSelected.form,
                            selectedField: currentSelected.field,
                            selectedEvent: currentSelected.event, 
                            content: content,
                            versionName: versionName,
                            id_process: id_process
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({ message: response.message });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({ message: "An error occured on server" });
                        }
                    });
                });
            return request;
        },
        saveGlobalFile: function (content) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/saveGlobalFile';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            content: content
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({ message: response.message });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({ message: "An error occured on server" });
                        }
                    });
                });
            return request;
        },
        deployFile: function (currentSelected) {
             var request =
                 new Promise(function (resolve, reject) {
                    var url = '?forms/deployScriptFile';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            id_revision: currentSelected,
                            id_process: id_process
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({
                                    message: response.message
                                });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({
                                message: "An error occured on server"
                            });
                        }
                    });
                });
            return request;
        },
        deleteFile: function (currentSelected) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/deleteScriptFile';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            id_revision: currentSelected,
                            id_process: id_process
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({
                                    message: response.message
                                });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({
                                message: "An error occured on server"
                            });
                        }
                    });
                });
            return request;
        },
        getFormVariables: function (forms) {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/loadHtmlElementsJSSelectors';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            forms: forms 
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response.data);
                            } else {
                                reject({ message: response.message });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({ message: "An error occured on server" });
                        }
                    });
                });
            return request;
        },
        getGlobalFile: function () {
            var request =
                new Promise(function (resolve, reject) {
                    var url = '?forms/getGlobalFile';

                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                        
                        },
                        success: function (response) {
                            if (response.error == 0) {
                                resolve(response);
                            } else {
                                reject({
                                    message: response.message
                                });
                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject({
                                message: "An error occured on server"
                            });
                        }
                    });
                });
            return request;
        }
    }

    /**
     * Application Store
     */

    var Store = function (store) {
        if (!store)
            store = {};

        this.setState = function (key, value) {
            store[key] = value;

            return this;
        }

        this.getState = function (key) {
            if (!key)
                return store;
            
            if (store.hasOwnProperty(key))
                return store[key];
            else return null;
        }
    }
    var State = new Store({
        'namespace': 'local',
        'freshApplicationState': true
    });

    /**
     *  GUI elements 
     */
    var GUI = {
        main: $('#forms-events-section'),
        mainLink: '#forms-events-href',
        IDE: {
            fullScreenState: false,
            tab: null,
            codeEditorWrapper: null,
            codeEditor: null,
            treeWrapper: null,
            tree: null,
            variablesTreeWrapper: null,
            variablesTree: null,
            formSelect: null,
            fieldSelect: null,
            eventSelect: null,
            currentSelected: null,
            saveBtn: null,
            loadBtn: null,
            versionsModal: null,
            versionsBrowser: null,
            versionNameModal: null,
            versionNameInput: null,
            closeMergeViewBtn: null,
            closeGlobalViewBtn: null,
            deployBtn: null,
            removeBtn: null,
            infoBtn: null,
            globalBtn: null,
            logo: null,
            createFormSelect: function () {
                var options = [];
                for (var i in selectedForms) {
                    options.push({
                        value: i,
                        text: "form_" + i,
                        type: 'form',
                        friendly: selectedForms[i].form_name
                    })
                }

                this.formSelect = new AutoCompleteBtn('forms-select', options, { width: '30%' }, '--- Zgjidhni Formen ---', true);

                return this.formSelect;
            },
            createFieldSelect: function (fields = []) {
                var options = [];
                this.fieldSelect = new AutoCompleteBtn('fields-select', fields.map(function (field) { 
                    return {
                        value: field.form_field_id,
                        text: field.id,
                        type: field.type,
                        friendly: field.label,
                    }
                }), { width: '30%' }, '--- Zgjidhni Fushen ---', true);

                return this.fieldSelect;
            },
            createEventSelect: function (events = []) {
                var options = [];
                this.eventSelect = new AutoCompleteBtn('events-select', events.map(function (event) {
                    return {
                        value: event.id,
                        text: event.label
                    }
                }), { width: '30%' }, '--- Zgjidhni Eventin ---', true);

                return this.eventSelect;
            },
            createCodeEditor: function () {
                this.codeEditor = new CodeEditor('code-editor', {}, '//Choose an event to begin with (F11 to go fullscreen) ...');
                return this.codeEditor; 
            },
            createTree: function (dbclickCallback) {
                this.tree = new Tree('browser-tree', '?forms/browseEvents/', null, dbclickCallback, '215px');
               
                return this.tree;
            },
            createVariablesTree: function (data, dbclickCallback) {
                this.variablesTree = new Tree('variables-tree', '', data, dbclickCallback, '120px');

                return this.variablesTree;
            },
            addFullscreenBtn: function () {
                var fscBtn = new Button(
                    'toggle-fullscreen',
                    '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
                    'btn btn-xs btn-default pull-right',
                    {
                        'margin-top': '5px',
                        'margin-right': '-8px'
                    },
                    '',
                    function () {
                        if (!GUI.IDE.fullScreenState) {
                            this.codeMirrorState = {
                                scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset,
                                width: GUI.main.attr('width'), height: GUI.main.attr('height')
                            };

                            GUI.main.attr('width', '');
                            GUI.main.attr('height', 'auto');
                            GUI.main.addClass('CodeMirror-fullscreen');
                            document.documentElement.style.overflow = "hidden";
                            GUI.IDE.codeEditor.codeMirrorInstance.setSize(null, window.innerHeight - 110);
                            GUI.IDE.codeEditor.codeMirrorInstance.refresh();

                            //is merge view ?
                            if (GUI.IDE.codeEditor.mergeView != null) {
                                GUI.IDE.codeEditor.mergeView.editor().setSize(null, window.innerHeight - 110);
                                GUI.IDE.codeEditor.mergeView.rightOriginal().setSize(null, window.innerHeight - 110);
                                GUI.IDE.codeEditor.mergeView.wrap.style.height = window.innerHeight - 110 + "px";
                            }

                            GUI.IDE.tree.initSlimScroll({
                                height: window.innerHeight - parseInt(GUI.IDE.variablesTree.height.replace('px', '')) - 150 + 'px',
                                size: '5px',
                                color: '#CCCCCC',
                                railColor: '#CCCCCC',
                                railVisible: true
                            });

                            GUI.IDE.variablesTree.initSlimScroll({
                                height: parseInt(GUI.IDE.variablesTree.height.replace('px', '')) + 90 + 'px',
                                size: '5px',
                                color: '#CCCCCC',
                                railColor: '#CCCCCC',
                                railVisible: true
                            });


                            fscBtn.setHtml('<i class="fa fa-window-minimize" aria-hidden="true"></i>');
                            //fscBtn.setTooltip('Minimise');
                            GUI.IDE.fullScreenState = true;
                        } else {
                            GUI.main.attr('width', this.codeMirrorState.width);
                            GUI.main.attr('height', this.codeMirrorState.height);
                            GUI.main.removeClass('CodeMirror-fullscreen');
                            document.documentElement.style.overflow = "";
                            window.scrollTo(this.codeMirrorState.scrollLeft, this.codeMirrorState.scrollTop);
                            GUI.IDE.codeEditor.codeMirrorInstance.setSize(null, 300);
                            GUI.IDE.codeEditor.codeMirrorInstance.refresh();

                            //is merge view ?
                            if (GUI.IDE.codeEditor.mergeView != null) {
                                GUI.IDE.codeEditor.mergeView.editor().setSize(null, 300);
                                GUI.IDE.codeEditor.mergeView.rightOriginal().setSize(null, 300);
                                GUI.IDE.codeEditor.mergeView.wrap.style.height = 300 + "px";
                            }

                            GUI.IDE.tree.initSlimScroll({
                                height: GUI.IDE.tree.height,
                                size: '5px',
                                color: '#CCCCCC',
                                railColor: '#CCCCCC',
                                railVisible: true
                            });

                            GUI.IDE.variablesTree.initSlimScroll({
                                height: GUI.IDE.variablesTree.height,
                                size: '5px',
                                color: '#CCCCCC',
                                railColor: '#CCCCCC',
                                railVisible: true
                            });

                            fscBtn.setHtml('<i class="fa fa-window-maximize" aria-hidden="true"></i>');
                            //fscBtn.setTooltip('Maximise');
                            GUI.IDE.fullScreenState = false;
                        }
                    
                    });

                return fscBtn.render();
            },
            addSaveBtn: function () {
                this.saveBtn = new Button(
                    'save-btn',
                    '<i class="fa fa-floppy-o" aria-hidden="true"></i> Save',
                    'btn btn-xs btn-default pull-right',
                    {
                        'margin-top': '5px',
                        'margin-right': '5px'
                    },
                    '',
                    function () {
                        //check for linter errors
                        if (GUI.IDE.codeEditor.errors.length > 2) {
                            toastr.error("Your code contains errors. Fix them and then save");
                            return;
                        }

                        GUI.IDE.codeEditorWrapper.$el.append("<div id='spinner' class='spinner'></div>");
                        GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', 'nocursor');

                        //local namespace
                        if (State.getState('namespace') == 'local') {
                            GUI.IDE.versionNameModal.footerComponent([
                                new Button('enter-name', 'Ok <i class="fa fa-check" aria-hidden="true"></i>', 'btn btn-default btn-sm', {}, '', function () {
                                    if (GUI.IDE.versionNameInput.getText() == '') {
                                        toastr.error("Enter a version name");
                                        return;
                                    }

                                    AJAX.saveFile(
                                        GUI.IDE.currentSelected,
                                        base64_encode(GUI.IDE.codeEditor.codeMirrorInstance.getValue()),
                                        GUI.IDE.versionNameInput.getText()
                                    ).then(function (response) {
                                        var files = response.versions;
                                        GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                                        GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', '');
                                        GUI.IDE.codeEditor.setPanelText("Working on <b><i>" + GUI.IDE.formSelect.getSelectedFriendlyName() + "</i></b> - <b> " + GUI.IDE.fieldSelect.getSelectedFriendlyName() + " </b> <span class='label label-warning'>" + GUI.IDE.eventSelect.getSelectedFriendlyName() + "</span> event <span class='pull-right'><a href='javascript:void(0)' id='show-versions'>" + response.version + "</a></span>");
                                        GUI.IDE.versionNameModal.hide();
                                        GUI.IDE.versionsBrowser.addFiles(files);
                                        State.setState('selectedVersion', GUI.IDE.versionsBrowser.files[0].id);
                                        toastr.success(response.message);
                                    }).catch(function (response) {
                                        GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                                        GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', '');
                                        GUI.IDE.versionNameModal.hide();
                                        toastr.error(response.message);
                                    });
                                })
                            ]);

                            GUI.IDE.versionNameModal.show();
                        } else if (State.getState('namespace') == 'global') {
                            //global namespace
                            AJAX
                                .saveGlobalFile(base64_encode(GUI.IDE.codeEditor.codeMirrorInstance.getValue()))
                                .then(function (response) { 
                                    if (response.error == 0) {
                                        toastr.success(response.message);
                                    } else {
                                        toastr.error(response.message);
                                    }
                                })
                                .catch(function (response) {
                                    toastr.error(response.message);
                                })
                        }
                       
                        GUI.IDE.codeEditorWrapper.$el.find("#spinner").remove();
                    }
                );
                this.saveBtn.render();
                this.saveBtn.disable();

                return this.saveBtn.$el;
            },
            addDeployBtn: function () {
                this.deployBtn = new Button('deploy-script', '<i class="fa fa-rocket" aria-hidden="true"></i> Deploy', 'btn btn-xs btn-default pull-right', {
                    'margin-top': '5px',
                    'margin-right': '5px'
                }, '', function () {
                    AJAX.deployFile(State.getState('selectedVersion'))
                        .then(function (response) {
                            if (response.error == 0) {
                                toastr.success(response.message);
                                var files = GUI.IDE.versionsBrowser.files.map(function (file) { 
                                    if (file.id != State.getState('selectedVersion')) {
                                        file.deployed = false;
                                    } else {
                                        file.deployed = true;
                                    }

                                    return file;
                                });
                               
                                GUI.IDE.versionsBrowser.addFiles(files);
                            } else {
                                toastr.error(response.message);
                            }
                        })
                        .catch(function (response) {
                            toastr.error(response.message);
                        });
                    
                }, true);
                
                this.deployBtn.render();
                return this.deployBtn.$el;
            },
            addRemoveBtn: function () {
                this.removeBtn = new Button('remove-script', '<i class="fa fa-trash" aria-hidden="true"></i> Delete', 'btn btn-xs btn-default pull-right', {
                    'margin-top': '5px',
                    'margin-right': '5px'
                }, '', function () {
                    var sticky = toastr.warning(
                        "<br /><button type='button' id='confirmationRevertYes' class='btn clear'>Yes</button>",
                        'Are you sure you want to delete this script version ?',
                        {
                            tapToDismiss: false,
                            closeButton: true,
                            allowHtml: true,
                            timeOut: 0,
                            extendedTimeOut: 0,
                            onShown: function (toast) {
                                $("#confirmationRevertYes").click(function () {
                                    $('.toast').remove();
                                    AJAX.deleteFile(State.getState('selectedVersion')).then(function (response) {
                                        if (response.error == 0) {
                                            toastr.success(response.message);
                                       
                                            //remove file entry form versions
                                            var files = GUI.IDE.versionsBrowser.files.filter(function (version) {
                                                return version.id != State.getState('selectedVersion');
                                            });
                                    
                                            GUI.IDE.versionsBrowser.addFiles(files);

                                            GUI.IDE.versionsModal.show();
                                            GUI.IDE.codeEditor.codeMirrorInstance.setValue(GUI.IDE.codeEditor.storage);
                                            GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', 'nocursor');
                                            GUI.IDE.codeEditor.statuslabel.innerHTML = '';

                                            GUI.IDE.saveBtn.disable();
                                            GUI.IDE.deployBtn.disable();
                                            GUI.IDE.removeBtn.disable();

                                        } else {
                                            toastr.error(response.message);
                                        }
                                    }).catch(function (response) { 
                                        toastr.error(response.message);
                                    })
                                });
                            }
                        }
                    );
                }, true);

                this.removeBtn.render();
                return this.removeBtn.$el;
            },
            addInfoBtn: function () {
                this.infoBtn = new Button('help', '<i class="fa fa-question" aria-hidden="true"></i> Help', 'btn btn-xs btn-default pull-right', {
                    'margin-top': '5px',
                    'margin-right': '5px'
                }, '', function () {

                });

                this.infoBtn.render();
                return this.infoBtn.$el;
            },
            addGlobalBtn: function () {
                this.globalBtn = new Button('global-namespace', '<i class="fa fa-globe" aria-hidden="true"></i> Global Functions', 'btn btn-xs btn-default pull-right', {
                    'margin-top': '5px',
                    'margin-right': '5px'
                }, '', function () {
                    State.setState('panel', GUI.IDE.codeEditor.statuslabel.innerHTML);
                    State.setState('editor', GUI.IDE.codeEditor.codeMirrorInstance.getValue());
                    State.setState('namespace', 'global');

                    GUI.IDE.globalBtn.disable();

                    var target = GUI.IDE.codeEditorWrapper.$el
                        .find('.CodeMirror');

                    target[0].setAttribute('id', this.id + '-code-mirror');
                    
                    AJAX
                        .getGlobalFile()
                        .then(function (response) { 
                            if (response.error == 0) {
                                GUI.IDE.saveBtn.enable();
                                GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', false);
                                GUI.IDE.codeEditor.codeMirrorInstance.setValue(base64_decode(response.content));

                                //panel
                                var node = $('#' + GUI.IDE.codeEditor.id + "status-panel");
                                node
                                    .find('.statusBar')    
                                    .html('<div class="label label-warning pull-right">Global Namespace</div>');

                                //top gui
                                GUI.IDE.removeBtn.disable();
                                GUI.IDE.loadBtn.disable();
                                GUI.IDE.deployBtn.disable();

                                $('#' + target[0].id).css({
                                    'border-top': 'solid 3px #DE3E2C'
                                });
                                GUI.IDE.closeGlobalViewBtn.$el.css({
                                    'display': ''
                                });
                                
                            } else {
                                toastr.error(response.message);
                            }
                        })
                        .catch(function (response) { 
                            toastr.error(response.message);
                        });

                });

                this.globalBtn.render();
                return this.globalBtn.$el;
            },
            addLogo: function () { 
                var logo = "<span style='position:absolute; left:5px; top:5px;'><span class='label label-warning' style='font-size:13px' >Project Diesis #</span> <i><small>Beta<small></i></span>";

                return $(logo);
            },
            addCloseGlobalViewBtn: function () {
                this.closeGlobalViewBtn = new Button('closeGlobalViewBtn', '<i class="fa fa-times" aria-hidden="true"></i>', 'btn btn-danger btn-xs', {
                    'position': 'absolute',
                    'margin-top': '14px',
                    'right': '0',
                    'display': 'none'
                }, '', function () {
                    $(this).hide();
                    var target = GUI.IDE.codeEditorWrapper.$el
                        .find('.CodeMirror');

                    $('#' + target[0].id).css({
                        'border-top': 'none'
                    });

                    State.setState('namespace', 'local');

                    GUI.IDE.codeEditor.codeMirrorInstance.setValue(State.getState('editor'));
                    GUI.IDE.codeEditor.setPanelText(State.getState('panel'));

                    GUI.IDE.globalBtn.enable();
                    GUI.IDE.loadBtn.enable();
                    
                    if (State.getState('freshApplicationState') === false) {
                        GUI.IDE.deployBtn.enable();
                        GUI.IDE.removeBtn.enable();    
                    } else {
                        GUI.IDE.saveBtn.disable();
                        GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', 'true');
                    }
                });
                
                return this.closeGlobalViewBtn;
            },
            render: function () {
                var _self = this;

                //versions modal
                GUI.IDE.versionsModal = new Modal('versions-modal', 'Versions');
                GUI.IDE.versionsModal.render();
                GUI.IDE.versionsBrowser = new VersionBrowser('versions-browser');
                GUI.IDE.versionsModal.appendComponent(GUI.IDE.versionsBrowser);

                GUI.IDE.versionNameModal = new Modal('version-name', 'Enter Version Name', '100px');
                GUI.IDE.versionNameModal.render();
                GUI.IDE.versionNameInput = new TextInput('version-name');
                GUI.IDE.versionNameModal.appendComponent(GUI.IDE.versionNameInput);

                //action buttons
                GUI.main.html(this.addFullscreenBtn());
                GUI.main.append(this.addLogo());
                GUI.main.append(this.addInfoBtn());
                GUI.main.append(this.addSaveBtn());
                GUI.main.append(this.addRemoveBtn());
                GUI.main.append(this.addDeployBtn());
                GUI.main.append(this.addGlobalBtn());

                GUI.main.append(
                    $("<div>")
                        .attr('id', 'container')
                        .attr('class', 'row')
                        .append("<div id='main' class='col-md-10'></div><div id='tree-container' class='col-md-2'></div>")
                );
                
                //components tab
                this.tab = new Bar('actions-tab', { 'padding': '10px', 'padding-top': '0px', 'top': '-6px' }, 'col-md-12');
                GUI.main.find("#main").append(this.tab.render());
                
                var checkbox = new Component('form-only');
                this.tab.appendComponent(checkbox, "<label><input type='checkbox' id='form-only-checkbox'> Form Event</label>");

                this.tab.appendComponent(this.createFormSelect());
                this.tab.appendComponent(this.createFieldSelect());
                this.tab.appendComponent(this.createEventSelect());
                this.loadBtn = new Button('begin', '<i class="fa fa-download" aria-hidden="true"></i> Load', 'btn btn-default btn-sm', {}, '', function (e) {
                    loadFile();
                });
                this.tab.appendComponent(this.loadBtn);

                //close merge view button
                this.closeMergeViewBtn = new Button('closeMergeViewBtn', '<i class="fa fa-times" aria-hidden="true"></i>', 'btn btn-danger btn-xs', {
                    'position': 'absolute', 
                    'margin-top': '14px',
                    'right': '0',
                    'display': 'none'
                }, '', function () {
                    $(this).hide();
                    var target = GUI.IDE.codeEditorWrapper.$el
                        .find('.CodeMirror');

                    $('#' + target[0].id).css({ 'border-top': 'none' });

                    GUI.IDE.codeEditor
                        .setStorage(GUI.IDE.codeEditor.mergeView.editor().getValue())
                        .clearMergeView()
                        .initCodeMirror();
                    
                    GUI.IDE.codeEditor.codeMirrorInstance.setOption('readOnly', false);
                    //fullscreen
                    if (GUI.IDE.fullScreenState) {
                        GUI.IDE.codeEditor.codeMirrorInstance.setSize(null, window.innerHeight - 110);
                    } else {
                        GUI.IDE.codeEditor.codeMirrorInstance.setSize(null, 300);
                    }  
                    GUI.IDE.saveBtn.enable();
                    GUI.IDE.deployBtn.enable();
                    GUI.IDE.removeBtn.enable();
                    GUI.IDE.loadBtn.enable();
                });
                this.tab.appendComponent(this.closeMergeViewBtn);
                this.tab.appendComponent(this.addCloseGlobalViewBtn());

                //form event checkbox
                checkbox.$el.find('#form-only-checkbox').on('change', function () {
                    if (this.checked) {
                        _self.fieldSelect
                            .deselect()
                            .disable();
                        _self.eventSelect    
                            .deselect()
                        
                        unbind(_self.fieldSelect);
                        bind(_self.formSelect, _self.eventSelect, AJAX.getEvents, [_self.formSelect.getSelectedType]);
                        _self.formSelect.$el.trigger('change');
                    } else {
                        _self.fieldSelect
                            .enable();
                        _self.eventSelect
                            .setOptions([]);
                        unbind(_self.formSelect);
                        bind(_self.formSelect, _self.fieldSelect, AJAX.getFields, [_self.formSelect.getSelectedVal, [], 'no-label']);
                        bind(_self.fieldSelect, _self.eventSelect, AJAX.getEvents, [_self.fieldSelect.getSelectedType]);
                        
                    }
                });

                //bind selects 
                bind(this.formSelect, this.fieldSelect, AJAX.getFields, [this.formSelect.getSelectedVal, [], 'no-label']);
                bind(this.fieldSelect, this.eventSelect, AJAX.getEvents, [this.fieldSelect.getSelectedType]);

                //tree
                this.treeWrapper = new Bar('tree-container', { 'padding': '10px', 'padding-top': '0', 'padding-bottom': '0' }, 'col-md-12');
                
                GUI.main.find("#tree-container").append(this.treeWrapper.render());
                //events tripple checkbox
                var ICheckbox = new IndeterminateCheckBox('events-check', ['Unhandled Events', 'Handled Events', 'All Events'], function () {
                    if (ICheckbox.checkedState == 0) {
                        //Unhandled Events
                        GUI.IDE.tree.setDirectives(['unhandled']);
                    } else if (ICheckbox.checkedState == 1) {
                        //Handled Events
                        GUI.IDE.tree.setDirectives(['handled']);
                    } else {
                        //All Events
                        GUI.IDE.tree.setDirectives([]);
                    }
                });
                this.treeWrapper.appendComponent(ICheckbox);

                this.treeWrapper.appendComponent(this.createTree(function (event, data) { 
                    if (data.node.data.type == 'form-event') {
                        GUI.IDE.formSelect.selectVal(data.node.data.parent_key).$el.trigger('change');
                        GUI.IDE.fieldSelect.$el.on('reset', function () {
                            GUI.IDE.fieldSelect.$el.off('reset');
                            checkbox.$el.find('#form-only-checkbox')
                                .prop('checked', true)
                                .trigger('change');
                            
                            GUI.IDE.eventSelect.$el.on('reset', function () {
                                GUI.IDE.eventSelect.selectVal(data.node.key);
                            });
                        });

                        GUI.IDE.eventSelect.$el.on('valueSet', function () {
                            GUI.IDE.eventSelect.$el.off('valueSet');
                            if (GUI.IDE.loadBtn.$el.prop('disabled') == false)
                                setTimeout(function () { GUI.IDE.loadBtn.$el.trigger('click'); }, 500);
                        });
                          
                    } else if (data.node.data.type == 'field-event') {
                        checkbox.$el.find('#form-only-checkbox')
                            .prop('checked', false)
                            .trigger('change'); 
                        GUI.IDE.formSelect.selectVal(data.node.parent.data.parent_key).$el.trigger('change');
                        GUI.IDE.fieldSelect.$el.on('reset', function () { 
                            GUI.IDE.fieldSelect.$el.off('reset');
                            GUI.IDE.fieldSelect.selectVal(data.node.parent.key).$el.trigger('change');
                            GUI.IDE.eventSelect.$el.on('reset', function () {
                                GUI.IDE.eventSelect.selectVal(data.node.key);
                            });   
                        });

                        GUI.IDE.eventSelect.$el.on('valueSet', function () {
                            GUI.IDE.eventSelect.$el.off('valueSet');
                            if (GUI.IDE.loadBtn.$el.prop('disabled') == false)
                                setTimeout(function () { GUI.IDE.loadBtn.$el.trigger('click'); }, 500);
                        });
                    }
                }));

                //variables tree
                this.variableTreeWrapper = new Bar('tree-var-container', { 'padding': '10px', 'padding-bottom': '0', 'margin-top': '0px' }, 'col-md-12');
                GUI.main.find("#tree-container").append(this.variableTreeWrapper.render());

                var iconMappper = {
                    'selector': "resources/inner_resources/efilemanager/img/selector.png",
                    'value': "resources/inner_resources/efilemanager/img/edit.png",
                    'block': "resources/inner_resources/efilemanager/img/container.png",
                    'source': "resources/inner_resources/efilemanager/img/code.png",
                };

                variablesTreeData = [{
                    title: "window", 
                    key: "1",
                    folder: true,
                    expanded: true,
                    data: {
                        text: "window",
                        icon: "resources/inner_resources/efilemanager/img/window.png"
                    },
                    children: [{
                        title: "form_variables",
                        key: "2",
                        folder: true,
                        expanded: true,
                        data: {
                            text: "window.form_variables",
                            icon: "resources/inner_resources/efilemanager/img/terminal.png"
                        },
                        children: []
                    }]
                }];

                var relativeNode = variablesTreeData[0].children[0].children;
                $(document).on('doneGetFormVariables', function () {
                    var i = 0;
                    for (var variable in window.form_variables) {
                        
                        relativeNode.push({
                            title: variable,
                            key: variable,
                            folder: true,
                            expanded: false,
                            data: {
                                text: "window.form_variables." + variable,
                                icon: "resources/inner_resources/efilemanager/img/cogs.png"
                            },
                            children: []
                        });

                        var accessorNode = relativeNode[i].children;

                        for (var accessor in window.form_variables[variable]) {
                            accessorNode.push({
                                title: accessor,
                                key: accessor,
                                data: {
                                    text: "window.form_variables." + relativeNode[i].title + "." + accessor,
                                    icon: iconMappper[accessor]
                                },
                                folder: false
                            });
                        }

                        i++;
                    }

                    if (GUI.IDE.variablesTree != null) {
                        _self.variablesTree.$el.slimScroll({ destroy: true });
                        _self.variableTreeWrapper.removeComponent(GUI.IDE.variablesTree.id);

                    }
                    _self.variableTreeWrapper.appendComponent(_self.createVariablesTree(variablesTreeData, function (event, data) {
                        _self.codeEditor.insertTextAtCursor(data.node.data.text);
                    }));
                });

                //code editor
                this.codeEditorWrapper = new Bar('code-editor-wrapper', { 'padding': '0px', 'top': '-15px' }, 'col-md-12');
                GUI.main.find("#main").append(this.codeEditorWrapper.render());
                this.codeEditorWrapper.appendComponent(this.createCodeEditor());

                //fix for correct render
                setTimeout(function () {
                    _self.codeEditor.codeMirrorInstance.refresh();
                }, 300);
                
            },
        }
    }

    /**
     * This is the main component, other components extend from
     * @param {string} id dom id 
     */
    var Component = function (id) {
        this.$el = null;
        this.id = id;
    }
    
    /**
     * Renders the component
     * @returns {JQuery dom element} 
     */
    Component.prototype.render = function (html) {
        this.$el = $('<div>')
            .attr('id', this.id)
            .html(html);
        
        return this.$el;
    }

    /**
     * This is a Select2 JQuery component
     * @param {string} id Component dom id 
     * @param {Array} options an objects array containing select options
     * @param {object} style css styling object
     * @param {string} placeholder select2 placeholder
     * @param {boolean} friendlyLabel flag for including friendly name label in select options
     */
    var AutoCompleteBtn = function (id, options, style = {}, placeholder, friendlyLabel = false) {
        Component.apply(this, arguments);
        this.options = options;
        this.type = 'AutoCompleteBtn';
        this.config = {
            width: style.width || '100%',
            containerCss: { 'margin-right': '4px' },
            placeholder: placeholder || '--- Ju lutem zgjidhni ---',
            formatResult: function (data) {
                if (!friendlyLabel)
                    return data.text;
                
                return data.text + " <p style='margin-left: 20px' class='label label-default pull-right'>" + $(data.element).data('friendly') + "</p>";
            },
            dropdownAutoWidth: true
        };     
        
        this.render = function () {
            var select = "<select id='" + id + "'>" +
                "<option></option>"; 
                select += this.options.map(function (item) {
                    if (!item.hasOwnProperty('type'))
                        item.type = '';    
                    return "<option data-friendly='"+ item.friendly +"' data-type='" + item.type + "' value='" + item.value + "'>" + item.text + "</option>";
                })
            select += "</select>";

            //call if el exist in dom
            if (this.$el && (this.$el.parents('html').length > 0)) {
                this.$el.html(select);
                this.$el.select2(this.config);
                this.$el.trigger('reset');
            }else
                this.$el = $(select);    
          
            var _self = this;
            this.$el.on('attached', function () {
                _self.$el.select2(_self.config);
            });
            
            return this.$el;
        }

        this.setOptions = function (options) {
            this.options = options;
            this.render();

            return this;
        }

        this.addOption = function (option) {
            this.options.push(option);
            this.render();

            return this;
        }

        this.getSelectedVal = function () {
            return this.$el.select2('val');
        }

        this.getSelectedType = function () {
            return this.$el.select2('data').element[0].dataset.type;
        }

        this.getSelectedText = function () {
            var data = this.$el.select2('data');
            return (data != null) ? data.text: '';
        }

        this.getSelectedFriendlyName = function () {
            var data = this.$el.select2('data');
            return (data != null) ? data.element[0].dataset.friendly : '';
        }

        this.selectVal = function (value, callback) {
            this.$el.select2('val', value)
            if(typeof callback == 'function')
                callback();
            
            this.$el.trigger('valueSet');
            return this;
        }

        this.disable = function () {
            this.$el.select2(this.config).enable(false);

            return this;
        }

        this.enable = function () {
            this.$el.select2(this.config).enable(true);

            return this;
        }

        this.deselect = function () {
            this.$el.select2('val', '');

            return this;
        }
    }
    assignPrototype(AutoCompleteBtn, Component);

    /**
     * This is a bar component
     * @param {string} id component dom id 
     * @param {object} style css styling object
     * @param {string} classList element classes
     * @param {boolean} rowWrapper should the bar/row have a wrapper 
     */
    var Bar = function (id, style, classList, rowWrapper = true) {
        Component.apply(this, arguments);
        this.type = 'Bar';
        this.style = style;

        this.render = function () {
            var html;
            if (rowWrapper) {
                html = "<div class ='row'>" +
                    "<div class='" + classList + "' id='" + id + "'></div>"
                "</div>";
            } else
                html = "<div class='" + classList + "' id='" + id + "'></div>";
            
            this.$el = $(html);
            
            var pointer = rowWrapper ? this.$el.find("#" + id) : this.$el

            pointer
                .css(style)

            return this.$el;
        }

        this.appendComponent = function (component, html) {
            var pointer = rowWrapper ? this.$el.find("#" + id) : this.$el
            pointer.append(component.render(html));
            component.$el.trigger('attached');
            
            return this;
        }

        this.removeComponent = function (componentId) {
            var pointer = rowWrapper ? this.$el.find("#" + id) : this.$el;
            pointer.find("#" + componentId).remove();

            return this;
        }
    }
    assignPrototype(Bar, Component);

    /**
     * This is a code editor component from CodeMirror Library
     * http://codemirror.net/index.html
     * @param {string} id component dom id 
     * @param {object} size editor dimensions
     * @param {string} defaultValue value set on editor init
     * @param {object} config CodeMirror config options 
     */
    var CodeEditor = function (id, size = {}, defaultValue, config) {
        Component.apply(this, arguments);
        this.type = 'CodeEditor';
        this.codeMirrorInstance = null;
        this.storage = defaultValue || "function (event) { \n//enter your code here \n\n}";
        this.statuslabel = null;
        this.errors = [];
        this.mergeView = null;

        var _self = this;

        this.initCodeMirror = function () {
            var _self = this;
            document.getElementById(this.id).innerHTML = '';
            this.codeMirrorInstance = CodeMirror.fromTextArea(document.getElementById(this.id), config || {
                mode: { name: "javascript", globalVars: true },
                lineNumbers: true,
                scrollbarStyle: "simple",
                foldGutter: true,
                gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets: true,
                autoCloseBrackets: true,
                indentWithTabs: true,
                lint: {
                    "getAnnotations": function (cm, updateLinting, options) { 
                        var errors = CodeMirror.lint.javascript(cm, options);
                        updateLinting(errors);
                        _self.errors = errors;
                    },
                    "async": true
                },
                readOnly: 'nocursor',
                extraKeys: {
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function (cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    },
                
                    "Ctrl-Space": "autocomplete",

                    "Alt-F": "findPersistent"
                }
            });

            this.codeMirrorInstance.setValue(this.storage);
            this.codeMirrorInstance.setSize(size.width || '100%', size.height || 300);
            this.statuslabel = this.addPanel();
            if (State.getState('panel')) {
                this.setPanelText(State.getState('panel'));
            }
        }

        this.render = function () {
            this.$el = $('<textarea>')
                .attr('id', this.id);

            //init codemirror
            var _self = this;
            this.$el.on('attached', function () {
                _self.initCodeMirror();
            })
            
            return this.$el;
        }

        this.getStorage = function () {

        }

        this.addPanel = function (text) {
            var node = document.createElement("div");
            node.id = id + "status-panel";
            node.className = "panel bottom";

            var label = node.appendChild(document.createElement("span"));
            label.className = 'statusBar';
            label.innerHTML = text || '';
    
            this.codeMirrorInstance.addPanel(node, { position: 'bottom', stable: true });

            return label;
        }

        this.setPanelText = function (text) {
            this.statuslabel.innerHTML = text;
        }

        this.makeReadOnly = function (lines) {
            this.codeMirrorInstance.on('beforeChange', function (cm, change) {
                if (~lines.indexOf(change.from.line)) {
                    change.cancel();
                }
            });
        }

        this.insertTextAtCursor = function (text) {
            var doc = this.codeMirrorInstance.getDoc();
            var cursor = doc.getCursor();
            //var line = doc.getLine(cursor.line);
            if(cursor.line != 0)
                doc.replaceRange(text, cursor);
        }

        this.mergeWith = function (chosen, chosenName) {
            State.setState('panel', this.statuslabel.innerHTML);

            var current = this.codeMirrorInstance.getValue();
            var target = GUI.IDE.codeEditorWrapper.$el
                .find('.CodeMirror');
            
            target[0].setAttribute('id', this.id + '-code-mirror');
            document.getElementById(target[0].id).innerHTML = '';

            this.mergeView = CodeMirror.MergeView(document.getElementById(target[0].id), {
                value: current,
                origLeft: null,
                orig: chosen,
                lineNumbers: true,
                mode: "javascript",
                highlightDifferences: true,
                connect: "align",
                collapseIdentical: false
            });

            //panel
            var node = $('#' + this.id + "status-panel")
                .find('#show-versions');
            var currentVersionName = node.text();
            node.html('Comparing <span class="label label-warning">' + currentVersionName + '</span> to <span class="label label-warning">' + chosenName + '</span>');
            node.prop('id', '');

            //top gui
            GUI.IDE.saveBtn.disable();
            GUI.IDE.removeBtn.disable();
            GUI.IDE.loadBtn.disable();
            GUI.IDE.deployBtn.disable();

            $('#' + target[0].id).css({
                'border-top': 'solid 3px #DE3E2C'
            });
            GUI.IDE.closeMergeViewBtn.$el.css({'display': ''}); 

            //fullscreen
            if (GUI.IDE.fullScreenState) {
                this.mergeView.editor().setSize(null, window.innerHeight - 110);
                this.mergeView.rightOriginal().setSize(null, window.innerHeight - 110);
                this.mergeView.wrap.style.height = window.innerHeight - 110 + "px";
            } else {
                this.mergeView.editor().setSize(null, size.height || 300);
                this.mergeView.rightOriginal().setSize(null, size.height || 300);
                this.mergeView.wrap.style.height = size.height || 300 + "px";
            }  

            return this;
        }

        this.clearMergeView = function () {
            this.mergeView = null;
            $('#' + this.id + '-code-mirror')
                .parent()
                .remove();

            return this;
        }

        this.setStorage = function (storage) {
            this.storage = storage;

            return this;
        }
    }
    assignPrototype(CodeEditor, Component);

    /**
     * Button Component
     * @param {string} id component id 
     * @param {string} text button text
     * @param {string} classList element classes
     * @param {object} css css styling object
     * @param {string} tooltip button tooltip on hover
     * @param {callback} clickCallback function fired on button click
     * @param {boolean} disabled button status
     */
    var Button = function (id, text, classList, css = {}, tooltip, clickCallback, disabled = false) {
        Component.apply(this, arguments);

        this.render = function () {
            this.$el = $('<button>')
                .attr('id', this.id)
                .html(text)
                .css(css)
                .prop('disabled', disabled)
                .addClass(classList);

            if (tooltip)
                this.setTooltip(tooltip);    
            
            if (typeof clickCallback === 'function') {
                this.$el.on('click', clickCallback);
            }
            
            return this.$el;
        }

        this.setHtml = function (html) {
            this.$el.html(html);

            return this;
        }

        this.setTooltip = function (title) {
            this.$el.attr('data-toggle', 'tooltip').attr('title', title);

            return this;
        }

        this.disable = function () {
            this.$el.prop('disabled', true);
            return this;
        }

        this.enable = function () {
            this.$el.prop('disabled', false);
            return this;
        }
        
    }
    assignPrototype(Button, Component);

    /**
     * This component renders a file browser tree
     * @param {string} id dom component id
     * @param {string} url ajax source url
     * @param {array} data when no url is defined a json array is passed 
     * @param {callback} dbclickCallback double click function firing on tree node double click
     * @param {string} height defines tree height
     * 
     */
    var Tree = function (id, url, data, dbclickCallback, height = '360px') {
        Component.apply(this, arguments);
        var _self = this;

        this.url = url;
        this.directives = [];
        this.currentNode = {
            id_node: 0,
            type: 'form',
            directives: _self.directives
        };
        this.height = height;

        if (url != null && url != '') { 
            //ajax data source
            this.config = {
                source: {
                    url: _self.url,
                    dataType: "json",
                    method: "POST",
                    data: {
                        forms: Object.keys(selectedForms),
                        id_node: 0,
                        directives: _self.directives
                    }
                },
                init: function (event, data, flag) {

                },
                lazyLoad: function (event, data) {
                    data.result = {
                        url: _self.url,
                        data: _self.currentNode,
                        cache: false,
                        method: "POST",
                    };
                },
                click: function (event, data) {
                    _self.currentNode = {
                        id_node: data.node.key,
                        type: data.node.data.type,
                        directives: _self.directives
                    }
                },
                dblclick: dbclickCallback
            };
        } else {
            //json data source
            this.config = {
                source: data,
                dblclick: dbclickCallback
            }
        }
        
        this.render = function () {
            this.$el = $("<div>")
                .attr('id', this.id)
                .css({
                    'border': 'solid 1px #DDDDDD',
                    'padding-bottom': '25px',
                });
         
            var _self = this;
            this.$el.on('attached', function () {
                _self.$el.fancytree(_self.config);
                //slim scroll
                _self.initSlimScroll();
            });

            return this.$el;
        }

        this.initSlimScroll = function (config) {
            if (!config) {
                config = {
                    height: this.height,
                    size: '5px',
                    color: '#CCCCCC',
                    railColor: '#CCCCCC',
                    railVisible: true
                }
            }

            this.$el
                .slimScroll({ destroy: true })    
                .slimScroll(config);
        }

        this.setDirectives = function (directives) {
            this.directives = directives;
            this.currentNode.directives = directives;
            this.config.source.data.directives = directives;
            
            this.$el
                .fancytree('getTree')
                .reload(this.config.source)

            return this;
        }

    }
    assignPrototype(Tree, Component);

    /**
     * This is a tripple state checkbox component
     * @param {string} id dom component id
     * @param {array} options checkbox states
     * @param {callback} clickCallback click callback
     */
    var IndeterminateCheckBox = function (id, options, clickCallback) {
        Component.apply(this, arguments);
        var _self = this;

        this.options = options;
        this.checkedState = 2;

        this.render = function () {
            //call if el exist in dom
            if (this.$el && (this.$el.parents('html').length > 0)) {
                this.$el.find('#' + this.id)
                    .data('checked', this.checkedState)
                    .prop('indeterminate', this.checkedState == 1 ? true : false)
                    .prop('checked', this.checkedState == 2 ? true : false);
                
                this.$el.find('#' + this.id + '_label')
                    .text(this.options[this.checkedState]);
                
                this.$el.trigger('reset');
            } else {
                this.$el = $("<label>")
                    .append(
                        $("<input type='checkbox'>")
                            .attr('id', this.id)
                            .data('checked', this.checkedState)
                            .prop('indeterminate', false)
                            .prop('checked', true)
                        .click(function () {
                            _self.toggleState();
                            clickCallback();
                        })
                    ).append(
                        "<span id='" + this.id + "_label'> " + this.options[this.checkedState] + "<span>"
                    );

            }
                
            return this.$el;
        }

        this.toggleState = function () {
            if (this.checkedState == 2)
                this.checkedState = 0;
            else
                this.checkedState++;
            this.render();
            
            return this;
        }


    } 
    assignPrototype(IndeterminateCheckBox, Component);

    /**
     * This is a file browser component
     * @param {string} id dom component id
     * @param {array} id files to be shown
     */
    var VersionBrowser = function (id, files) {
        Component.apply(this, arguments);
        var _self = this;

        this.selectedVersion = 0;
        this.files = files || [];

        var formatBytes = function (bytes, precision = 2) {
            var units = ['B', 'KB', 'MB', 'GB', 'TB'];

            var bytes = Math.max(bytes, 0);
            var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
            pow = Math.min(pow, units.length - 1);

            bytes /= Math.pow(1024, pow);

            return Math.round(bytes, precision) + ' ' + units[pow];
        }

        this.render = function () {
            var wrapper = "<div class='row version-browser' id='" + this.id + "'>";
            
            var html = "<div class='col-md-12' id='" + this.id + "-file-container'>" +
                "<div class='row'>" +
                    "<div class='col-md-12 headers'>" +
                        "<span class='col-md-4'><b>Name</b></span>" +
                        "<span class='col-md-2'><b>Author</b></span>" +
                        "<span class='col-md-4'><b>Date</b></span>" +
                        "<span class='col-md-2'><b>Size</b></span>" +
                    "</div>" +
                "</div>";

            if(this.files.length > 0)
                this.files.map(function (file, index) {
                    if (index == 0 && _self.selectedVersion == 0) {
                        _self.selectedVersion = file.id;    
                    }

                    html += "<div class='row'>" +
                        "<div class='col-md-12 " + (file.id == _self.selectedVersion ? 'file-selected file' : 'file') + "' id='" + file.id + "'>" +
                            "<span class='col-md-4'>" + truncate(file.name, 20) + "</span>" +
                            "<span class='col-md-2'>" + file.user + "</span>" +
                            "<span class='col-md-4'>" + file.date + "</span>" +
                            "<span class='col-md-1'>" + formatBytes(file.size) + "</span>" +
                            "<span class='col-md-1'>" + (file.deployed ? '<span class="label label-warning">Deployed</span>' : '' )  + "</span>" +
                        "</div>" + 
                        "</div>";    
                });

            html += "</div>";
         
            //call if el exist in dom
            if (this.$el) {
                this.$el.html(html);
                this.$el.trigger('reset');
            } else
                this.$el = $(wrapper + html + "</div>");
            
            this.$el.on('click', '.file', function () {
                _self.$el.find('#' + _self.selectedVersion).removeClass('file-selected');
                _self.selectedVersion = this.id;
                $(this).addClass('file-selected');
            });
            
            return this.$el;
        }

        this.addFiles = function (files) {
            this.files = files;
            this.render();

            return this;
        }

    }
    assignPrototype(VersionBrowser, Component);

    /**
     * This is a bootstrap modal component
     * @param {string} id dom component id
     * @param {string} title modal title
     */
    var Modal = function (id, title, height) {
        Component.apply(this, arguments);
        var _self = this;

        this.title = title;
        this.height = height;
        var components = [];
        this.footerComponents = [];

        this.render = function () {
            var html = '<div class="modal" id="' + this.id + '" data-backdrop="static" style="z-index:999999">' +
                '<div class="modal-dialog modal-lg">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h5 class="modal-title" id="' + this.id + '-modal-title">' + this.title + '</h5>' +
                        '</div>' +
                        '<div class="modal-body" id="' + this.id + '-modal-body">' +
                            
                        '</div>' +
                        '<div class="modal-footer" id="' + this.id + '-modal-footer">' +

                        '</div>' +   
                    '</div>' +
                '</div>' +
            '</div>';
            
            this.$el = $(html);

            return this.$el;
        }

        this.appendComponent = function (component) {
            this.$el
                .find('#' + this.id + '-modal-body')
                .append(component.render());
            components.push(component); 
            
            return this;
        }

        this.appendToFooter = function (component) {
            this.$el
                .find('#' + this.id + '-modal-footer')
                .append(component.render());
            
            this.footerComponents.push(component);
            return this;
        }

        this.footerComponent = function (components) {
            this.$el
                .find('#' + this.id + '-modal-footer')
                .html("");
            
            components.forEach(function (component) {
                _self.$el
                    .find('#' + _self.id + '-modal-footer')
                    .append(component.render());
                _self.footerComponents.push(component);
            });

            return this;
        }

        this.show = function () {
            this.$el.modal('show');

            this.$el
                .find('#' + this.id + '-modal-body')
                .slimScroll({
                    height: _self.height,
                    size: '5px',
                    color: '#CCCCCC',
                    railColor: '#CCCCCC',
                    railVisible: true
                });
            
            components.forEach(function (component) { 
                component.$el.trigger('attached');
            })

            return this;
        }

        this.hide = function () {
            this.$el.modal('hide');

            return this;
        }

    }
    assignPrototype(Modal, Component);

    /**
     * This is a text input component
     * @param {string} id dom component id
     */
    var TextInput = function (id, text = '') {
        Component.apply(this, arguments);
        var _self = this;

        this.text = text;

        this.render = function () {
            var html = "<input type='text' class='form-control' id='" + this.id + "' value='" + this.text + "'>";

            //call if el exist in dom
            if (this.$el && (this.$el.parents('html').length > 0)) {
                this.$el.val(this.text);
                this.$el.trigger('reset');
            } else
                this.$el = $(html);

            return this.$el;
        }

        this.setText = function (text) {
            this.text = text;
            this.render();

            return this;
        }

        this.getText = function () {
            return this.$el.val();
        }


    }
    assignPrototype(TextInput, Component);

    /**
     * INIT
     */
    $(document).on('click', GUI.mainLink, function () {
        //observe selectedForms change
        if (currentSelectedForms != JSON.stringify(selectedForms)) {
            GUI.IDE.render();
            currentSelectedForms = JSON.stringify(selectedForms);
            getFormVariables(currentSelectedForms, function () {
                $(document).trigger('doneGetFormVariables');
            });
        }
    });

    $(document).on('click', '#show-versions', function () {
        GUI.IDE.versionsModal.footerComponents.forEach(function (component) {
            //diff functionality
            if (component.id == 'diff' && GUI.IDE.versionsBrowser.files.length > 1) {
                component.enable();
            }
        })
        GUI.IDE.versionsModal.show();
    });

})();