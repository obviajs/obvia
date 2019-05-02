/**
 * This is a TextEditor element
 * 
 * Kreatx 2018
 */

//component definition
var TextEditor =  function(_props, overrided = false) {
    var _self = this;
    this.beforeAttach = function () {
        this.$input = this.$el;
    };
   
    var _changeHandler = function (e) {
        _value = _self.$input.summernote('code');
        if (typeof _change == 'function')
            _change.apply(_self, arguments);
    };

    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                this.$input.summernote('code', _value);
                this.trigger('change');
            }
        }
    });
    
    var _spellCheckClickHandler = function (e) {
        var editingArea = _self.$input.parent().find('.note-editing-area');
        var dialog = editingArea.spellCheckInDialog({ defaultDictionary: _self.spellCheck.defaultDictionary });
        dialog.onDialogClose = function () {
            _self.$input.summernote('code', editingArea.find('.note-editable').html());
        }
    };
    
    this.template = function () {
        return  "<textarea id='" + this.domID + "' class='summernote' autofocus>"+_value+"</textarea>";
    };

    var _defaultParams = {
        value: "",
        class: "form-control",
        afterAttach: this.afterAttach
    };

    _props = extend(false, false, _defaultParams, _props);
    var _change = _props.change;
    var _value = _props.value;
  
    Component.call(this, _props, true);
    var base = this.base;

    Object.defineProperty(this, "enabled",
    {
        get: function enabled()
        {
            return _enabled;
        },
        set: function enabled(v)
        {
            if(_enabled != v)
            {
                _enabled = v;
                if(this.$input)
                    if(_enabled)
                    {
                        this.$input.summernote('enable');
                    }else
                    {
                        this.$input.summernote('disable');
                    }
            }
        },
        configurable: true
    });

    this.afterAttach = function (e) {
        var SpellCheckButton = function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="fas fa-book"></i> Spell Check',
                tooltip: 'Spell Check',
                click: _spellCheckClickHandler.bind(_self)
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
    }; 

    this.registerEvents = function () {
        return base.registerEvents.call(this).concat(
        [
            {
                registerTo: this.$input, events: {
                    'summernote.change': _changeHandler,
                }
            }
        ]);
    };
};

//component prototype
TextEditor.prototype.ctor = 'TextEditor';