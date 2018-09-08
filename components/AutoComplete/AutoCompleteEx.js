/**
 * This is an AutoComplete Element
 * 
 * Kreatx 2018
 */

//component definition
var AutoCompleteEx = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.delayQuerySuggestions = debounce(this.querySuggestions, 400);
        this.cComponents = [];
        var _self = this;
        this.countChildren = 2;

        this.$input = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
        this.$tokenContainer = this.$el.find("#" + this.domID+"_tokenContainer");
        this.$suggestionsDropDown = this.$el.find("#" + this.domID+"_suggestionsDropDown");
        

        if(this.tokenRenderer==null||this.tokenRenderer==undefined){
            this.tokenRenderer = {
                constructor: TokenRenderer,
                props: {
                    id: 'token',
                    label: '{'+this.labelField+'}',
                    value: '{'+this.valueField+'}',
                    closeiconclickhandler: this.tokenRendererCloseIconClickHandler
                }
            };
        }
        //TODO: we are overriding those handlers, we should exec them after our internal handlers
        this.tokenRenderer.props.onclick = this.tokenRendererClickHandler;
        this.tokenRenderer.props.ondblclick = this.tokenRendererDoubleClickHandler;
        this.tokenRenderer.props.onmousedown = this.tokenRendererMouseDownHandler;

       
        this.tokensRepeater = new Repeater({
            id: 'listRepeater',
            defaultItem: this.defaultItem,
            rendering: {
                direction: 'horizontal',
                seperator: this.seperator || false,
                actions: false
            },
            embedded:true,
            dataProvider: this._value,
            components: [this.tokenRenderer],
            parent: _self
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            _self.cComponents.push(1);

            _self.tokenInput = TextInput({
                id: 'tokenInput',
                label: 'Type something...',
                versionStyle: '',
                embedded:true,
            }).on('creationComplete', function(e){
                e.stopPropagation();

                _self.tokenInput.$el.addClass('border-0');
                //TODO: te konsiderojme qe form-control si klse te mos i shtohet fare elementeve nese embededd=true
                _self.tokenInput.$el.removeClass('form-control');
                _self.tokenInput.$el.css({"outline":"none", "font-size":"14px"});
            
                _self.cComponents.push(1);
                if (_self.cComponents.length > _self.countChildren-1) {
                    _self.trigger('creationComplete');  
                }
                _self.tokenInput.$el.on('keydown', _self.tokenInputKeyDown.bind(_self));
                        
            });
            _self.tokensRepeater.$el.removeClass('form-group');
                
            _self.tokensRepeater.$container.append( _self.tokenInput.render());
          
            if (_self.cComponents.length > this.countChildren-1) {
                this.trigger('creationComplete');  
            }
        }.bind(this));

        //Suggestions Renderer
        if(this.suggestionRenderer==null||this.suggestionRenderer==undefined){
            this.suggestionRenderer = {
                constructor: SuggestionRenderer,
                props: {
                    id: 'suggestion',
                    label: '{'+this.labelField+'}',
                    value: '{'+this.valueField+'}'
                }
            };
        }
        //TODO: we are overriding those handlers, we should exec them after our internal handlers
        this.suggestionRenderer.props.onclick = this.suggestionRendererClickHandler;
        this.suggestionRenderer.props.ondblclick = this.suggestionRendererDoubleClickHandler;
        this.suggestionRenderer.props.onmousedown = this.suggestionRendererMouseDownHandler;

       
        this.suggestionsRepeater = new Repeater({
            id: 'listRepeater',
            defaultItem: this.defaultItem,
            rendering: {
                direction: 'vertical',
                seperator: this.seperator || false,
                actions: false
            },
            embedded: true,
            dataProvider: this.suggestions,
            components: [this.suggestionRenderer],
            parent: _self
        }).on('blur', function (e) {
            alert("blur");
        }.bind(this));
    },
    removeItem: function(){
        console.log(arguments);
    },
    afterAttach: function (e) {
        if (e.target.id == this.$el.attr('id')) {
            //this.renderSelect2();
        }
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$suggestionsDropDown, events: {
                    'keydown': this.suggestionsDropDownKeyDown.bind(this)
                }
            },
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$input, events: {
                    'change': this.changeHandler.bind(this)
                }
            }
        ]
    },
    suggestionsDropDownKeyDown: function(e){
        if (typeof this.suggestionsdropdownkeydown == 'function')
        this.suggestionsdropdownkeydown.apply(this, arguments);

        if(!e.isDefaultPrevented()){
            switch (e.keyCode) {
                case 13: // ENTER - apply value
                    console.log("DD ENTER");
                    break;
                case 27: // ESC - get back to old value
                    console.log("DD ESCAPE");
                    this.closeSuggestionsList();
                    break;
            }
        }
    },
    tokenInputKeyDown: function(e){
        if (typeof this.tokeninputkeydown == 'function')
            this.tokeninputkeydown.apply(this, arguments);
    
            if(!e.isDefaultPrevented()){
                switch (e.keyCode) {
                    case 13: // ENTER - apply value
                        console.log("ENTER");
                        break;
                    case 27: // ESC - get back to old value
                        console.log("ESCAPE");
                        this.closeSuggestionsList();
                        e.preventDefault();
                        break;
                    case 9: // TAB - apply and move to next column on the same row 
                        console.log("TAB");
                        break;
                    case 40: // TAB - apply and move to next column on the same row 
                        console.log("DOWN Array");
                        this.suggestions  = differenceOnKeyMatch (this.dataProvider, this._value, this.valueField);
                        this.openSuggestionsList();
                        e.preventDefault();
                        break;
                    default:
                        //TODO:Duhet eventi keyup per kete rast
                        this.delayQuerySuggestions(this.tokenInput.value);
                }
            }
    },
    querySuggestions: function(toMatch){
        console.log("querySuggestions for: ", toMatch);
    },
    /*
    <a href="#" class="inputLink">Did you mean xxyYY?</a>
    */
    suggestions:[],
    openSuggestionsList: function(){
        //sugesstions found
        if(this.suggestions.length>0)
        {
            this.suggestionsRepeater.dataProvider = this.suggestions;

            if(this.suggestionsRepeater.$el!=undefined)
                this.suggestionsRepeater.$el.detach();
            this.$suggestionsDropDown.append(this.suggestionsRepeater.render());
        }
        this.$suggestionsDropDown.addClass('show');
        this.$suggestionsDropDown.attr('aria-expanded', true);
       // myAutoComplete.suggestionsRepeater.rowItems[0]['suggestion'].$el.focus();
    },
    closeSuggestionsList: function(){
        this.$suggestionsDropDown.attr('aria-expanded', false);
        this.$suggestionsDropDown.removeClass('show');
        this.tokenInput.$el.focus();
    },
    tokenRendererCloseIconClickHandler: function(e, repeaterEventArgs){
        console.log(repeaterEventArgs);
        //"this" refers to the components in the repeater
        this.parent.parent.removeItemAt(repeaterEventArgs.currentIndex);
    },
    suggestionRendererClickHandler: function(e, repeaterEventArgs){
        console.log(repeaterEventArgs);
        this.parent.parent.addItems(repeaterEventArgs.currentItem);
        this.parent.parent.closeSuggestionsList();
    },
    suggestionRendererDoubleClickHandler: function(e, repeaterEventArgs){
        console.log(repeaterEventArgs);
    },
    suggestionRendererMouseDownHandler: function(e, repeaterEventArgs){
        console.log(repeaterEventArgs);
    },
    addItems: function(items) {
        if(typeof(items)==="object" && !(items instanceof Array)){
            items = [items];
        }
        var itemsToAdd = [];
        for(var i=0;i<items.length;i++){
            var item = items[i];
            if(item != undefined && item != null && item[this.valueField] != undefined && item[this.labelField]!= undefined)
            {
                var itemToAdd = [item];
                if(!this.allowNewItem)
                {
                    itemToAdd = intersectOnKeyMatch(this.dataProvider, itemToAdd, this.valueField) //value;
                    if(itemToAdd.length==0){
                        itemToAdd = intersectOnKeyMatch(this.suggestions, itemToAdd, this.valueField) //value;
                        if(itemToAdd.length==0){
                            console.log("This value was not found in the dataProvider and you are not allowed to add new items.");
                            continue;
                        }
                    }
                }
                itemsToAdd.push(itemToAdd[0]);
            }else
                console.log("Please specify a valid object on row: "+i+". The provided one is either null or doesn`t have '"+his.valueField+"' and '"+this.labelField+"' properties.");
        }
        //TODO:If Repeating will be allowed we need to add condition below based on a new property to control this setting
        itemsToAdd = differenceOnKeyMatch (itemsToAdd, this._value, this.valueField);
        for(var j=0;j<itemsToAdd.length;j++)
        {
            this.tokensRepeater.addRow(itemsToAdd[j]);
        }
        
    },
    removeItemAt: function(index){
        //TODO: If we are going to keep item ordering in the view the save as in value
        if(index>=0 && index<this._value.length){
            this.tokensRepeater.removeRow(index+1, false, false); 
            //this._value.splice(index, 1);
        }else
            console.log("Index out of range. No item will be removed.");
    },
    removeItems: function(items){
        if(typeof(items)==="object" && !(items instanceof Array)){
            items = [items];
        }
        for(var i=0;i<items.length;i++){
            //TODO: Add Validation of the item from the Selectable base behavior
            var matches = getMatching(this._value, this.valueField,  items[i][this.valueField]);
            for(var j=0;j<matches.indices.length;j++){
                this.tokensRepeater.removeRow(matches.indices[j]+1, false, false);     
                //this._value.splice(matches.indices[j], 1);   
            }
        }    
        
    },
    removeAllItems: function(){
        this.tokensRepeater.removeAllRows();
        this._value = [];
    },
    _value: [],
    set value(v){
        if(typeof(v)==="object" && !(v instanceof Array)){
            v = [v];
        }
        if(!this._value.equals(v))
        {
            if(this.tokensRepeater)
            {
                var itemsToRemove = differenceOnKeyMatch(this._value, v, this.valueField) //value;
                this.removeItems(itemsToRemove);  
                this.addItems(v);
                //this._value = v;

                this.trigger('change');
            }else
                this._value = v;
        }
    },
    get value(){
        return this._value;
    },
    allowNewItem: false,
    focus:function(){
        if(this.tokenInput != null)
        {
            this.tokenInput.$el.focus();
        }
    },
    destruct: function () {
       //TODO: Destruct ? 
    },

    enable: function () {
        this.$input.prop("disabled", false);
        this.enabled = true;
        return this;
    },

    disable: function () {
        this.$input.prop("disabled", true);
        this.enabled = false;
        return this;
    },
    changeHandler : function(e){
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },
    mouseDownHandler: function (e) {
        if (typeof this.onmousedown == 'function')
            this.onmousedown.apply(this, arguments);
        
        /*if(!e.isDefaultPrevented()){
            this.handleComponentMouseDown.apply(this, arguments);
        }*/
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

    template: function () {
        var html = 
                         "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>"+
        (!this.embedded?("<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>") : "") +
        (!this.embedded?("<span rv-if='model.blockProcessAttr' class='block-process'> * </span>") : "") +
                            "<select type='hidden' style='display:none' name='" + this.domID + "[]' id='" + this.domID + "_select'></select>" +                          
                            '<div id="'+ this.domID + '_tokenContainer" class="border"></div>'+
                            '<div id="'+ this.domID + '_suggestionsDropDown" class="dropdown-menu" role="menu">'+
                            '</div>'+
                        "</div>"                 
        return html;        
    },

    render: function () {
        this.$tokenContainer.append(this.tokensRepeater.render());
        return this.$el;
    }
});

//component prototype
AutoCompleteEx.type = 'autocomplete';

//register dom element for this component
KxGenerator.registerDOMElement(AutoCompleteEx, 'kx-autocomplete');