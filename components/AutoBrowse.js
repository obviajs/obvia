/**
 * This is an AutoBrowse Element
 *
 * Kreatx 2019
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils, StringMatchType } from "/obvia/lib/StringUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { Button } from "/obvia/components/Button/Button.js";
import { Modal, ModalSize } from "/obvia/components/Modal/Modal.js";
import { Label, LabelType } from "/obvia/components/Label.js";
import { DataGrid } from "/obvia/components/DataGrid/DataGrid.js";
import { AutoCompleteEx } from "/obvia/components/AutoComplete/AutoCompleteEx.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var AutoBrowse = function (_props) {
	let _self = this;
	let _dataProvider,
		_bindingDefaultContext,
		_valueField,
		_labelField,
		_value,
		_columns = [],
		_fields, _enabled = true, _btn;
	let _dgUID = StringUtils.guid();

	Object.defineProperty(this, "dataProvider", {
		get: function dataProvider() {
			return _dataProvider;
		},
		set: function dataProvider(v) {
			if (_dataProvider != v) {
				_dataProvider = v;
				_autocomplete.dataProvider = v;
				_dg.dataProvider = v;
			}
		},
		enumerable: true,
	});

	Object.defineProperty(this, "valueField", {
		get: function valueField() {
			return _valueField;
		},
		set: function valueField(v) {
			_autocomplete.valueField = _valueField = v;
		},
		enumerable: true,
	});

	Object.defineProperty(this, "labelField", {
		get: function labelField() {
			return _labelField;
		},
		set: function labelField(v) {
			_autocomplete.labelField = _labelField = v;
		},
		enumerable: true,
	});

	Object.defineProperty(this, "value", {
		get: function value() {
			return _autocomplete.value;
		},
		set: function value(v) {
			_autocomplete.value = v;
		},
		enumerable: true,
	});

	this.endDraw = function (e) {
		if (e.target.id == this.domID) {
			_autocomplete = this["autocomplete"];
			_modal = this.children[this.components[2].props.id];
			_dg = _modal.modalDialog.modalContent.modalBody["dataGrid_" + _dgUID];
			_btn = this["workArea_53_"+_dgUID]["selectBtn_" + _dgUID];
		}
	};

	this.beforeAttach = function (e) {
		if (e.target.id == this.domID) {
			if (_props.value) {
				this.value = _props.value;
			}
			e.preventDefault();
		}
	};
	let _cmps, _autocomplete, _dg, _modal;
	var fnContainerDelayInit = function () {
		_cmps = [
			{
				ctor: AutoCompleteEx,
				props: {
					id: "autocomplete",
					valueField: _valueField,
					labelField: _labelField,
					allowNewItem: _props.allowNewItem, //allow the user to add items that are not included in the specified dataProvider
					dataProvider: _dataProvider,
					bindingDefaultContext: _bindingDefaultContext,
					value: _value,
					multiSelect: false,
					placeholder: _props.placeholder,
					matchType: StringMatchType.STARTS_WITH,
					css: { "flex-grow": "1", width: "80%" },
				},
			},
			{
				ctor: Container,
				props: {
					type: "",
					id: "workArea_53_"+_dgUID,
					components: [
						{
							ctor: Button,
							props: {
								id: "selectBtn_"+_dgUID,
								type: "button",
								components: [
									{
										ctor: Label,
										props: {
											id: "fa",
											labelType: LabelType.i,
											classes: ["fas", "fa-folder-open"],
										},
									},
								],
								click: _browse,
							}
						}
					]
				}
			},
			{
				ctor: Modal,
				props: {
					id: "recordSelectModal",
					size: ModalSize.LARGE,
					title: _props.title,
					components: [
						{
							ctor: DataGrid,
							props: {
								id: "dataGrid_"+_dgUID,
								allowNewItem: _props.allowNewItem, //allow the user to add items that are not included in the specified dataProvider
								rowCount: 5, //visible rows count - virtual scrolling wil be applied on scroll
								dataProvider: _dataProvider,
								columns: _columns,
								rowDblClick: _selectItem.bind(_self),
							}
						}
					],
					displayListUpdated: _drawGrid,
				}
			}
		];
	};

	var _drawGrid = function (e) {
		_dg.updateDisplayList();
	};

	let _browse = function (e) {
		let evt = jQuery.Event("browse");
		_self.trigger(evt);
		if (!evt.isDefaultPrevented()) {
			_modal.show();
		}
	};
	let _selectItem = function (e, odg, ra) {
		_autocomplete.value = ra.currentItem;
		_modal.hide();
	};

	let _initColumns = function () {
		for (let i = 0; i < _fields.length; i++) {
			let cprops = {
				width: 400,
				field: _fields[i].field,
				description: _fields[i].description,
				visible: _fields[i].visible ? _fields[i].visible : true,
				sortable: true,
				sortInfo: {
					sortOrder: 0,
					sortDirection: "ASC",
				},
			};
			if (_fields[i].itemRenderer)
				cprops.itemRenderer = _fields[i].itemRenderer;
			if (_fields[i].itemEditor)
				cprops.itemEditor = _fields[i].itemEditor;
			_columns.push(cprops);
		}
	};

	let _defaultParams = {
		type: "",
		components: [],
		dataProvider: new ArrayEx(),
		fields: [],
		attr: {
			"data-triggers": "browse",
		},
		value: new ArrayEx([]),
		classes: ["d-inline-flex"],
		valueField: "",
		allowNewItem: false,
		title: "Select an Item"
	};
	ObjectUtils.fromDefault(_defaultParams, _props);
	//_props = ObjectUtils.extend(false, false, _defaultParams, _props);
	if (!_props.attr) {
		_props.attr = {};
	}
	if (!_props.classes) {
		_props.classes = ["d-flex"];
	} else _props.classes.pushUnique("d-flex");

	let myDtEvts = ["browse"];
	if (
		!ObjectUtils.isEmpty(_props.attr) &&
		_props.attr["data-triggers"] &&
		!ObjectUtils.isEmpty(_props.attr["data-triggers"])
	) {
		let dt = _props.attr["data-triggers"].split(" ");
		for (let i = 0; i < dt.length; i++) {
			myDtEvts.pushUnique(dt[i]);
		}
	}
	_props.attr["data-triggers"] = myDtEvts.join(" ");

	if (_props.dataProvider && !StringUtils.getBindingExp(_props.dataProvider)) {
		_dataProvider = _props.dataProvider;
	}
	if (_props.bindingDefaultContext) {
		_bindingDefaultContext = _props.bindingDefaultContext;
	}
	_valueField = _props.valueField;
	_labelField = _props.labelField;
	_value = _props.value;
	_fields = _props.fields;
	_initColumns();
	fnContainerDelayInit();
	_props.components = _cmps;

	let r = Container.call(this, _props, true);

	Object.defineProperty(this, "enabled", {
		get: function enabled() {
			return _enabled;
		},
		set: function enabled(v) {
			if (_enabled != v) {
				_enabled = v;
				_autocomplete.enabled = v;
				_btn.enabled = v;
			}
		},
		configurable: true,
		enumerable: true,
	});
	return r;
};
DependencyContainer.getInstance().register(
	"AutoBrowse",
	AutoBrowse,
	DependencyContainer.simpleResolve
);
AutoBrowse.prototype.ctor = "AutoBrowse";
export { AutoBrowse };
