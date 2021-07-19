/**
 * This is a TextEditor element
 * 
 * Kreatx 2018
 */

import { Component } from "/obvia/components/base/Component.js";
import { List } from "/obvia/components/List.js";

var TextEditor =  function(_props) {
    let _self = this;
    this.beforeAttach = function () {
        this.$input = this.$el;
    };
   
    let _changeHandler = function (e) {
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
    
    let _spellCheckClickHandler = function (e) {
        let editingArea = _self.$input.parent().find('.note-editing-area');
        let dialog = editingArea.spellCheckInDialog({ defaultDictionary: _self.spellCheck.defaultDictionary });
        dialog.onDialogClose = function () {
            _self.$input.summernote('code', editingArea.find('.note-editable').html());
        }
    };
    
    this.template = function () {
        return  "<textarea id='" + this.domID + "' class='summernote' autofocus>"+_value+"</textarea>";
    };

    let _defaultParams = {
        value: "",
        classes: ["form-control"],
        afterAttach: this.afterAttach
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _change = _props.change;
    let _value = _props.value;
  
    Component.call(this, _props, true);
    let base = this.base;

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
        let SpellCheckButton = function (context) {
            let ui = $.summernote.ui;
            let button = ui.button({
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
export {
    TextEditor
};