/**
 * This is a TextEditor element
 * 
 * Kreatx 2018
 */

//component definition
var TextEditor = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    beforeAttach: function () {
        this.$input = this.$el.find("#" + this.domID);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'change': this.handleChange.bind(this)
                }
            },
            {
                registerTo: this.$input, events: {
                    'summernote.change': this.handleChange.bind(this),
                }
            }
        ];
    },

    handleChange: function (e) {
        this.value = this.$input.summernote('code');
    },

    setValue(value) {
        this.value = value;
        this.$input.summernote('code', value);

        this.trigger('change');
        return this;
    },

    spellCheckClickHandler: function (e) {
        var editingArea = this.$input.parent().find('.note-editing-area');
        var dialog = editingArea.spellCheckInDialog({ defaultDictionary: this.spellCheck.defaultDictionary });
        dialog.onDialogClose = function () {
            this.$input.summernote('code', editingArea.find('.note-editable').html());
        }
    },

    afterAttach: function (e) {
        var SpellCheckButton = function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="fas fa-book"></i> Spell Check',
                tooltip: 'Spell Check',
                click: this.spellCheckClickHandler.bind(this)
            });

            if (this.hasOwnProperty('spellCheck')) {
                if (this.spellCheck != false) {
                    return button.render();
                }
            }
            
            return false;
        }.bind(this)

        this.$input.summernote({
            height: 70,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link']],
                ['misc', ['codeview']],
                ['mybutton', ['spellCheck']]
            ],
            buttons: {
                spellCheck: SpellCheckButton
            }
        });

        this.$input.summernote('code', this.value);

        this.trigger('creationComplete')
    },

    enable: function () {
        this.$input.summernote('enable');
        return this;
    },

    disable: function () {
        this.$input.summernote('disable');
        return this;
    },

    validate: function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                return false;
            } else
                return true;    
        } else
            return true;    
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable '>" +
                    "<div id='" + this.domID + "-block'> " +
                        "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                            "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                                "<textarea rv-type='text' " +
                                "name='" + this.domID + "' id='" + this.domID + "' class='summernote form-control rowspan"+ this.rowspan +
                                "' rv-placeholder='label' autofocus></textarea>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
TextEditor.type = 'text_editor';

//register dom element for this component
KxGenerator.registerDOMElement(TextEditor, 'kx-texteditor');