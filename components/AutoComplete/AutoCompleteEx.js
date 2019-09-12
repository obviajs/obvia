/**
 * This is an AutoComplete Element
 * 
 * Kreatx 2018
 */

//component definition
var AutoCompleteEx = function(_props)
{
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        }
    });
    Object.defineProperty(this, "valueField", 
    {
        get: function valueField() 
        {
            return _valueField;
        }
    });
    
    this.beforeAttach = function () 
    {
        this.cComponents = [];
        this.countChildren = 2;

        this.$tokenContainer = this.$el.find("#" + this.domID+"_tokenContainer");
        this.$suggestionsDropDown = this.$el.find("#" + this.domID+"_suggestionsDropDown");
        this.$suggestionsDropDown.css({'left':'inherit', 'top':'inherit'});

        if(this.tokenRenderer==null||this.tokenRenderer==undefined){
            this.tokenRenderer = {
                constructor: TokenRenderer,
                props: {
                    id: 'token',
                    label: '{'+_labelField+'}',
                    value: '{'+_valueField+'}',
                    closeiconclick: _tokenRendererCloseIconClickHandler,
                    closeIconSide: _closeIconSide
                }
            };
        }
        _self.tokenInput = new TextInput({
            id: 'tokenInput',
            attr: {"placeholder": 'Type something...'},
            versionStyle: '',
            keydown:_tokenInputKeyDown,
            keyup: _tokenInputKeyUp
        }).on('creationComplete', function(e){
            e.stopPropagation();

            _self.tokenInput.$el.addClass('border-0');
            _self.tokenInput.$el.addClass('ellipsis');
            //TODO: te konsiderojme qe form-control si klse te mos i shtohet fare elementeve nese embededd=true
            _self.tokenInput.$el.css({"outline":"none", "font-size":"14px"});
        
            _self.cComponents.push(1);
            if (_self.cComponents.length > _self.countChildren-1) {
                _self.trigger('creationComplete');  
            }
            //_self.tokenInput.$el.on('keydown', _tokenInputKeyDown.bind(_self));
            //_self.tokenInput.$el.on('keyup', _tokenInputKeyUp.bind(_self));
                
        });

        _self.$input = _self.tokenInput.$el;

        //TODO: we are overriding those handlers, we should exec them after our internal handlers
        this.tokenRenderer.props.click = this.tokenRendererClickHandler;
        this.tokenRenderer.props.dblclick = this.tokenRendererDoubleClickHandler;
        this.tokenRenderer.props.mousedown = this.tokenRendererMouseDownHandler;
        
        this.tokensRepeater = new Repeater({
            id: 'listRepeater',
            defaultItem: this.defaultItem,
            rendering: {
                direction: 'horizontal',
                separator: this.separator || false,
                actions: false
            },
            ownerDocument: this.ownerDocument,
            embedded:true,
            dataProvider: _value,
            components: [this.tokenRenderer],
            parent: _self
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            //creation complete will be triggered also on "all rows removed, add a new row" case
            _self.cComponents.push(1);
            _self.tokensRepeater.$container.css('float', 'left')
            if (_self.cComponents.length > this.countChildren-1) {
                this.trigger('creationComplete');  
            }
            tokenInputReSize();
            this.tokensRepeater.on('onRowAdd', function(){
                tokenInputReSize();
            });
            this.tokensRepeater.on('onRowDelete', function(){
                tokenInputReSize();
            });
        }.bind(this));

        var tokenInputReSize = function(){
            var rowCount = _self.tokensRepeater.rows.length;
            var rowWidth = 0, rowTop = 0;
            for(var i=0;i<rowCount;i++){
                var rowPos = _self.tokensRepeater.rows[i].position();
                if(rowPos.top != rowTop){
                    rowTop = rowPos.top;
                    rowWidth = _self.tokensRepeater.rows[i].width();
                }else{
                    rowWidth += _self.tokensRepeater.rows[i].width();
                }
            }
            var tokenInputWidth = _self.$el.width() - rowWidth - 2;
            var tokeInputSetWidth = whenDefined(_self, "tokenInput", function(tiw){
                _self.tokenInput.$el.css({"width": tiw+"px"});
            }); 
            tokeInputSetWidth(tokenInputWidth);
        }; 
        


        //Suggestions Renderer
        if(this.suggestionRenderer==null||this.suggestionRenderer==undefined){
            this.suggestionRenderer = {
                constructor: SuggestionRenderer,
                props: {
                    id: 'suggestion',
                    label: '{'+_labelField+'}',
                    value: '{'+_valueField+'}'
                }
            };
        }
        //TODO: we are overriding those handlers, we should exec them after our internal handlers
        this.suggestionRenderer.props.click = _suggestionRendererClickHandler;
        this.suggestionRenderer.props.dblclick = _suggestionRendererDoubleClickHandler;
        this.suggestionRenderer.props.mousedown = _suggestionRendererMouseDownHandler;

       
        this.suggestionsRepeater = new Repeater({
            id: 'listRepeater',
            defaultItem: this.defaultItem,
            rendering: {
                direction: 'vertical',
                separator: this.separator || false,
                actions: false
            },
            embedded: true,
            dataProvider: _suggestions,
            components: [this.suggestionRenderer],
            parent: _self
        })
        .on('blur', function (e) {
            alert("blur");
        }.bind(this))
        .on('creationComplete', function(e){
            e.stopPropagation();
        });
        this.suggestionsRepeater.$el.removeClass('form-group');
    };

   
    var _suggestionsDropDownKeyDown = function(e)
    {
        if (typeof _self.suggestionsdropdownkeydown == 'function')
            _self.suggestionsdropdownkeydown.apply(this, arguments);

        if(!e.isDefaultPrevented()){
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
    var _tokenInputKeyDown = function(e)
    {
        if (typeof _self.tokeninputkeydown == 'function')
            _self.tokeninputkeydown.apply(_self, arguments);
    
            if(!e.isDefaultPrevented()){
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
                        _suggestions  = differenceOnKeyMatch (_dataProvider, _value, _valueField);
                        _openSuggestionsList();
                        e.preventDefault();
                        break;
                }
            }
    };
    var _tokenInputKeyUp = function(e)
    {
        if(!e.isDefaultPrevented())
        {
            var inp = String.fromCharCode(e.keyCode);
            if (/[a-zA-Z0-9-_ ]/.test(inp)){
                var t = _delayQuerySuggestions(_self.tokenInput.value);
                //clearTimeout(t);
            }else if(e.keyCode == 8) {
                if(_self.tokenInput.value == ""){
                    _delayRemoveTokenItemAt(_self.value.length-1);
                }

            }
        }
    };
    var _querySuggestions = function(toMatch){
        console.log("querySuggestions for: ", toMatch);
        var ac = differenceOnKeyMatch (_dataProvider, _value, _valueField);
        _suggestions = new ArrayEx(sortBestMatch(ac, toMatch, _self.matchType, _labelField));
        _openSuggestionsList();
    };
    /*
    <a href="#" class="inputLink">Did you mean xxyYY?</a>
    */
   
    var _openSuggestionsList = function(){
        //suggestions found
        if(_suggestions.length>0)
        {
            _self.suggestionsRepeater.dataProvider = _suggestions;

            _self.$suggestionsDropDown.append(_self.suggestionsRepeater.$el);
            _self.$suggestionsDropDown.addClass('show');
            _self.$suggestionsDropDown.attr('aria-expanded', true);
        }else
        {
            _self.tokenInput.$el.attr('placeholder','No results found :(').delay(1000).queue(function(n) {$(this).attr('placeholder','Type something...');n();});
            _self.trigger("noSuggestionsFound", [_self.tokenInput.value]);
        }
       // myAutoComplete.suggestionsRepeater.rowItems[0]['suggestion'].$el.focus();
    };
    var _closeSuggestionsList = function()
    {
        _self.$suggestionsDropDown.attr('aria-expanded', false);
        _self.$suggestionsDropDown.removeClass('show');
        _self.tokenInput.$el.focus();
    };
    var _tokenRendererCloseIconClickHandler = function(e, repeaterEventArgs)
    {
        if(_enabled)
        {
            console.log(repeaterEventArgs);
            //"this" refers to the components in the repeater
            var acEx = this.parent.parent;
            acEx.removeTokenItemAt(repeaterEventArgs.currentIndex);
            acEx.tokenInput.$el.focus();
        }
    };
    var _suggestionRendererClickHandler = function(e, repeaterEventArgs)
    {
        console.log(repeaterEventArgs);
        //this.parent.parent.addTokenItems(repeaterEventArgs.currentItem);
        if(_self.multiSelect){
            //TODO:check because concat will return a new value
            _self.value = _self.value.concat([repeaterEventArgs.currentItem]);
        }else{
            _self.value = repeaterEventArgs.currentItem;
        }

        _self.removeSuggestionItemAt(repeaterEventArgs.currentIndex);
       // acEx.closeSuggestionsList();
        _closeSuggestionsList();
        _self.tokenInput.$el.focus();
    };
    var _suggestionRendererDoubleClickHandler = function(e, repeaterEventArgs)
    {
        console.log(repeaterEventArgs);
    };
    var _suggestionRendererMouseDownHandler = function(e, repeaterEventArgs)
    {
        console.log(repeaterEventArgs);
    };
    var _addTokenItems = function(items) 
    {
        if(typeof(items)==="object" && !(items instanceof Array)){
            items = [items];
        }
        var itemsToAdd = [];
        for(var i=0;i<items.length;i++){
            var item = items[i];
            if(item != undefined && item != null && item[_valueField] != undefined && item[_labelField]!= undefined)
            {
                var itemToAdd = [item];
                if(!this.allowNewItem)
                {
                    itemToAdd = intersectOnKeyMatch(_dataProvider, itemToAdd, _valueField) //value;
                    if(itemToAdd.length==0){
                        itemToAdd = intersectOnKeyMatch(_suggestions, itemToAdd, _valueField) //value;
                        if(itemToAdd.length==0){
                            console.log("This value was not found in the dataProvider and you are not allowed to add new items.");
                            continue;
                        }
                    }
                }
                itemsToAdd.push(itemToAdd[0]);
            }else
                console.log("Please specify a valid object on row: "+i+". The provided one is either null or doesn`t have '"+_valueField+"' and '"+_labelField+"' properties.");
        }
        //TODO:If Repeating will be allowed we need to add condition below based on a new property to control this setting
        itemsToAdd = differenceOnKeyMatch (itemsToAdd, _value, _valueField);
        for(var j=0;j<itemsToAdd.length;j++)
        {
            _value.push(itemsToAdd[j]);
        }
        
    };
    this.removeSuggestionItemAt = function(index){
        //TODO: If we are going to keep item ordering in the view the save as in value
        if(index>=0 && index<_suggestions.length){
            _suggestions.splice(index, 1);
            //this._value.splice(index, 1);
        }else
            console.log("Index out of range. No item will be removed.");
    };
    this.removeTokenItemAt = function(index)
    {
        //TODO: If we are going to keep item ordering in the view the save as in value
        if(index>=0 && index<_value.length){
            _value.splice(index, 1);
            this.tokensRepeater.dataProvider.splice(index, 1);
        }else
            console.log("Index out of range. No item will be removed.");
    };
    this.removeTokenItems = function(items)
    {
        if(typeof(items)==="object" && !(items instanceof Array)){
            items = [items];
        }
        for(var i=0;i<items.length;i++){
            //TODO: Add Validation of the item from the Selectable base behavior
            var matches = getMatching(_value, _valueField,  items[i][_valueField]);
            for(var j=0;j<matches.indices.length;j++){
                _value.splice(matches.indices[j], 1);   
            }
        }    
        
    };
    
    this.removeAllTokenItems = function()
    {
        //this.tokensRepeater.removeAllRows();
        _value.splice(0, _value.length);
    };
    Object.defineProperty(this, "multiSelect", 
    {
        get: function multiSelect() 
        {
            return _multiSelect;
        },
        set: function multiSelect(v) 
        {
            if(_multiSelect != v)
                _multiSelect = v;
        }
    });
    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _value;
        },
        set: function value(v) 
        {
            if(v)
            {
                if(typeof(v)==="object" && !(v instanceof Array)){
                    v = [v];
                }
                if(!_value.equals(v))
                {
                    //is the tokenRepeater rendered yet ? 
                    if(this.tokensRepeater && this.tokensRepeater.$container)
                    {
                        this.tokensRepeater.dataProvider = v;
                        _value = v;
                        _self.tokenInput.value = ""; 
                        this.trigger('change');
                    }else
                        _value.splicea(0, _value.length, v);
                }
            }else
            {
                this.removeAllTokenItems();
            }
        }
    });
   
    this.focus = function()
    {
        if(this.tokenInput != null)
        {
            this.tokenInput.$el[0].focus({preventScroll:true});
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
        var componentID = this.tokensRepeater.components[0].props.id;
        var clickedComponent = repeaterEventArgs.currentRow[componentID];
        var index = repeaterEventArgs.currentIndex;
        
        var v = repeaterEventArgs.currentItem;
    },    
*/
    this.template = function () 
    {
        var html = 
                "<div id='" + this.domID + "' class='no-form-control'>"+
                    "<select type='hidden' style='display:none' name='" + this.domID + "[]' id='" + this.domID + "_select'></select>" +                          
                    '<div id="'+ this.domID + '_tokenContainer" class="border"></div>'+
                    '<div id="'+ this.domID + '_suggestionsDropDown" class="dropdown-menu" role="menu">'+
                    '</div>'+
                "</div>"                 
        return html;        
    };


    var _defaultParams = {
        closeIconSide:"left",
        dataProvider:[],
        value: new ArrayEx([]),
        allowNewItem: false,
        multiSelect: false
    };
    _props = extend(false, false, _defaultParams, _props);
    var _valueField = _props.valueField;
    var _labelField = _props.labelField;
    var _dataProvider = _props.dataProvider;
    
    var _allowNewItem = _props.allowNewItem;
    var _label = _props.label;  
    var _closeIconSide = _props.closeIconSide;
    var  _suggestions = new ArrayEx([]);
    var _enabled = true;
    
    var _delayQuerySuggestions = debounce(_querySuggestions, 400);
    var _delayRemoveTokenItemAt = debounce.call(this, this.removeTokenItemAt, 200);
    var _multiSelect = _props.multiSelect;
    var _self = this;
    var _value = getBindingExp(_props.value)?new ArrayEx([]):_props.value;

    Component.call(this, _props, true);
 
    this.render = function () 
    {
        this.$tokenContainer.append(this.tokenInput.render()); 
        this.$tokenContainer.append(this.tokensRepeater.render());
        return this.$el;
    };

    this.registerEvents = function () 
    {
        return [
            {
                registerTo: this.$suggestionsDropDown, events: {
                    'keydown': _suggestionsDropDownKeyDown.bind(this)
                }
            }
            // ,
            // {
            //     registerTo: this.$el, events: {
            //         'afterAttach': this.afterAttach.bind(this)
            //     }
            // },
            // {
            //     registerTo: this.$input, events: {
            //         'change': this.changeHandler.bind(this)
            //     }
            // }
        ]
    };

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
                this.$input.prop('disabled', !v);
            }
        },
        configurable: true
    });
    
};
AutoCompleteEx.prototype.ctor = 'AutoCompleteEx';