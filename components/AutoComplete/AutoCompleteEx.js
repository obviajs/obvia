/**
 * This is an AutoComplete Element
 *
 * Kreatx 2018
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils, StringMatchType } from "/obvia/lib/StringUtils.js";
import { NumberUtils } from "/obvia/lib/NumberUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { debounce } from "/obvia/lib/DecoratorUtils.js";
import { SuggestionRenderer } from "/obvia/components/AutoComplete/SuggestionRenderer.js";
import { TokenRenderer } from "/obvia/components/AutoComplete/TokenRenderer.js";
import { TextInput } from "/obvia/components/TextInput/TextInput.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { Literal } from "/obvia/lib/Literal.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var AutoCompleteEx = function (_props)
{
	let _separator,
		_tokenContainer,
		_tokenRepeater,
		_suggestionsRepeater,
		_input,
		_maxSuggestionsCount,
		_matchType;
	let _dpWatcher;
	Object.defineProperty(this, "matchType", {
		get: function matchType()
		{
			return _matchType;
		},
	});
	let _valueLater;
	Object.defineProperty(this, "dataProvider", {
		get: function dataProvider()
		{
			return _dataProvider;
		},
		set: function dataProvider(v)
		{
			if (_dataProvider != v)
			{
				if (_dpWatcher && _dataProvider)
				{
					_dpWatcher.reset();
					_dataProvider.off("propertyChange", _dpChanged);
				}
				_props.dataProvider = _dataProvider =
					v == null || Array.isArray(v) ? new ArrayEx(v) : v;
				if (_valueLater)
				{
					_self.value = _valueLater;
				}
				if (_dataProvider)
				{
					_dpWatcher = ChangeWatcher.getInstance(_dataProvider);
					_dataProvider.on("propertyChange", _debouncedUpdateDataProvider);
				}
				if (_input && _input.$el[0] == document.activeElement)
					_self.refreshSuggestions();
			}
		},
		enumerable: true,
	});
	let _dpChanged = function (e)
	{
		if (_input && _input.$el[0] == document.activeElement) _self.refreshSuggestions();
	};
	let _debouncedUpdateDataProvider = debounce(_dpChanged, 1);

	Object.defineProperty(this, "valueField", {
		get: function valueField()
		{
			return _valueField;
		},
		set: function valueField(v)
		{
			_valueField = v;
		},
		enumerable: true,
	});
	Object.defineProperty(this, "labelField", {
		get: function labelField()
		{
			return _labelField;
		},
		set: function labelField(v)
		{
			_labelField = v;
		},
		enumerable: true,
	});

	this.endDraw = async function (e)
	{
		if (e.target.id == this.domID)
		{
			_suggestionsRepeater = this.suggestionsRepeater;
			if (!this.getBindingExpression("dataProvider"))
			{
				let d = Literal.fromLiteral(_props.dataProvider);
				this.dataProvider = await Promise.resolve(d).then(function (dv)
				{
					if (dv.hasOwnProperty("parent"))
					{
						dv.parent = _self;
						dv.applyBindings();
					}
					return dv;
				});
			}
			_tokenContainer = this.tokenContainer;
			_input = this.tokenContainer.tokenInput;
			_tokenRepeater = this.tokenContainer.tokenRepeater;
			// _suggestionsRepeater.css.left = "inherit";
			// _suggestionsRepeater.css.top = "inherit";
			// _suggestionsRepeater.css.position = "relative";
		}
	};

	this.beforeAttach = function (e)
	{
		if (e.target.id == this.domID)
		{
			if (_props.value && !this.getBindingExpression("value"))
			{
				this.value = _props.value;
			}
		}
	};

	this.afterAttach = function (e)
	{
		if (e.target.id == this.domID)
		{
		}
	};

	let _tokenRendererClickHandler = function (e) { };

	let _tokenRendererDoubleClickHandler = function (e) { };

	let _tokenRendererMouseDownHandler = function (e) { };

	let _tokenInputReSize = function ()
	{
		//_tokenRepeater.token[0].$el.width()
		if (_tokenRepeater)
		{
			let tokenCount =
				_tokenRepeater.dataProvider == null
					? 0
					: _tokenRepeater.dataProvider.length;
			let tokenWidth = 0,
				rowTop = 0,
				tokenTop = 0;
			for (let i = 0; i < tokenCount; i++)
			{
				let tokenPos = _tokenRepeater.token[i].$el.position();
				if (tokenPos.top != rowTop)
				{
					tokenTop = tokenPos.top;
					tokenWidth = _tokenRepeater.token[i].$el[0].clientWidth;
				} else
				{
					tokenWidth += _tokenRepeater.token[i].$el[0].clientWidth;
				}
			}
			if (_self.$el.width() > 0 && tokenWidth >= 0)
			{
				tokenWidth += tokenWidth
					? 2 /*border*/ + 2 /*margin*/
					: 2 /*border of main container*/;
				_input.$el.css({
					width: "calc(100% - " + tokenWidth + "px)",
				});
			}
		}
	};

	let _suggestionsDropDownKeyDown = function (e)
	{
		if (typeof _self.suggestionsdropdownkeydown == "function")
			_self.suggestionsdropdownkeydown.apply(this, arguments);

		if (!e.isDefaultPrevented())
		{
			switch (e.keyCode)
			{
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
	let _suggestionRendererKeyDownHandler = function (e, repeaterEventArgs)
	{
		switch (e.keyCode)
		{
			case 9: // TAB - apply and move to next column on the same row
				console.log("TAB");

				console.log(repeaterEventArgs);
				//this.parent.parent.addTokenItems(repeaterEventArgs.currentItem);
				if (_self.multiSelect)
				{
					//TODO:check because concat will return a new value
					_self.value.splice(
						_self.value.length,
						0,
						repeaterEventArgs.currentItem
					);
				} else
				{
					_self.value = repeaterEventArgs.currentItem;
				}

				_self.removeSuggestionItemAt(repeaterEventArgs.currentIndex);
				// acEx.closeSuggestionsList();
				_closeSuggestionsList();
				_input.$el.focus();
				break;
		}
	};

	let _tokenInputKeyDown = function (e)
	{
		if (typeof _inputkeydown == "function")
			_inputkeydown.apply(_self, arguments);

		// _closeSuggestionsList();

		if (!e.isDefaultPrevented())
		{
			switch (e.keyCode)
			{
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
					_suggestions = ArrayUtils.differenceOnKeyMatch(
						_dataProvider,
						_value,
						_valueField
					);
					_openSuggestionsList();
					e.preventDefault();
					break;
			}
		}
	};

	let _tokenInputKeyUp = function (e)
	{
		if (this.value)
		{
			_openSuggestionsList();
		} else
		{
			_closeSuggestionsList();
		}
		if (!e.isDefaultPrevented())
		{
			let inp = String.fromCharCode(e.keyCode);
			if (/[a-zA-Z0-9-_ ]/.test(inp))
			{
				let t = _delayQuerySuggestions(_input.value);
				//clearTimeout(t);
			} else if (e.keyCode == 8)
			{
				if (_input.value == "")
				{
					_delayRemoveTokenItemAt(_self.value.length - 1);
				}
			}
		}
	};

	this.refreshSuggestions = function ()
	{
		if (_input) _querySuggestions(_input.value);
	};

	let _querySuggestions = function (toMatch)
	{
		console.log("querySuggestions for: ", toMatch);
		let ac = ArrayUtils.differenceOnKeyMatch(
			_dataProvider,
			_value,
			_valueField
		);
		_suggestions = new ArrayEx(
			StringUtils.sortBestMatch(
				ac,
				toMatch,
				_self.matchType,
				_labelField,
				_maxSuggestionsCount
			)
		);
		_openSuggestionsList();
	};

	let _openSuggestionsList = function ()
	{
		//suggestions found
		if (_suggestions.length > 0)
		{
			_suggestionsRepeater.dataProvider = _suggestions;
			let cls = _suggestionsRepeater.classes.slice(0);
			cls.pushUnique("show");
			_suggestionsRepeater.classes = cls;
			_suggestionsRepeater.attr["aria-expanded"] = true;
		} else
		{
			_closeSuggestionsList();
			_input.$el
				.attr("placeholder", "No results found :(")
				.delay(1000)
				.queue(function (n)
				{
					$(this).attr("placeholder", _placeholder);
					n();
				});
			_self.trigger("noSuggestionsFound", [_input.value]);
		}
		// myAutoComplete.suggestionsRepeater.rowItems[0]['suggestion'].$el.focus();
	};
	let _closeSuggestionsList = function ()
	{
		_suggestionsRepeater.attr["aria-expanded"] = false;
		let cls = _suggestionsRepeater.classes.slice(0);
		let ind = cls.indexOf("show");
		if (ind > -1)
		{
			cls.splice(ind, 1);
		}
		_suggestionsRepeater.classes = cls;
		_input.$el.focus();
	};
	let _tokenRendererCloseIconClickHandler = function (e, repeaterEventArgs)
	{
		if (_enabled)
		{
			console.log(repeaterEventArgs);
			//"this" refers to the components in the repeater
			this.removeTokenItemAt(repeaterEventArgs.currentIndex);
			_input.$el.focus();
		}
	};
	let _suggestionRendererClickHandler = function (e, repeaterEventArgs)
	{
		console.log(repeaterEventArgs);
		//this.parent.parent.addTokenItems(repeaterEventArgs.currentItem);
		if (_self.multiSelect)
		{
			//TODO:check because concat will return a new value
			// _self.value = _self.value.splicea(_self.value.length, 0, [repeaterEventArgs.currentItem]);
			_self.value.splice(_self.value.length, 0, repeaterEventArgs.currentItem);
		} else
		{
			_self.value = repeaterEventArgs.currentItem;
		}

		_self.removeSuggestionItemAt(repeaterEventArgs.currentIndex);
		// acEx.closeSuggestionsList();
		_closeSuggestionsList();
		_input.$el.focus();
	};
	let _suggestionRendererDoubleClickHandler = function (e, repeaterEventArgs)
	{
		console.log(repeaterEventArgs);
	};
	let _suggestionRendererMouseDownHandler = function (e, repeaterEventArgs)
	{
		console.log(repeaterEventArgs);
	};
	this.removeSuggestionItemAt = function (index)
	{
		//TODO: If we are going to keep item ordering in the view the save as in value
		if (index >= 0 && index < _suggestions.length)
		{
			_suggestions.splice(index, 1);
			//this._value.splice(index, 1);
		} else console.log("Index out of range. No item will be removed.");
	};
	this.removeTokenItemAt = function (index)
	{
		//TODO: If we are going to keep item ordering in the view the save as in value
		if (index >= 0 && index < _value.length)
		{
			let tmp = _value.slice(0);
			tmp.splice(index, 1);
			_self.value = tmp;
		} else console.log("Index out of range. No item will be removed.");
	};
	this.removeTokenItems = function (items)
	{
		if (typeof items === "object" && !(items instanceof Array))
		{
			items = [items];
		}
		for (let i = 0; i < items.length; i++)
		{
			//TODO: Add Validation of the item from the Selectable base behavior
			let matches = ArrayUtils.getMatching(
				_value,
				_valueField,
				items[i][_valueField]
			);
			for (let j = 0; j < matches.indices.length; j++)
			{
				_value.splice(matches.indices[j], 1);
			}
		}
	};

	this.removeAllTokenItems = function ()
	{
		//_tokenRepeater.removeAllRows();
		_value.splice(0, _value.length);
	};
	Object.defineProperty(this, "multiSelect", {
		get: function multiSelect()
		{
			return _multiSelect;
		},
		set: function multiSelect(v)
		{
			if (_multiSelect != v) _multiSelect = v;
		},
		enumerable: true,
	});
	Object.defineProperty(this, "value", {
		get: function value()
		{
			return _value;
		},
		set: function value(v)
		{
			if (_valueLater && typeof v === "object" && !v.forEach)
			{
				v = v[_valueField];
			}
			_valueLater = null;
			if (v)
			{
				if (StringUtils.isString(v) || NumberUtils.isNumber(v))
				{
					let ind = ArrayUtils.indexOfObject(_dataProvider, _valueField, v);
					if (ind > -1)
					{
						v = _dataProvider[ind];
					} else
					{
						let vo = {};
						vo[_labelField] = v;
						vo[_valueField] = v;
						if (_allowNewItem) v = vo;
						else _valueLater = vo;
					}
				}
				if (typeof v === "object" && !v.forEach)
				{
					v = [v];
				}
				if (_valueLater == null)
				{
					let e = jQuery.Event("beforeChange");
					e.newValue = v;
					e.oldValue = _value;
					this.proxyMaybe.trigger(e);
					if (!e.isDefaultPrevented())
					{
						//is the tokenRepeater rendered yet ?
						if (_tokenRepeater && _tokenRepeater.$container)
						{
							_tokenRepeater.dataProvider = _value = new ArrayEx(v);
							_input.value = "";
							this.trigger("change");
						} else _value.splicea(0, _value.length, v);
					}
				}
			} else
			{
				let e = jQuery.Event("beforeChange");
				e.newValue = v;
				e.oldValue = _value;
				this.proxyMaybe.trigger(e);
				if (!e.isDefaultPrevented())
				{
					_value.splice(0, _value.length);
					this.trigger("change");
				}
			}
		}
	});

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
		type: "",
		valueField: "id",
		labelField: "text",
		placeholder: "Search...",
		matchType: StringMatchType.CONTAINS,
		classes: ["dropdown"]
	};
	ObjectUtils.fromDefault(_defaultParams, _props);
	//_props = ObjectUtils.extend(false, false, _defaultParams, _props);
	if (!_props.attr)
	{
		_props.attr = {};
	}
	if (!_props.value)
	{
		_props.value = new ArrayEx([]);
	}
	_maxSuggestionsCount = _props.maxSuggestionsCount;
	_props.attr["data-triggers"] = "noSuggestionsFound beforeChange input";

	let _valueField = _props.valueField;
	let _labelField = _props.labelField;
	let _placeholder = _props.placeholder;
	let _dataProvider;
	_matchType = _props.matchType;

	let _allowNewItem = _props.allowNewItem;
	let _closeIconSide = _props.closeIconSide;
	let _suggestions = new ArrayEx([]);
	let _enabled = true;

	let _delayQuerySuggestions = debounce(_querySuggestions, 400);
	let _delayRemoveTokenItemAt = debounce.call(
		this,
		this.removeTokenItemAt,
		200
	);
	let _multiSelect = _props.multiSelect;
	let _self = this;
	let _value = new ArrayEx([]);

	let _suggestionRenderer = {
		ctor: SuggestionRenderer,
		props: {
			id: "suggestion",
			label: "{" + _labelField + "}",
			value: "{" + _valueField + "}",
			click: _suggestionRendererClickHandler,
			dblclick: _suggestionRendererDoubleClickHandler,
			mousedown: _suggestionRendererMouseDownHandler,
			keydown: _suggestionRendererKeyDownHandler,
			classes: ["dropdown-item"]
		},
	};
	//TODO: we are overriding those handlers, we should exec them after our internal handlers

	let _tokenRenderer = {
		ctor: TokenRenderer,
		props: {
			id: "token",
			label: "{?" + _labelField + "}",
			value: "{?" + _valueField + "}",
			closeiconclick: _tokenRendererCloseIconClickHandler.bind(this),
			closeIconSide: _closeIconSide,
			click: _tokenRendererClickHandler,
			dblclick: _tokenRendererDoubleClickHandler,
			mousedown: _tokenRendererMouseDownHandler,
			css: {
				// "float": "left",
				display: "flex",
				"justify-content": "space-between",
				"align-items": "center",
				width: "100%",
				"text-overflow": "ellipsis",
			},
		},
	};

	let _cmps = [
		{
			ctor: Container,
			props: {
				id: "tokenContainer",
				type: "",
				classes: ["border", "d-flex"],
				attr: {
					role: "menu",
				},
				components: [
					{
						ctor: Repeater,
						props: {
							id: "tokenRepeater",
							defaultItem: this.defaultItem,
							rendering: {
								direction: "horizontal",
								separator: _separator || false,
								wrap: false
							},
							classes: [],
							css: {
								width: "min-content",
								"max-width": "100%",
							},
							ownerDocument: this.ownerDocument,
							dataProvider: _value,
							components: [_tokenRenderer],
							dataProviderUpdate: _tokenInputReSize
						}
					},
					{
						ctor: TextInput,
						props: {
							id: "tokenInput",
							attr: {
								placeholder: _placeholder,
							},
							enabled: _enabled,
							versionStyle: "",
							keydown: _tokenInputKeyDown,
							keyup: _tokenInputKeyUp,
							classes: ["border-0", "ellipsis"],
							ownerDocument: this.ownerDocument,
							css: {
								outline: "none",
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
				id: "suggestionsRepeater",
				type: "",
				classes: ["dropdown-menu"],
				defaultItem: this.defaultItem,
				rendering: {
					direction: "vertical",
					separator: _separator || false,
					actions: false,
					wrap: false
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
		get: function enabled()
		{
			return _enabled;
		},
		set: function enabled(v)
		{
			if (_enabled != v)
			{
				_enabled = v;
				if (_input)
				{
					if (!v)
						_input.$el.attr('disabled', 'disabled');
					else
						_input.$el.removeAttr('disabled');
				}
			}
		},
		configurable: true,
		enumerable: true,
	});

	Object.defineProperty(this, "maxSuggestionsCount", {
		get: function maxSuggestionsCount()
		{
			return _maxSuggestionsCount;
		},
		set: function maxSuggestionsCount(v)
		{
			if (_maxSuggestionsCount != v)
			{
				_maxSuggestionsCount = v;
			}
		},
		configurable: true,
		enumerable: true,
	});

	this.focus = function ()
	{
		if (_input)
		{
			_input.$el[0].focus({
				preventScroll: true,
			});
		}
	};

	return r;
};
AutoCompleteEx.prototype.ctor = "AutoCompleteEx";
DependencyContainer.getInstance().register(
	"AutoCompleteEx",
	AutoCompleteEx,
	DependencyContainer.simpleResolve
);
export { AutoCompleteEx };
