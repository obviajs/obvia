/**
 * This is an AutoComplete Element
 * 
 * Kreatx 2018
 */

//component definition
var AutoCompleteEx = function (_props) {
    let _separator, _tokenContainer, _tokenRepeater, _suggestionsRepeater, _input, _maxSuggestionsCount, _valueWatcher;
    let _dpWatcher;
    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            if (_dataProvider != v) {
                if (_dpWatcher && _dataProvider) {
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _dpChanged);
                }
                _props.dataProvider = _dataProvider = v;

                if (_dataProvider) {
                    _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                    _dpWatcher.watch(_dataProvider, "length", _dpChanged);
                    _dataProvider.on("propertyChange", _dpChanged);
                }
            }
        },
        enumerable: true
    });
    let _dpChanged = function (e) {
        if (_input.$el[0] == document.activeElement)
            _self.refreshSuggestions();
    };
    let _dpLengthChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        _tokenInputReSize();
    };

    Object.defineProperty(this, "valueField", {
        get: function valueField() {
            return _valueField;
        },
        set: function valueField(v) {
            _valueField = v;
        },
        enumerable: true
    });
    Object.defineProperty(this, "labelField", {
        get: function labelField() {
            return _labelField;
        },
        set: function labelField(v) {
            _labelField = v;
        },
        enumerable: true
    });

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _suggestionsRepeater = this.suggestionsRepeater;
            if (!this.getBindingExpression("dataProvider"))
                this.dataProvider = _props.dataProvider;
            _tokenContainer = this.tokenContainer;
            _input = this.tokenContainer.tokenInput;
            _tokenRepeater = this.tokenContainer.tokenRepeater;
            _suggestionsRepeater.css.left = "inherit";
            _suggestionsRepeater.css.top = "inherit";
            _suggestionsRepeater.css.position = "relative";
        }
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.value && !this.getBindingExpression("value")) {
                this.value = _props.value;
            }
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            _tokenInputReSize();
        }
    };

    let _tokenRendererClickHandler = function (e) {};

    let _tokenRendererDoubleClickHandler = function (e) {};

    let _tokenRendererMouseDownHandler = function (e) {};

    let _tokenInputReSize = function () {
        //_tokenRepeater.token[0].$el.width()
        if (_tokenRepeater) {
            let tokenCount = _tokenRepeater.dataProvider == null ? 0 : _tokenRepeater.dataProvider.length;
            let tokenWidth = 0,
                rowTop = 0;
            for (let i = 0; i < tokenCount; i++) {
                let tokenPos = _tokenRepeater.token[i].$el.position();
                if (tokenPos.top != rowTop) {
                    tokenTop = tokenPos.top;
                    tokenWidth = _tokenRepeater.token[i].$el.width();
                } else {
                    tokenWidth += _tokenRepeater.token[i].$el.width();
                }
            }
            if (_self.$el.width() > 0 && tokenWidth >= 0) {
                let tokenInputWidth = Math.max(_self.$el.width() - tokenWidth - 2, 0);
                tokenInputWidth = Math.max((tokenInputWidth - tokenInputWidth * 0.3).toFixed(0), 0);
                _input.$el.css({
                    "width": tokenInputWidth + "px"
                });
            }
        }
    };

    let _suggestionsDropDownKeyDown = function (e) {
        if (typeof _self.suggestionsdropdownkeydown == 'function')
            _self.suggestionsdropdownkeydown.apply(this, arguments);

        if (!e.isDefaultPrevented()) {
            switch (e.keyCode) {
                case 9:
                case 13: // ENTER - apply value
                    console.log("DD ENTER");
                    //e.preventDefault();
                    break;
                case 27: // ESC - get back to old value
                    console.log("DD ESCAPE");
                    _closeSuggestionsList();
                    break;
            }
        }
    };
    let _suggestionRendererKeyDownHandler = function (e, repeaterEventArgs) {
        switch (e.keyCode) {
            case 9: // TAB - apply and move to next column on the same row 
                console.log("TAB");

                console.log(repeaterEventArgs);
                //this.parent.parent.addTokenItems(repeaterEventArgs.currentItem);
                if (_self.multiSelect) {
                    //TODO:check because concat will return a new value
                    _self.value.splice(_self.value.length, 0, repeaterEventArgs.currentItem);
                } else {
                    _self.value = repeaterEventArgs.currentItem;
                }

                _self.removeSuggestionItemAt(repeaterEventArgs.currentIndex);
                // acEx.closeSuggestionsList();
                _closeSuggestionsList();
                _input.$el.focus();
                break;
        }
    };

    let _tokenInputKeyDown = function (e) {
        if (typeof _inputkeydown == 'function')
            _inputkeydown.apply(_self, arguments);

        if (!e.isDefaultPrevented()) {
            switch (e.keyCode) {
                case 13: // ENTER - apply value
                    console.log("ENTER");
                    break;
                case 27: // ESC - get back to old value
                    console.log("ESCAPE");
                    _closeSuggestionsList();
                    e.preventDefault();
                    break;
                case 9: // TAB - apply and move to next column on the same row 
                    console.log("TAB");
                    break;
                case 40: // TAB - apply and move to next column on the same row 
                    console.log("DOWN Arrow");
                    _suggestions = differenceOnKeyMatch(_dataProvider, _value, _valueField);
                    _openSuggestionsList();
                    e.preventDefault();
                    break;
            }
        }
    };
    let _tokenInputKeyUp = function (e) {
        if (!e.isDefaultPrevented()) {
            let inp = String.fromCharCode(e.keyCode);
            if (/[a-zA-Z0-9-_ ]/.test(inp)) {
                let t = _delayQuerySuggestions(_input.value);
                //clearTimeout(t);
            } else if (e.keyCode == 8) {
                if (_input.value == "") {
                    _delayRemoveTokenItemAt(_self.value.length - 1);
                }

            }
        }
    };

    this.refreshSuggestions = function () {
        _querySuggestions(_input.value);
    };

    let _querySuggestions = function (toMatch) {
        console.log("querySuggestions for: ", toMatch);
        let ac = differenceOnKeyMatch(_dataProvider, _value, _valueField);
        _suggestions = new ArrayEx(sortBestMatch(ac, toMatch, _self.matchType, _labelField, _maxSuggestionsCount));
        _openSuggestionsList();
    };
    /*
    <a href="#" class="inputLink">Did you mean xxyYY?</a>
    */

    let _openSuggestionsList = function () {
        //suggestions found
        if (_suggestions.length > 0) {
            _suggestionsRepeater.dataProvider = _suggestions;
            let cls = _suggestionsRepeater.classes.slice(0);
            cls.pushUnique('show');
            _suggestionsRepeater.classes = cls;
            _suggestionsRepeater.attr["aria-expanded"] = true;
        } else {
            _closeSuggestionsList();
            _input.$el.attr('placeholder', 'No results found :(').delay(1000).queue(function (n) {
                $(this).attr('placeholder', 'Type something...');
                n();
            });
            _self.trigger("noSuggestionsFound", [_input.value]);
        }
        // myAutoComplete.suggestionsRepeater.rowItems[0]['suggestion'].$el.focus();
    };
    let _closeSuggestionsList = function () {
        _suggestionsRepeater.attr["aria-expanded"] = false;
        let cls = _suggestionsRepeater.classes.slice(0);
        let ind = cls.indexOf("show");
        if (ind > -1) {
            cls.splice(ind, 1);
        }
        _suggestionsRepeater.classes = cls;
        _input.$el.focus();
    };
    let _tokenRendererCloseIconClickHandler = function (e, repeaterEventArgs) {
        if (_enabled) {
            console.log(repeaterEventArgs);
            //"this" refers to the components in the repeater
            this.removeTokenItemAt(repeaterEventArgs.currentIndex);
            _input.$el.focus();
        }
    };
    let _suggestionRendererClickHandler = function (e, repeaterEventArgs) {
        console.log(repeaterEventArgs);
        //this.parent.parent.addTokenItems(repeaterEventArgs.currentItem);
        if (_self.multiSelect) {
            //TODO:check because concat will return a new value
            // _self.value = _self.value.splicea(_self.value.length, 0, [repeaterEventArgs.currentItem]);
            _self.value.splice(_self.value.length, 0, repeaterEventArgs.currentItem);
        } else {
            _self.value = repeaterEventArgs.currentItem;
        }

        _self.removeSuggestionItemAt(repeaterEventArgs.currentIndex);
        // acEx.closeSuggestionsList();
        _closeSuggestionsList();
        _input.$el.focus();
    };
    let _suggestionRendererDoubleClickHandler = function (e, repeaterEventArgs) {
        console.log(repeaterEventArgs);
    };
    let _suggestionRendererMouseDownHandler = function (e, repeaterEventArgs) {
        console.log(repeaterEventArgs);
    };
    let _addTokenItems = function (items) {
        if (typeof (items) === "object" && !(items instanceof Array)) {
            items = [items];
        }
        let itemsToAdd = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item != null && item[_valueField] != undefined && item[_labelField] != undefined) {
                let itemToAdd = [item];
                if (!this.allowNewItem) {
                    itemToAdd = intersectOnKeyMatch(_dataProvider, itemToAdd, _valueField); //value;
                    if (itemToAdd.length == 0) {
                        itemToAdd = intersectOnKeyMatch(_suggestions, itemToAdd, _valueField); //value;
                        if (itemToAdd.length == 0) {
                            console.log("This value was not found in the dataProvider and you are not allowed to add new items.");
                            continue;
                        }
                    }
                }
                itemsToAdd.push(itemToAdd[0]);
            } else
                console.log("Please specify a valid object on row: " + i + ". The provided one is either null or doesn`t have '" + _valueField + "' and '" + _labelField + "' properties.");
        }
        //TODO:If Repeating will be allowed we need to add condition below based on a new property to control this setting
        itemsToAdd = differenceOnKeyMatch(itemsToAdd, _value, _valueField);
        for (let j = 0; j < itemsToAdd.length; j++) {
            _value.push(itemsToAdd[j]);
        }

    };
    this.removeSuggestionItemAt = function (index) {
        //TODO: If we are going to keep item ordering in the view the save as in value
        if (index >= 0 && index < _suggestions.length) {
            _suggestions.splice(index, 1);
            //this._value.splice(index, 1);
        } else
            console.log("Index out of range. No item will be removed.");
    };
    this.removeTokenItemAt = function (index) {
        //TODO: If we are going to keep item ordering in the view the save as in value
        if (index >= 0 && index < _value.length) {
            _value.splice(index, 1);
        } else
            console.log("Index out of range. No item will be removed.");
    };
    this.removeTokenItems = function (items) {
        if (typeof (items) === "object" && !(items instanceof Array)) {
            items = [items];
        }
        for (let i = 0; i < items.length; i++) {
            //TODO: Add Validation of the item from the Selectable base behavior
            let matches = getMatching(_value, _valueField, items[i][_valueField]);
            for (let j = 0; j < matches.indices.length; j++) {
                _value.splice(matches.indices[j], 1);
            }
        }

    };

    this.removeAllTokenItems = function () {
        //_tokenRepeater.removeAllRows();
        _value.splice(0, _value.length);
    };
    Object.defineProperty(this, "multiSelect", {
        get: function multiSelect() {
            return _multiSelect;
        },
        set: function multiSelect(v) {
            if (_multiSelect != v)
                _multiSelect = v;
        },
        enumerable: true
    });
    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (v) {
                if (isString(v) || isNumber(v)) {
                    let ind = indexOfObject(_dataProvider, _valueField, v);
                    if (ind > -1) {
                        v = _dataProvider[ind];
                    } else {
                        let vo = {};
                        vo[_labelField] = v;
                        vo[_valueField] = v;
                        v = vo;
                    }
                }
                if (typeof (v) === "object" && !(v instanceof Array)) {
                    v = [v];
                }
                if (!_value.equals(v)) {
                    let e = jQuery.Event('beforeChange');
                    e.newValue = v;
                    e.oldValue = _value;
                    this.proxyMaybe.trigger(e);
                    if (!e.isDefaultPrevented()) {
                        //is the tokenRepeater rendered yet ? 
                        if (_tokenRepeater && _tokenRepeater.$container) {
                            if (_valueWatcher && _value) {
                                _valueWatcher.reset();
                                _value.off("propertyChange", _dpLengthChanged);
                            }
                            _tokenRepeater.dataProvider = _value = new ArrayEx(v);
                            _input.value = "";
                            this.trigger('change');
                            _tokenInputReSize();
                            if (_value) {
                                _valueWatcher = ChangeWatcher.getInstance(_value);
                                _valueWatcher.watch(_value, "length", _dpLengthChanged);
                                _value.on("propertyChange", _dpLengthChanged);
                            }
                        } else
                            _value.splicea(0, _value.length, v);
                    }
                }
            } else {
                this.removeAllTokenItems();
            }
        }
    });

    this.focus = function () {
        if (_input) {
            _input.$el[0].focus({
                preventScroll: true
            });
        }
    };
    /*
        destruct: function () {
            //TODO: Destruct ? 
         },
        changeHandler : function(e){
            if (typeof this.onchange == 'function')
                this.onchange.apply(this, arguments);
        },
        mouseDownHandler: function (e) {
            if (typeof this.onmousedown == 'function')
                this.onmousedown.apply(this, arguments);
            
            // f(!e.isDefaultPrevented()){
            //     this.handleComponentMouseDown.apply(this, arguments);
            // }
        },    

        tokenRendererClickHandler: function (e, repeaterEventArgs) {
        },
        tokenRendererDoubleClickHandler: function (e, repeaterEventArgs) {
        },
        tokenRendererMouseDownHandler: function (e, repeaterEventArgs) {
        },
        clickHandler: function (e) {
            if (typeof this.onclick == 'function')
                this.onclick.apply(this, arguments);
            
            if(!e.isDefaultPrevented()){
                this.handleComponentClick.apply(this, arguments);
            }
        },

        doubleClickHandler: function (e) {
            if (typeof this.ondblclick == 'function')
                this.ondblclick.apply(this, arguments);

            if (!e.isDefaultPrevented()) {
                this.handleComponentClick.apply(this, arguments);
            }
        },

        handleComponentClick: function (e, repeaterEventArgs) {
            let componentID = _tokenRepeater.components[0].props.id;
            let clickedComponent = repeaterEventArgs.currentRow[componentID];
            let index = repeaterEventArgs.currentIndex;
            
            let v = repeaterEventArgs.currentItem;
        },    
    */

    let _defaultParams = {
        closeIconSide: "left",
        dataProvider: new ArrayEx([]),
        value: new ArrayEx([]),
        allowNewItem: false,
        multiSelect: false,
        maxSuggestionsCount: 10,
        "type": ContainerType.NONE,
        classes: ["no-form-control"],
        valueField: "id",
        labelField: "text"
    };

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    if (!_props.value) {
        _props.value = new ArrayEx([]);
    }
    _maxSuggestionsCount = _props.maxSuggestionsCount;
    _props.attr["data-triggers"] = "noSuggestionsFound beforeChange";

    let _valueField = _props.valueField;
    let _labelField = _props.labelField;
    let _dataProvider;

    let _allowNewItem = _props.allowNewItem;
    let _label = _props.label;
    let _closeIconSide = _props.closeIconSide;
    let _suggestions = new ArrayEx([]);
    let _enabled = true;

    let _delayQuerySuggestions = debounce(_querySuggestions, 400);
    let _delayRemoveTokenItemAt = debounce.call(this, this.removeTokenItemAt, 200);
    let _multiSelect = _props.multiSelect;
    let _self = this;
    let _value = new ArrayEx([]);



    let _suggestionRenderer = {
        ctor: SuggestionRenderer,
        props: {
            id: 'suggestion',
            label: '{' + _labelField + '}',
            value: '{' + _valueField + '}',
            click: _suggestionRendererClickHandler,
            dblclick: _suggestionRendererDoubleClickHandler,
            mousedown: _suggestionRendererMouseDownHandler,
            keydown: _suggestionRendererKeyDownHandler,
        }
    };
    //TODO: we are overriding those handlers, we should exec them after our internal handlers



    let _tokenRenderer = {
        ctor: TokenRenderer,
        props: {
            id: 'token',
            label: '{?' + _labelField + '}',
            value: '{?' + _valueField + '}',
            closeiconclick: _tokenRendererCloseIconClickHandler.bind(this),
            closeIconSide: _closeIconSide,
            click: _tokenRendererClickHandler,
            dblclick: _tokenRendererDoubleClickHandler,
            mousedown: _tokenRendererMouseDownHandler,
            css: {
                "float": "left"
            }
        }
    };

    let _cmps = [{
            ctor: "Container",
            "props": {
                id: "tokenContainer",
                "type": ContainerType.NONE,
                classes: ["border", "d-flex"],
                attr: {
                    "role": "menu"
                },
                "components": [{
                        ctor: Repeater,
                        props: {
                            id: 'tokenRepeater',
                            defaultItem: this.defaultItem,
                            rendering: {
                                direction: 'horizontal',
                                separator: _separator || false,
                                wrap: false
                            },
                            classes: ["d-flex"],
                            ownerDocument: this.ownerDocument,
                            dataProvider: _value,
                            components: [_tokenRenderer],
                            endDraw: _tokenInputReSize
                        }
                    },
                    {
                        ctor: TextInput,
                        props: {
                            id: 'tokenInput',
                            attr: {
                                "placeholder": 'Type something...'
                            },
                            versionStyle: '',
                            keydown: _tokenInputKeyDown,
                            keyup: _tokenInputKeyUp,
                            classes: ['border-0', 'ellipsis'],
                            ownerDocument: this.ownerDocument,
                            css: {
                                "outline": "none",
                                "font-size": "14px"
                            }
                        }
                    }
                ]
            }
        },
        {
            ctor: Repeater,
            props: {
                id: 'suggestionsRepeater',
                "type": ContainerType.NONE,
                classes: ["dropdown-menu", "position-absolute"],
                defaultItem: this.defaultItem,
                rendering: {
                    direction: 'vertical',
                    separator: _separator || false,
                    actions: false
                },
                dataProvider: _suggestions,
                components: [_suggestionRenderer],
                parent: _self,
                ownerDocument: this.ownerDocument,
                keydown: _suggestionsDropDownKeyDown.bind(this)
            }
        }
    ];

    _props.components = _cmps;
    let r = Container.call(this, _props, true);

    Object.defineProperty(this, "enabled", {
        get: function enabled() {
            return _enabled;
        },
        set: function enabled(v) {
            if (_enabled != v) {
                _enabled = v;
                this.$input.prop('disabled', !v);
            }
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this, "maxSuggestionsCount", {
        get: function maxSuggestionsCount() {
            return _maxSuggestionsCount;
        },
        set: function maxSuggestionsCount(v) {
            if (_maxSuggestionsCount != v) {
                _maxSuggestionsCount = v;
            }
        },
        configurable: true,
        enumerable: true
    });
    return r;
};
AutoCompleteEx.prototype.ctor = 'AutoCompleteEx';